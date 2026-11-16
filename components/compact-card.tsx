import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CompactProduct } from '@/lib/compact'

export function CompactCard({ p, showCategory = true }: { p: CompactProduct; showCategory?: boolean }) {
  return (
    <Link href={`/products/${p.categorySlug}/${p.slug}/`} className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
      <div className="relative aspect-square overflow-hidden bg-surface">
        {p.thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.thumb} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105" />
        )}
        {showCategory && <span className="absolute left-3 top-3 max-w-[85%] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">{p.categoryName}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-ink">{p.name}</h3>
        {p.summary && <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{p.summary}</p>}
        <div className="mt-auto flex items-center justify-between pt-4 text-sm">
          <span className="font-semibold text-ink">{p.priceLabel}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}
