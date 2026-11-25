"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { captureUtm, trackWhatsappLinks } from "@/lib/track";
import { EMPTY_TRACKING, type TrackingConfig } from "@/lib/types";


const hasAnyTag = (t: TrackingConfig) =>
  !!(t.gtmId || t.ga4Id || t.metaPixelId || t.googleAdsId || t.clarityId);

/**
 * Loads the tools configured in Admin > Tracking. The values baked in at build time are used straight away; a small
 * request then picks up changes saved in the admin since the last build, so edits show on the live site within
 * about a minute without waiting for a redeploy. * and nothing ever loads on /admin.
 */
export function ConsentAndTags({ initial }: { initial: TrackingConfig }) {
  const pathname = usePathname();
  const [cfg, setCfg] = useState<TrackingConfig>({
    ...EMPTY_TRACKING,
    ...initial,
  });

  useEffect(() => {
    captureUtm();
    fetch(getApiUrl("/sections/tracking"))
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Partial<TrackingConfig> | null) => {
        if (d && typeof d === "object") setCfg({ ...EMPTY_TRACKING, ...d });
      })
      .catch(() => {
        /* keep the build-time values */
      });
    return trackWhatsappLinks();
  }, []);

  if (pathname?.startsWith("/admin") || !hasAnyTag(cfg)) return null;

  const allowed = true; // tags always load (no cookie banner)

  return (
    <>
      {allowed && cfg.gtmId && (
        <Script id="gtm" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          (function(w,d,s,l,i){var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.gtmId}');
        `}</Script>
      )}

      {allowed && (cfg.ga4Id || cfg.googleAdsId) && (
        <>
          <Script
            id="gtag-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${cfg.ga4Id || cfg.googleAdsId}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            window.gtag=function(){window.dataLayer.push(arguments);};
            gtag('js',new Date());
            ${cfg.ga4Id ? `gtag('config','${cfg.ga4Id}');` : ""}
            ${cfg.googleAdsId ? `gtag('config','${cfg.googleAdsId}');window.__masfigAds={id:'${cfg.googleAdsId}',label:'${cfg.googleAdsLeadLabel}'};` : ""}
          `}</Script>
        </>
      )}

      {/* the build-time pixel is already in the page <head>; only load here when the ID was changed in the admin since the last build */}
      {allowed && cfg.metaPixelId && cfg.metaPixelId !== initial.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${cfg.metaPixelId}');fbq('track','PageView');
        `}</Script>
      )}

      {allowed && cfg.clarityId && (
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${cfg.clarityId}");
        `}</Script>
      )}

    </>
  );
}
