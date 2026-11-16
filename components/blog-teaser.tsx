import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CatalogPost } from '@/lib/types'
import { ResponsiveImage } from './responsive-image'
import { Reveal } from './reveal'

export function BlogCard({ p }: { p: CatalogPost }) {
  return (
    <Link href={`/blog/${p.slug}/`} className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {p.cover && <ResponsiveImage media={p.cover} alt={p.coverAlt} sizes="(min-width:1024px) 30vw, 100vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {p.tags[0] && <span className="text-xs font-semibold uppercase tracking-wider text-primary">{p.tags[0]}</span>}
        <h3 className="mt-2 text-lg font-bold leading-snug text-ink">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{p.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">Read guide <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
      </div>
    </Link>
  )
}

export function BlogTeaser({ posts }: { posts: CatalogPost[] }) {
  if (!posts.length) return null
  return (
    <section className="section-pad">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl"><p className="eyebrow">Guides &amp; advice</p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">Buy smarter, cook better</h2>
            <p className="mt-4 text-lg text-ink-soft">Practical buying guides for bakeries, restaurants, hotels and food businesses.</p></div>
          <Link href="/blog/" className="btn-outline shrink-0">All guides</Link>
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => <li key={p.id}><Reveal delay={i * 100} className="h-full"><BlogCard p={p} /></Reveal></li>)}
        </ul>
      </div>
    </section>
  )
}
