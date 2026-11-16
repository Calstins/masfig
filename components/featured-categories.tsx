import Link from 'next/link'
import type { CatalogCategory } from '@/lib/types'
import { ResponsiveImage } from './responsive-image'

export function FeaturedCategories({ categories }: { categories: CatalogCategory[] }) {
  if (!categories.length) return null
  return (
    <section className="py-12 md:py-20" aria-labelledby="browse-equipment">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 id="browse-equipment" className="text-3xl md:text-4xl font-bold text-gradient mb-8">Browse equipment by category</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/equipment/${c.slug}/`} className="block rounded-xl glass-effect border border-white/10 hover:border-primary/40 overflow-hidden transition">
                {c.image && <ResponsiveImage media={c.image} alt={c.imageAlt || c.name} className="w-full aspect-[4/3] object-cover" />}
                <div className="p-5"><h3 className="text-xl font-semibold text-white">{c.name}</h3>
                  {c.productCount ? <p className="text-sm text-white/60 mt-1">{c.productCount} product{c.productCount === 1 ? '' : 's'}</p> : null}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
