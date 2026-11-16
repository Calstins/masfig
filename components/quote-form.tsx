'use client'

import { useState } from 'react'
import { getApiUrl } from '@/lib/api'
import { readUtm, track } from '@/lib/track'

const input = 'mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function QuoteForm({ productId, categoryId, productName, kind = 'QUOTE' }: { productId?: number; categoryId?: number; productName?: string; kind?: 'QUOTE' | 'BULK' | 'GENERAL' }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const utm = readUtm()
    setState('sending'); setError('')
    try {
      const res = await fetch(getApiUrl('/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name: f.get('name'), phone: f.get('phone'), email: f.get('email') || '', company: f.get('company') || undefined,
          quantity: f.get('quantity') || undefined, message: f.get('message'),
          website: f.get('website') || undefined,
          productId, categoryId,
          pageUrl: window.location.pathname,
          utmSource: utm.utm_source, utmMedium: utm.utm_medium, utmCampaign: utm.utm_campaign, utmContent: utm.utm_content, utmTerm: utm.utm_term,
        }),
      })
      if (res.status === 201) { track('quote_submit', { product: productName }); setState('done'); return }
      const body = await res.json().catch(() => ({}))
      setError(res.status === 429 ? 'Too many requests from this connection. Please call or WhatsApp us.' : body.error || 'Please check your details and try again.')
      setState('error')
    } catch {
      setError('Network problem. Please try again, or call or WhatsApp us.')
      setState('error')
    }
  }

  if (state === 'done') {
    return <div className="rounded-2xl border border-primary/30 bg-brand-50 p-6 text-ink" role="status">Thank you. We have your request and will contact you shortly.</div>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-ink">Full name *<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} /></label>
        <label className="block text-sm font-medium text-ink">Phone / WhatsApp *<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="+234…" className={input} /></label>
        <label className="block text-sm font-medium text-ink">Email<input name="email" type="email" autoComplete="email" className={input} /></label>
        <label className="block text-sm font-medium text-ink">Company<input name="company" autoComplete="organization" className={input} /></label>
      </div>
      <label className="block text-sm font-medium text-ink">Quantity<input name="quantity" placeholder="e.g. 2 units" maxLength={100} className={input} /></label>
      <label className="block text-sm font-medium text-ink">What do you need? *
        <textarea name="message" required minLength={5} maxLength={2000} rows={4} defaultValue={productName ? `I would like a quote for ${productName}.` : ''} className={input} />
      </label>
      {/* Honeypot: hidden from people, bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state === 'error' && <p className="text-sm text-primary" role="alert">{error}</p>}
      <button disabled={state === 'sending'} className="btn btn-primary disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : 'Request a quote'}
      </button>
    </form>
  )
}
