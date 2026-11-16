import Link from 'next/link'
import type { CatalogProduct, EquipmentShowcaseData } from '@/lib/types'
import { ProductCard } from './product-card'
import { Reveal } from './reveal'

export function FeaturedProducts({ header, products }: { header: EquipmentShowcaseData['header']; products: CatalogProduct[] }) {
  if (!products.length) return null
  // One product per category (with a photo), so the showcase spans the whole range instead of one section.
  const seen = new Set<number>()
  const featured: CatalogProduct[] = []
  for (const p of products) {
    if (!p.images.length || seen.has(p.category.id)) continue
    seen.add(p.category.id)
    featured.push(p)
  }
  return (
    <section className="section-pad bg-surface">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">{header.badge}</p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">{header.title}</h2>
            <p className="mt-4 text-lg text-ink-soft">{header.description}</p>
          </div>
          <Link href="/products/" className="btn-outline shrink-0">See all equipment</Link>
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((p, i) => <li key={p.id}><Reveal delay={(i % 3) * 90} className="h-full"><ProductCard p={p} /></Reveal></li>)}
        </ul>
      </div>
    </section>
  )
}
