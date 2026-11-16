import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CatalogProduct } from '@/lib/types'
import { formatPrice } from '@/lib/site'
import { ResponsiveImage } from './responsive-image'

/** Compact card: photo, name, category, one line, price-or-quote. Everything else lives on the product page. */
export function ProductCard({ p }: { p: CatalogProduct }) {
  const img = p.images[0]
  return (
    <Link href={`/products/${p.category.slug}/${p.slug}/`} className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
      <div className="relative aspect-square overflow-hidden bg-surface">
        {img && <ResponsiveImage media={img} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105" />}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">{p.category.name}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-ink">{p.name}</h3>
        {p.summary && <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{p.summary}</p>}
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="font-semibold text-ink">{p.priceMode === 'PRICE' && p.price ? formatPrice(p.price, p.currency) : 'Request a quote'}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}
