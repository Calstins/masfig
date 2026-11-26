import type { TrackingConfig } from './types'

/**
 * Fallback tracking IDs for when Admin > Tracking has nothing saved, or the saved value is not usable (wrong format, or the
 * request failed). Set them as build variables (Cloudflare Pages > Settings > Variables) and they are used automatically.
 * NEXT_PUBLIC_* values are copied into the build, so each one is written out in full below.
 */
const ENV: Partial<TrackingConfig> = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '1158961047062261',
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  facebookDomainVerification: process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION,
}

/** What a usable value looks like. Anything else is treated as "not functional" and the fallback is used instead. */
const VALID: Partial<Record<keyof TrackingConfig, RegExp>> = {
  gtmId: /^GTM-[A-Z0-9]{4,}$/,
  ga4Id: /^G-[A-Z0-9]{6,}$/,
  metaPixelId: /^\d{10,18}$/,
  googleAdsId: /^AW-\d{6,}$/,
  clarityId: /^[a-z0-9]{6,}$/i,
}

const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** The saved (admin) value wins when it is present and well formed; otherwise the build variable is used. */
export function withTrackingFallback(saved: Partial<TrackingConfig> | null | undefined, base: TrackingConfig): TrackingConfig {
  const out: TrackingConfig = { ...base, ...(saved ?? {}) }
  for (const key of Object.keys(ENV) as Array<keyof TrackingConfig>) {
    const value = clean(out[key])
    const ok = value && (!VALID[key] || VALID[key]!.test(value))
    ;(out as unknown as Record<string, unknown>)[key] = ok ? value : clean(ENV[key])
  }
  return out
}
