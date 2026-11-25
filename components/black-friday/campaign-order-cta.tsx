'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { CAMPAIGN, DELIVERY, deliveryCities, naira, totals } from './campaign-data'
import { useCampaign } from './campaign-provider'
import { WhatsappCta } from './campaign-cta'

/** Quantity helper + final order block. This is an enquiry aid only: nothing is paid or reserved here. */
export function CampaignOrderCta({ children }: { children?: React.ReactNode }) {
  const { product: p, status, qty, setQty } = useCampaign()
  const [draft, setDraft] = useState(String(qty))
  const live = status === 'active'
  const t = totals(p, qty)

  function commit(raw: string) {
    const n = Math.floor(Number(raw))
    const next = Number.isFinite(n) ? Math.min(CAMPAIGN.maxQty, Math.max(p.minQty, n)) : p.minQty
    setQty(next)
    setDraft(String(next))
  }
  const step = (d: number) => commit(String(qty + d))

  return (
    <section id="order" className="scroll-mt-24 bg-ink py-16 text-white md:py-24" aria-labelledby="order-heading">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6b2c]">Order {p.name}</p>
          <h2 id="order-heading" className="mt-3 text-3xl font-extrabold sm:text-4xl">{live ? 'Lock in the Black Friday price' : 'Black Friday offer ended'}</h2>
          <p className="mt-3 max-w-lg text-white/75">
            {live
              ? `Choose how many ${p.plural} you need (minimum ${p.minQty}). This is an enquiry aid, not a checkout: nothing is paid or reserved until our team confirms your order.`
              : `The Black Friday promotion has closed. Message MASFIG for current pricing and availability.`}
          </p>
          <div className="mt-6">{children}</div>
        </div>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/15 sm:p-8">
          {live ? (
            <>
              <label htmlFor="bf-qty" className="text-sm font-semibold text-white/80">Quantity (minimum {p.minQty})</label>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" onClick={() => step(-1)} disabled={qty <= p.minQty} aria-label="Decrease quantity" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"><Minus aria-hidden className="h-5 w-5" /></button>
                <input
                  id="bf-qty"
                  inputMode="numeric"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  onBlur={(e) => commit(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commit((e.target as HTMLInputElement).value) }}
                  className="h-12 w-24 rounded-xl border border-white/20 bg-white/10 text-center text-xl font-extrabold text-white focus:border-white focus:outline-none"
                />
                <button type="button" onClick={() => step(1)} aria-label="Increase quantity" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"><Plus aria-hidden className="h-5 w-5" /></button>
              </div>
              <dl className="mt-6 space-y-3 text-sm" aria-live="polite">
                <Row k="Quantity" v={`${t.qty} ${p.plural}`} />
                <Row k="Promotional unit price" v={naira(p.promoPrice)} />
                <Row k="Original total" v={naira(t.original)} strike />
                <Row k="Promotional total" v={naira(t.promo)} big />
                <Row k="You save" v={naira(t.savings)} green />
                {t.qty >= DELIVERY.freeMinQty && <Row k="Delivery" v={`Free in ${deliveryCities()}`} green />}
              </dl>
            </>
          ) : (
            <p className="text-white/80">Prices from this campaign are no longer available as an offer. Send us a message and we will share what applies today.</p>
          )}
          <WhatsappCta placement="footer" className="mt-7 w-full" />
        </div>
      </div>
    </section>
  )
}

function Row({ k, v, strike, big, green }: { k: string; v: string; strike?: boolean; big?: boolean; green?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
      <dt className="text-white/70">{k}</dt>
      <dd className={`${strike ? 'text-white/50 line-through' : ''} ${big ? 'text-2xl font-extrabold text-white' : 'font-semibold text-white'} ${green ? '!text-[#5be08a]' : ''}`}>{v}</dd>
    </div>
  )
}
