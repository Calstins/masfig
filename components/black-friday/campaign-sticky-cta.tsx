'use client'

import { naira } from './campaign-data'
import { useCampaign } from './campaign-provider'
import { WhatsappCta } from './campaign-cta'

/** Mobile-only bottom bar. The page has bottom padding so it never covers content. */
export function CampaignStickyCta() {
  const { product: p, status } = useCampaign()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[11px] font-semibold text-white/70">{p.name}{status === 'active' ? ` · min ${p.minQty} pcs` : ''}</p>
          {status === 'active'
            ? <p className="whitespace-nowrap text-base font-extrabold text-white">{naira(p.promoPrice)}<span className="text-[11px] font-semibold text-white/70">/unit</span></p>
            : <p className="text-sm font-bold text-white">Offer ended</p>}
        </div>
        <WhatsappCta placement="sticky" className="shrink-0 !px-4 !py-3 !text-xs" />
      </div>
    </div>
  )
}
