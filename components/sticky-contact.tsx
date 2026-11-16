'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { telLink, whatsappLink } from '@/lib/site'
import { track } from '@/lib/track'

export function StickyContact({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 md:hidden">
      <a href={telLink(phone)} aria-label="Call MASFIG" onClick={() => track('call_click', { location: 'sticky' })}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-primary shadow-lg"><Phone className="h-5 w-5" /></a>
      <a href={whatsappLink(whatsapp, 'Hello MASFIG, I would like a quote for equipment.')} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        onClick={() => track('whatsapp_click', { location: 'sticky' })}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30"><MessageCircle className="h-5 w-5" /></a>
    </div>
  )
}
