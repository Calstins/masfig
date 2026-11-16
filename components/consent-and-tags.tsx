'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { getApiUrl } from '@/lib/api'
import { captureUtm } from '@/lib/track'
import { EMPTY_TRACKING, type TrackingConfig } from '@/lib/types'

const KEY = 'masfig_consent'

const hasAnyTag = (t: TrackingConfig) => !!(t.gtmId || t.ga4Id || t.metaPixelId || t.googleAdsId || t.clarityId)

/**
 * Loads the tools configured in Admin > Tracking. The values baked in at build time are used straight away; a small
 * request then picks up changes saved in the admin since the last build, so edits show on the live site within
 * about a minute without waiting for a redeploy. Nothing loads before the visitor accepts (unless the admin turned
 * "ask for consent" off), and nothing ever loads on /admin.
 */
export function ConsentAndTags({ initial }: { initial: TrackingConfig }) {
  const pathname = usePathname()
  const [cfg, setCfg] = useState<TrackingConfig>({ ...EMPTY_TRACKING, ...initial })
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    captureUtm()
    try {
      const v = localStorage.getItem(KEY)
      if (v === 'granted' || v === 'denied') setChoice(v) // eslint-disable-line react-hooks/set-state-in-effect -- storage is only readable after mount
    } catch { /* storage blocked */ }
    setReady(true)
    fetch(getApiUrl('/sections/tracking'))
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Partial<TrackingConfig> | null) => { if (d && typeof d === 'object') setCfg({ ...EMPTY_TRACKING, ...d }) })
      .catch(() => { /* keep the build-time values */ })
  }, [])

  if (pathname?.startsWith('/admin') || !hasAnyTag(cfg)) return null

  const decide = (v: 'granted' | 'denied') => {
    setChoice(v)
    try { localStorage.setItem(KEY, v) } catch { /* ignore */ }
  }
  const allowed = cfg.requireConsent ? choice === 'granted' : choice !== 'denied'

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
          <Script id="gtag-lib" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${cfg.ga4Id || cfg.googleAdsId}`} />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            window.gtag=function(){window.dataLayer.push(arguments);};
            gtag('js',new Date());
            ${cfg.ga4Id ? `gtag('config','${cfg.ga4Id}');` : ''}
            ${cfg.googleAdsId ? `gtag('config','${cfg.googleAdsId}');window.__masfigAds={id:'${cfg.googleAdsId}',label:'${cfg.googleAdsLeadLabel}'};` : ''}
          `}</Script>
        </>
      )}

      {allowed && cfg.metaPixelId && (
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

      {cfg.requireConsent && ready && choice === null && (
        <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 inset-x-0 z-[60] p-3 md:p-4">
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-white p-4 shadow-xl flex flex-col sm:flex-row gap-3 sm:items-center">
            <p className="text-sm text-ink-soft flex-1">We use cookies to measure visits and improve our site. You can accept or decline analytics and advertising cookies. <Link href="/privacy/" className="underline">Privacy</Link></p>
            <div className="flex gap-2">
              <button onClick={() => decide('denied')} className="rounded-full px-4 py-2 text-sm text-ink-soft hover:bg-surface">Decline</button>
              <button onClick={() => decide('granted')} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">Accept</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
