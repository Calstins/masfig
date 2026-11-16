import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CatalogCategory } from '@/lib/types'
import { plainText } from '@/lib/site'
import { Reveal } from './reveal'
import { ResponsiveImage } from './responsive-image'

/** Every published category, generated from the catalogue — nothing here is hand-listed. */
export function CategoryGrid({ categories, variant = 'home' }: { categories: CatalogCategory[]; variant?: 'home' | 'index' }) {
  return (
    <ul className={`grid gap-6 sm:grid-cols-2 ${variant === 'index' ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-5'}`}>
      {categories.map((c, i) => (
        <li key={c.id}>
          <Reveal delay={(i % 5) * 80} className="h-full">
            <Link href={`/products/${c.slug}/`} className="card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                {c.image && <ResponsiveImage media={c.image} alt={c.imageAlt || c.name} sizes="(min-width:1280px) 20vw, (min-width:1024px) 30vw, 90vw" className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-110" />}
                <span aria-hidden className="absolute right-4 top-3 font-[family-name:var(--font-display)] text-5xl font-extrabold text-primary/10 transition-colors group-hover:text-primary/25">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug text-ink">{c.name}</h3>
                {variant === 'index' && <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{plainText(c.intro, 170)}</p>}
                <span className="mt-4 inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary">{c.productCount ? `${c.productCount} products` : 'View range'} <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </div>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
