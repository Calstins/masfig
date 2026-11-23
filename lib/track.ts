"use client";

import { getApiUrl } from "./api";

type Evt =
  | "whatsapp_click"
  | "call_click"
  | "email_click"
  | "quote_submit"
  | "product_view";

interface Tags {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  dataLayer?: unknown[];
  __masfigAds?: { id: string; label: string };
}

/** Meta standard events matching each action, so Ads Manager can optimise for them. */
const META_EVENT: Record<Evt, string> = {
  quote_submit: "Lead",
  whatsapp_click: "Contact",
  call_click: "Contact",
  email_click: "Contact",
  product_view: "ViewContent",
};

/* ---------- MASFIG's own statistics (shown in Admin > Tracking) ----------
 * Cookie-free and anonymous. Visits from a browser that is signed in to the admin, and visitors who send "Do Not Track"
 * or Global Privacy Control, are not counted. Quote requests are counted on the server from the enquiries themselves. */
const REF_KEY = "masfig_ref";
let lastPath = "";
let lastPathAt = 0;

function countable(): boolean {
  try {
    if (window.location.pathname.startsWith("/admin")) return false;
    if (localStorage.getItem("admin_token")) return false;
    const n = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (n.doNotTrack === "1" || n.globalPrivacyControl) return false;
    return true;
  } catch {
    return true;
  }
}

/** The outside site that sent the visitor, remembered for the whole visit so every page of the visit shares one source. */
function sessionReferrer(): string | undefined {
  try {
    let r = sessionStorage.getItem(REF_KEY);
    if (r === null) {
      const ext = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
      sessionStorage.setItem(REF_KEY, ext);
      r = ext;
    }
    return r || undefined;
  } catch {
    return undefined;
  }
}

function collect(type: string, label?: string) {
  if (typeof window === "undefined" || !countable()) return;
  try {
    const body = JSON.stringify({
      type,
      path: window.location.pathname,
      label: label ? String(label).slice(0, 120) : undefined,
      ref: sessionReferrer(),
      utm: readUtm().utm_source,
    });
    // text/plain keeps this a "simple" request, so the browser sends no extra preflight for every event
    void fetch(getApiUrl("/track"), { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
  } catch {
    /* statistics must never break the page */
  }
}

/** Call once per page view (the layout does this on every route change). */
export function trackPageview() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const p = window.location.pathname;
  if (p === lastPath && now - lastPathAt < 1500) return; // dev double-render or a quick re-render
  lastPath = p;
  lastPathAt = now;
  collect("pageview");
}

/**
 * One call fans out to every tool that is installed: the GTM data layer, GA4, Meta Pixel and (for quote requests)
 * the Google Ads lead conversion. Tools that are not configured, or not yet accepted, are simply skipped.
 */
let lastWa = 0;
let lastCall = 0;
let lastMail = 0;

export function track(
  event: Evt,
  params: Record<string, string | number | undefined> = {},
) {
  if (typeof window === "undefined") return;
  if (event === "whatsapp_click") {
    // a button with its own tracking and the global listener below must count once
    const now = Date.now();
    if (now - lastWa < 1000) return;
    lastWa = now;
  }
  if (event === "call_click") {
    const now = Date.now();
    if (now - lastCall < 1000) return;
    lastCall = now;
  }
  if (event === "email_click") {
    const now = Date.now();
    if (now - lastMail < 1000) return;
    lastMail = now;
  }
  if (event !== "quote_submit") {
    const label = event === "product_view" ? params.product : params.location;
    collect(event, label === undefined ? undefined : String(label));
  }
  const w = window as unknown as Tags;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, page_path: window.location.pathname, ...params });
  try {
    // GA4 direct (gtag pushes to the same data layer, so GTM containers can still read it)
    if (w.gtag) w.gtag("event", event, params);
    if (w.fbq)
      w.fbq(
        "track",
        META_EVENT[event],
        event === "product_view"
          ? { content_name: String(params.product ?? "") }
          : {},
      );
    if (event === "quote_submit" && w.gtag && w.__masfigAds?.label)
      w.gtag("event", "conversion", {
        send_to: `${w.__masfigAds.id}/${w.__masfigAds.label}`,
      });
  } catch {
    /* a blocked tracker must never break the page */
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const KEY = "masfig_utm";

/** Remember first-touch UTMs for the session so a later quote form can attribute the lead. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 150);
    });
    if (Object.keys(found).length)
      sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* storage unavailable */
  }
}

export function readUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Counts a click on ANY WhatsApp, phone (tel:) or email (mailto:) link on the site (menu, footer, banners, hero, category
 * and delivery pages...), so a new button is tracked without extra code. Buttons that already call track() with extra
 * details (product name) fire first and win; the duplicate guard in track() drops this second call. Returns a cleanup function.
 */
export function trackWhatsappLinks() {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    if (window.location.pathname.startsWith("/admin") || !(e.target instanceof Element)) return;
    const el = e.target.closest(
      'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"], a[href^="tel:"], a[href^="mailto:"]',
    );
    if (!el) return;
    const href = el.getAttribute("href") || "";
    const location = el.closest("footer") ? "footer" : el.closest("header, nav") ? "header" : "page";
    track(href.startsWith("tel:") ? "call_click" : href.startsWith("mailto:") ? "email_click" : "whatsapp_click", { location });
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
