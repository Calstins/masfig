'use client'

type Evt = 'whatsapp_click' | 'call_click' | 'quote_submit' | 'product_view'

interface Tags {
  gtag?: (...a: unknown[]) => void
  fbq?: (...a: unknown[]) => void
  dataLayer?: unknown[]
  __masfigAds?: { id: string; label: string }
}

/** Meta standard events matching each action, so Ads Manager can optimise for them. */
const META_EVENT: Record<Evt, string> = { quote_submit: 'Lead', whatsapp_click: 'Contact', call_click: 'Contact', product_view: 'ViewContent' }

/**
 * One call fans out to every tool that is installed: the GTM data layer, GA4, Meta Pixel and (for quote requests)
 * the Google Ads lead conversion. Tools that are not configured, or not yet accepted, are simply skipped.
 */
export function track(event: Evt, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as Tags
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, page_path: window.location.pathname, ...params })
  try {
    // GA4 direct (gtag pushes to the same data layer, so GTM containers can still read it)
    if (w.gtag) w.gtag('event', event, params)
    if (w.fbq) w.fbq('track', META_EVENT[event], event === 'product_view' ? { content_name: String(params.product ?? '') } : {})
    if (event === 'quote_submit' && w.gtag && w.__masfigAds?.label) w.gtag('event', 'conversion', { send_to: `${w.__masfigAds.id}/${w.__masfigAds.label}` })
  } catch { /* a blocked tracker must never break the page */ }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const KEY = 'masfig_utm'

/** Remember first-touch UTMs for the session so a later quote form can attribute the lead. */
export function captureUtm() {
  if (typeof window === 'undefined') return
  try {
    const q = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    UTM_KEYS.forEach((k) => { const v = q.get(k); if (v) found[k] = v.slice(0, 150) })
    if (Object.keys(found).length) sessionStorage.setItem(KEY, JSON.stringify(found))
  } catch { /* storage unavailable */ }
}

export function readUtm(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '{}') } catch { return {} }
}
