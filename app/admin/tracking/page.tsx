'use client'

import { useEffect, useState, FormEvent } from 'react'
import { FormSection, Field, Input, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { btnPrimary } from '@/components/admin/ui'
import { ApiError, api, rebuildNote } from '@/lib/admin-api'
import { EMPTY_TRACKING, type TrackingConfig } from '@/lib/types'

const clean = (v: string) => v.trim()
const FORMATS: Partial<Record<keyof TrackingConfig, [RegExp, string]>> = {
  gtmId: [/^(GTM-[A-Z0-9]{4,10})?$/, 'Looks like GTM-XXXXXXX'],
  ga4Id: [/^(G-[A-Z0-9]{6,14})?$/, 'Looks like G-XXXXXXXXXX'],
  metaPixelId: [/^(\d{10,18})?$/, 'Digits only, 15–16 long'],
  googleAdsId: [/^(AW-\d{6,12})?$/, 'Looks like AW-123456789'],
  googleAdsLeadLabel: [/^([A-Za-z0-9_-]{6,40})?$/, 'Letters, digits, - and _ only'],
  clarityId: [/^([a-z0-9]{6,14})?$/, 'Lowercase letters and digits'],
  googleSiteVerification: [/^([A-Za-z0-9_-]{20,80})?$/, 'Paste only the code inside content="…"'],
  bingSiteVerification: [/^([A-Za-z0-9]{16,64})?$/, 'Paste only the code inside content="…"'],
  facebookDomainVerification: [/^([a-z0-9]{20,40})?$/, 'Paste only the code inside content="…"'],
}

export default function TrackingPage() {
  const [cfg, setCfg] = useState<TrackingConfig | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    api<Partial<TrackingConfig>>('/sections/tracking').then((d) => setCfg({ ...EMPTY_TRACKING, ...d })).catch(() => setCfg(EMPTY_TRACKING)) // 404 = nothing saved yet
  }, [])

  if (!cfg) return <div className="text-gray-400 animate-pulse">Loading…</div>
  const current = cfg
  const set = (k: keyof TrackingConfig, v: string | boolean) => setCfg({ ...cfg, [k]: v })
  const bad = (k: keyof TrackingConfig) => { const f = FORMATS[k]; return f && typeof cfg[k] === 'string' && !f[0].test(clean(cfg[k] as string)) ? f[1] : '' }
  const problems = (Object.keys(FORMATS) as (keyof TrackingConfig)[]).filter((k) => bad(k))

  const text = (k: keyof TrackingConfig, label: string, placeholder: string, hint: string) => (
    <Field label={label} hint={bad(k) || hint}>
      <Input value={cfg[k] as string} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} className="font-mono text-xs" autoComplete="off" spellCheck={false} />
    </Field>
  )

  async function save(e: FormEvent) {
    e.preventDefault(); setMsg(null)
    if (problems.length) return setMsg({ text: 'Fix the highlighted fields first.', type: 'error' })
    setBusy(true)
    try {
      const body = Object.fromEntries(Object.entries(current).map(([k, v]) => [k, typeof v === 'string' ? clean(v) : v]))
      const r = await api<{ rebuild?: string }>('/sections/tracking', { method: 'POST', json: body })
      setMsg({ text: 'Saved. Tags update on the live site within about a minute.' + rebuildNote(r), type: 'success' })
    } catch (err) { setMsg({ text: err instanceof ApiError ? err.message : 'Failed to save', type: 'error' }) } finally { setBusy(false) }
  }

  const active = [cfg.gtmId && 'Tag Manager', cfg.ga4Id && 'Google Analytics', cfg.metaPixelId && 'Meta Pixel', cfg.googleAdsId && 'Google Ads', cfg.clarityId && 'Clarity'].filter(Boolean) as string[]

  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader title="Tracking & verification" description="Paste your tag IDs here and they go live on the site. Nothing is installed for a tool whose box is empty, and nothing ever loads on the admin pages." />

      <div className="rounded-xl border border-gray-100 bg-white p-5 text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-1">Currently on the site</p>
        {active.length ? <p>{active.join(' · ')}{cfg.requireConsent ? ' — after the visitor accepts cookies.' : ' — loads for everyone who has not declined.'}</p> : <p>No tracking tools set up yet.</p>}
        <p className="mt-2 text-xs text-gray-400">Avoid double counting: if Google Analytics or the Meta Pixel is installed inside Tag Manager, leave their boxes below empty.</p>
      </div>

      <FormSection label="Analytics & tags">
        {text('gtmId', 'Google Tag Manager ID', 'GTM-XXXXXXX', 'Optional. Use it if you want to manage tags without touching the site.')}
        {text('ga4Id', 'Google Analytics 4 Measurement ID', 'G-XXXXXXXXXX', 'Admin → Data streams → your web stream. Tracks visits, and quote / WhatsApp / call clicks as events.')}
        {text('clarityId', 'Microsoft Clarity project ID (optional)', 'abcd1234ef', 'Free heatmaps and session recordings. Find it in the Clarity project URL.')}
      </FormSection>

      <FormSection label="Advertising">
        {text('metaPixelId', 'Meta (Facebook) Pixel ID', '1234567890123456', 'Events Manager → Data sources → your Pixel. Quote requests are sent as “Lead”, WhatsApp and calls as “Contact”.')}
        {text('googleAdsId', 'Google Ads conversion ID', 'AW-123456789', 'Only needed to run Google Ads. Goals → Conversions → your conversion → Tag setup.')}
        {text('googleAdsLeadLabel', 'Google Ads conversion label (quote requests)', 'AbC-D_efGhIjKlMn', 'The label next to the conversion ID. Leave empty to skip conversion tracking.')}
      </FormSection>

      <FormSection label="Site verification">
        {text('googleSiteVerification', 'Google Search Console code', 'the value inside content="…"', 'Search Console → Add property → URL prefix → HTML tag. Paste only the code, not the whole tag.')}
        {text('bingSiteVerification', 'Bing Webmaster code', '', 'Bing Webmaster Tools → Add site → HTML meta tag (msvalidate.01).')}
        {text('facebookDomainVerification', 'Facebook domain verification code', '', 'Meta Business Settings → Brand safety → Domains → Meta-tag verification.')}
        <p className="text-xs text-gray-400">Verification codes sit in the page source, so they take effect after the next site rebuild (started automatically when you save, if the deploy hook is set).</p>
      </FormSection>

      <FormSection label="Cookie consent">
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-primary)]" checked={cfg.requireConsent} onChange={(e) => set('requireConsent', e.target.checked)} />
          <span><span className="font-medium">Ask visitors before loading analytics and advertising tags</span><br /><span className="text-xs text-gray-400">Recommended. Shows a cookie banner and loads tags only after “Accept”. Turn off only on legal advice.</span></span>
        </label>
      </FormSection>

      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <button className={btnPrimary} disabled={busy}>{busy ? 'Saving…' : 'Save tracking settings'}</button>
    </form>
  )
}
