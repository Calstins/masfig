'use client'

import { naira, totals } from './campaign-data'
import { useCampaign } from './campaign-provider'

/** Price block. While the offer is live it shows the promotion with the 10-piece condition beside it; after the deadline it never shows the promotional price as active. */
export function CampaignPricePanel() {
  const { product: p, status } = useCampaign()
  const min = totals(p, p.minQty)
  if (status === 'ended') {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <p className="text-white/75">The Black Friday 2026 promotion for {p.name} has closed. Contact MASFIG for current pricing and availability.</p>
      </div>
    )
  }
  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-2xl font-semibold text-white/60 line-through decoration-2" aria-label={`Previous price ${naira(p.previousPrice)}`}>{naira(p.previousPrice)}</span>
        <span className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">{naira(p.promoPrice)}</span>
        <span className="text-lg font-bold text-white/85">per unit</span>
      </p>
      <p className="mt-3 inline-flex items-center rounded-lg bg-[#ff6b2c] px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-ink">
        Minimum order: {p.minQty} pieces
      </p>
      <ul className="mt-4 space-y-1.5 text-white/85">
        <li>Promotional price applies when you order {p.minQty} or more pieces.</li>
        <li>You save <strong className="text-[#5be08a]">{naira(min.unitSaving)} per unit</strong>.</li>
        <li>Minimum order of {p.minQty}: pay <strong>{naira(min.promo)}</strong> and save <strong className="text-[#5be08a]">{naira(min.savings)}</strong>.</li>
      </ul>
    </div>
  )
}
