import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { getCatalog } from '@/lib/server-data'
import { breadcrumbLd } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Sitemap | MASFIG LTD',
  description: 'Every section of the MASFIG LTD website: equipment categories, products, guides and company pages.',
  path: '/sitemap/', absoluteTitle: true,
})

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'All equipment', path: '/products/' },
  { name: 'Blog & guides', path: '/blog/' },
  { name: 'Delivery & installation', path: '/delivery-and-installation/' },
  { name: 'Contact & request a quote', path: '/contact/' },
  { name: 'Privacy Policy', path: '/privacy/' },
  { name: 'Terms of Use', path: '/terms/' },
]

export default async function SitemapPage() {
  const { categories, products, posts } = await getCatalog()
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Sitemap', path: '/sitemap/' }])} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Sitemap' }]} title="Sitemap">Find any page on the MASFIG LTD website.</PageHeader>
      <div className="container-x section-pad space-y-12">
        <section aria-labelledby="sm-pages">
          <h2 id="sm-pages" className="text-2xl font-bold text-ink">Pages</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{PAGES.map((p) => <li key={p.path}><Link href={p.path} className="text-primary hover:underline">{p.name}</Link></li>)}</ul>
        </section>
        <section aria-labelledby="sm-eq">
          <h2 id="sm-eq" className="text-2xl font-bold text-ink">Equipment</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {categories.map((c) => (
              <div key={c.id}>
                <h3 className="font-semibold text-ink"><Link href={`/products/${c.slug}/`} className="hover:text-primary">{c.name}</Link></h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {products.filter((p) => p.category.slug === c.slug).map((p) => <li key={p.id}><Link href={`/products/${c.slug}/${p.slug}/`} className="text-ink-soft hover:text-primary">{p.name}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
        {posts.length > 0 && (
          <section aria-labelledby="sm-blog">
            <h2 id="sm-blog" className="text-2xl font-bold text-ink">Guides</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">{posts.map((p) => <li key={p.id}><Link href={`/blog/${p.slug}/`} className="text-primary hover:underline">{p.title}</Link></li>)}</ul>
          </section>
        )}
      </div>
    </PageShell>
  )
}
