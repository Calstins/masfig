'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { whatsappLink } from '@/lib/site'
import { track } from '@/lib/track'
import { CAMPAIGN, DELIVERY, deliveryCities, whatsappMessage } from './campaign-data'
import { useCampaign } from './campaign-provider'

const KEY = 'bf_float_closed'

/**
 * Animated WhatsApp chat prompt: a pulsing button, and after a few seconds a chat bubble (with typing dots first) that opens
 * WhatsApp with the product message when tapped. The bubble can be closed for the visit; the button always stays.
 */
export function FloatingWhatsapp() {
  const { product: p, whatsapp, status, qty } = useCampaign()
  const [stage, setStage] = useState<'hidden' | 'typing' | 'message'>('hidden')

  useEffect(() => {
    if (status !== 'active') return
    try { if (sessionStorage.getItem(KEY)) return } catch { /* storage unavailable */ }
    const t1 = setTimeout(() => setStage('typing'), 5000)
    const t2 = setTimeout(() => setStage('message'), 6800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [status])

  if (status !== 'active') return null
  const href = whatsappLink(whatsapp, whatsappMessage(p, qty, status))
  const onClick = () => track('whatsapp_click', { campaign: CAMPAIGN.id, product: p.trackingId, product_name: p.name, placement: 'floating', location: 'black-friday-floating' })
  const close = () => { setStage('hidden'); try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ } }

  return (
    <div className="fixed bottom-24 right-3 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {stage !== 'hidden' && (
        <div className="bf-slide relative w-[min(18rem,calc(100vw-5.5rem))] rounded-2xl rounded-br-sm bg-white p-3.5 pr-9 text-ink shadow-2xl ring-1 ring-black/10">
          <button type="button" onClick={close} aria-label="Dismiss chat prompt" className="absolute right-1.5 top-1.5 rounded-full p-1.5 text-ink-soft hover:bg-surface"><X aria-hidden className="h-4 w-4" /></button>
          {stage === 'typing' ? (
            <p className="flex h-6 items-center gap-1" aria-label="MASFIG is typing">
              {[0, 1, 2].map((i) => <span key={i} className="bf-dot h-2 w-2 rounded-full bg-ink-soft" style={{ animationDelay: `${i * 160}ms` }} />)}
            </p>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#178a45]">MASFIG · online</span>
              <span className="mt-0.5 block text-sm font-semibold leading-snug">Order {DELIVERY.freeMinQty}+ {p.plural} at {`₦${p.promoPrice.toLocaleString('en-NG')}`} each and get free delivery in {deliveryCities()}. Tap to chat.</span>
            </a>
          )}
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label="Chat with MASFIG on WhatsApp"
        className="bf-ringbox flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855] text-white shadow-xl transition hover:scale-105"
      >
        <MessageCircle aria-hidden className="bf-wiggle h-7 w-7" />
      </a>
    </div>
  )
}
