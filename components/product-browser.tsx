'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { CompactProduct } from '@/lib/compact'
import { CompactCard } from './compact-card'

const STEP = 24

/** Live search + optional category chips + "show more". Used on /products/ (all categories) and on each category page. */
export function ProductBrowser({ products, categories, showCategory = true, emptyHint }: {
  products: CompactProduct[]
  categories?: { slug: string; name: string; count: number }[]
  showCategory?: boolean
  emptyHint?: string
}) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [shown, setShown] = useState(STEP)

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return products.filter((p) => (!cat || p.categorySlug === cat) && words.every((w) => `${p.name} ${p.categoryName} ${p.summary}`.toLowerCase().includes(w)))
  }, [products, q, cat])

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
          <input
            type="search" value={q} onChange={(e) => { setQ(e.target.value); setShown(STEP) }}
            placeholder={`Search ${products.length} products — e.g. oven, mixer, fryer`}
            className="w-full rounded-2xl border border-border bg-white py-3.5 pl-12 pr-12 text-ink placeholder:text-ink-soft/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {q && <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-soft hover:bg-surface" aria-label="Clear search"><X className="h-4 w-4" /></button>}
        </label>
        {categories && categories.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button type="button" onClick={() => { setCat(''); setShown(STEP) }} aria-pressed={!cat} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${!cat ? 'border-primary bg-primary text-white' : 'border-border bg-white text-ink hover:border-primary hover:text-primary'}`}>All</button>
            {categories.map((c) => (
              <button key={c.slug} type="button" onClick={() => { setCat(c.slug); setShown(STEP) }} aria-pressed={cat === c.slug} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${cat === c.slug ? 'border-primary bg-primary text-white' : 'border-border bg-white text-ink hover:border-primary hover:text-primary'}`}>{c.name} <span className="opacity-70">{c.count}</span></button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}{q || cat ? ' found' : ''}</p>

      {list.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-surface p-6 text-ink-soft">{emptyHint ?? 'Nothing matches that search. Try a shorter word, or tell us what you need and we will source it.'}</p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.slice(0, shown).map((p, i) => (
            <li key={p.id} className="hs-fade" style={{ animationDelay: `${(i % STEP) * 25}ms` }}><CompactCard p={p} showCategory={showCategory} /></li>
          ))}
        </ul>
      )}
      {list.length > shown && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setShown(shown + STEP)} className="btn-outline px-8 py-3.5">Show more ({list.length - shown} left)</button>
        </div>
      )}
    </div>
  )
}
