import type { CatalogProduct } from './types'
import { formatPrice } from './site'

/** Trimmed product shape sent to client components, so a 300+ item catalogue does not bloat the page payload. */
export type CompactProduct = {
  id: number
  slug: string
  name: string
  summary: string
  categorySlug: string
  categoryName: string
  thumb: string | null
  alt: string
  priceLabel: string
}

export function compact(p: CatalogProduct): CompactProduct {
  const img = p.images[0]
  const small = img ? [...img.variants].sort((a, b) => a.width - b.width)[0]?.url ?? img.url : null
  return {
    id: p.id, slug: p.slug, name: p.name, summary: p.summary,
    categorySlug: p.category.slug, categoryName: p.category.name,
    thumb: small, alt: img?.alt || p.name,
    priceLabel: p.priceMode === 'PRICE' && p.price ? formatPrice(p.price, p.currency) : 'Request a quote',
  }
}
