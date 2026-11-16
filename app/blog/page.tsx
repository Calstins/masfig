import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { BlogCard } from '@/components/blog-teaser'
import { Reveal } from '@/components/reveal'
import { getCatalog } from '@/lib/server-data'
import { breadcrumbLd } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Buying Guides & Equipment Advice',
  description: 'Practical guides on choosing commercial kitchen, bakery and food processing equipment in Nigeria, from the team at MASFIG LTD.',
  path: '/blog/',
})

export default async function BlogIndex() {
  const { posts } = await getCatalog()
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }])} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Blog' }]} title="Guides & advice">
        Practical buying guides for bakeries, restaurants, hotels and food businesses in Nigeria.
      </PageHeader>
      <div className="container-x section-pad">
        {posts.length === 0 ? <p className="text-ink-soft">New guides are coming soon.</p> : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => <li key={p.id}><Reveal delay={(i % 3) * 90} className="h-full"><BlogCard p={p} /></Reveal></li>)}
          </ul>
        )}
      </div>
    </PageShell>
  )
}
