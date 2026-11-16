'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { useEffect } from 'react'
import { SITE_URL, telLink, whatsappLink } from '@/lib/site'
import { track } from '@/lib/track'

export function ProductActions({ name, path, phone, whatsapp, productId }: { name: string; path: string; phone: string; whatsapp: string; productId?: number }) {
  useEffect(() => { track('product_view', { product: name, product_id: productId }) }, [name, productId])
  const msg = `Hello MASFIG, I would like a quote for: ${name}\n${SITE_URL}${path}`
  return (
    <div className="flex flex-wrap gap-3">
      <a href={whatsappLink(whatsapp, msg)} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { location: 'product', product: name })}
        className="btn btn-primary">
        <MessageCircle className="w-4 h-4" /> Request a quote on WhatsApp
      </a>
      <a href={telLink(phone)} onClick={() => track('call_click', { location: 'product', product: name })}
        className="btn btn-outline">
        <Phone className="w-4 h-4" /> Call us
      </a>
    </div>
  )
}
