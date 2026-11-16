import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { BlogCard } from '@/components/blog-teaser'
import { CtaBand } from '@/components/cta-band'
import { getSiteData } from '@/lib/server-data'
import { JsonLd } from '@/components/seo/json-ld'
import { ResponsiveImage } from '@/components/responsive-image'
import { getCatalog } from '@/lib/server-data'
import { breadcrumbLd, postLd } from '@/lib/schema'
import { renderMarkdown } from '@/lib/markdown'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false

export async function generateStaticParams() {
  const { posts } = await getCatalog()
  // Next's static export needs at least one route; an empty catalogue yields a noindex placeholder.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '__none__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = (await getCatalog()).posts.find((x) => x.slug === slug)
  if (!p) return { robots: { index: false, follow: false } }
  return buildMetadata({ title: p.seoTitle, description: p.seoDescription, path: `/blog/${p.slug}/`, absoluteTitle: true, type: 'article', publishedTime: p.publishedAt, modifiedTime: p.updatedAt, keywords: p.tags, image: p.cover ? { ...p.cover, alt: p.coverAlt || p.title } : null })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const catalog = await getCatalog()
  const p = catalog.posts.find((x) => x.slug === slug)
  if (!p) return <PageShell><p className="container-x py-16 text-ink-soft">No article here.</p></PageShell>
  const { settings, footer } = await getSiteData()
  const mins = Math.max(1, Math.round(p.body.split(/\s+/).length / 220))
  const more = catalog.posts.filter((x) => x.id !== p.id).slice(0, 3)
  return (
    <PageShell>
      <JsonLd data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: p.title, path: `/blog/${p.slug}/` }]), postLd(p)]} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: p.title }]} title={p.title}>
        <span className="text-base">{p.author?.name ? `By ${p.author.name} · ` : ''}{p.publishedAt && <time dateTime={p.publishedAt}>{new Date(p.publishedAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}</time>} · {mins} min read</span>
      </PageHeader>
      <article className="container-x py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          {p.cover && <ResponsiveImage media={p.cover} alt={p.coverAlt} priority sizes="(min-width:768px) 768px, 100vw" className="mb-10 w-full rounded-3xl shadow-xl" />}
          <div className="prose-masfig" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
          {p.products.length > 0 && (
            <aside className="mt-12 rounded-3xl border border-border bg-surface p-6"><h2 className="mb-3 text-xl font-extrabold text-ink">Equipment mentioned</h2>
              <ul className="space-y-2">{p.products.map((x) => {
                const full = catalog.products.find((y) => y.id === x.id)
                return full ? <li key={x.id}><Link className="font-semibold text-primary hover:underline" href={`/products/${full.category.slug}/${full.slug}/`}>{x.name}</Link></li> : null
              })}</ul></aside>)}
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-surface py-14"><div className="container-x"><h2 className="mb-8 text-2xl font-extrabold text-ink md:text-3xl">Keep reading</h2>
          <ul className="grid gap-6 md:grid-cols-3">{more.map((m) => <li key={m.id}><BlogCard p={m} /></li>)}</ul></div></section>)}
      <CtaBand footer={footer} settings={settings} />
    </PageShell>
  )
}
