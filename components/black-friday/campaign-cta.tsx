'use client'

import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/site'
import { track } from '@/lib/track'
import { CAMPAIGN, whatsappMessage } from './campaign-data'
import { useCampaign } from './campaign-provider'

export type Placement = 'hero' | 'benefits' | 'testimonial' | 'footer' | 'sticky'

/** The WhatsApp order button. The link and message follow the chosen quantity, and switch to "ask for current pricing" once the offer is over. */
export function WhatsappCta({ placement, className = '' }: { placement: Placement; className?: string }) {
  const { product, whatsapp, status, qty } = useCampaign()
  const live = status === 'active'
  const href = whatsappLink(whatsapp, whatsappMessage(product, qty, status))
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track('whatsapp_click', {
          campaign: CAMPAIGN.id,
          product: product.trackingId,
          product_name: product.name,
          placement,
          location: `black-friday-${placement}`,
        })
      }
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#1fa855] px-7 py-4 text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-black/30 transition hover:bg-[#178a45] focus-visible:outline-offset-4 ${className}`}
    >
      <MessageCircle aria-hidden className="h-5 w-5 shrink-0" />
      {live ? 'Order via WhatsApp' : 'Ask for current pricing'}
    </a>
  )
}

/** Scrolls to a section and records the click. */
export function ScrollCta({ href, children, placement, className = '' }: { href: string; children: React.ReactNode; placement: string; className?: string }) {
  const { product } = useCampaign()
  return (
    <a
      href={href}
      onClick={() => track('campaign_cta_click', { campaign: CAMPAIGN.id, product: product.trackingId, placement })}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-base font-bold text-white transition hover:border-white hover:bg-white/10 ${className}`}
    >
      {children}
    </a>
  )
}
