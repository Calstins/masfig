export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://masfig.com').replace(/\/$/, '')

export function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Strip to digits for wa.me links. */
export function waNumber(raw: string): string {
  return (raw || '').replace(/\D/g, '')
}

export function whatsappLink(whatsapp: string, text?: string): string {
  const base = `https://wa.me/${waNumber(whatsapp)}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function telLink(phone: string): string {
  return `tel:${(phone || '').replace(/[^\d+]/g, '')}`
}

export function plainText(md: string, max = 160): string {
  const t = md.replace(/[#*_`>\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t
}

export function formatPrice(price: number, currency: string): string {
  return `${currency === 'USD' ? '$' : '₦'}${price.toLocaleString('en-NG')}`
}
