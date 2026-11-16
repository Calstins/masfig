import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { ProductCard } from '@/components/product-card'
import { QuoteForm } from '@/components/quote-form'
import { ResponsiveImage } from '@/components/responsive-image'
import { getCatalog } from '@/lib/server-data'
import { breadcrumbLd, faqLd, itemListLd } from '@/lib/schema'
import { renderMarkdown } from '@/lib/markdown'

type Props = { params: Promise<{ category: string }> }
export const dynamicParams = false

export async function generateStaticParams() {
  const { categories } = await getCatalog()
  return categories.length ? categories.map((c) => ({ category: c.slug })) : [{ category: '__none__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const c = (await getCatalog()).categories.find((x) => x.slug === category)
  if (!c) return { robots: { index: false, follow: false } }
  const url = `/equipment/${c.slug}/`
  return {
    title: { absolute: c.seoTitle }, description: c.seoDescription, alternates: { canonical: url },
    openGraph: { title: c.seoTitle, description: c.seoDescription, url, type: 'website', ...(c.image ? { images: [{ url: c.image.url }] } : {}) },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const catalog = await getCatalog()
  const c = catalog.categories.find((x) => x.slug === category)
  if (!c) return <PageShell><p className="max-w-3xl mx-auto px-4 text-ink-soft">No category here.</p></PageShell>
  const products = catalog.products.filter((p) => p.category.slug === c.slug)
  const faq = faqLd(c.faqs)
  const graph = [
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Equipment', path: '/equipment/' }, { name: c.name, path: `/equipment/${c.slug}/` }]),
    itemListLd(c.name, products.map((p) => ({ name: p.name, path: `/equipment/${c.slug}/${p.slug}/` }))),
    ...(faq ? [faq] : []),
  ]
  return (
    <PageShell>
      <JsonLd data={graph} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Equipment', path: '/equipment/' }, { name: c.name }]} title={c.h1} />
      <div className="container-x section-pad">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-masfig" dangerouslySetInnerHTML={{ __html: renderMarkdown(c.intro) }} />
          {c.image && <ResponsiveImage media={c.image} alt={c.imageAlt || c.name} priority sizes="(min-width:1024px) 40vw, 100vw" className="w-full rounded-3xl object-cover shadow-xl" />}
        </div>
        <h2 className="mb-8 mt-16 text-2xl font-extrabold text-ink md:text-3xl">{c.name} we supply</h2>
        {products.length === 0 ? <p className="mb-16 text-ink-soft">Items in this category are being added. Request a quote below and we will advise you directly.</p>
        : <ul className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map((p) => <li key={p.id}><ProductCard p={p} /></li>)}</ul>}
        {c.faqs.length > 0 && (
          <section className="mb-16 max-w-3xl"><h2 className="mb-4 text-2xl font-extrabold text-ink">Frequently asked questions</h2>
            {c.faqs.map((f) => <details key={f.id} className="border-b border-border py-4"><summary className="cursor-pointer font-semibold text-ink">{f.question}</summary><p className="mt-2 text-ink-soft">{f.answer}</p></details>)}
          </section>
        )}
        <section className="max-w-2xl rounded-3xl border border-border bg-surface p-6 md:p-8"><h2 className="mb-5 text-2xl font-extrabold text-ink">Request a quote for {c.name.toLowerCase()}</h2><QuoteForm categoryId={c.id} /></section>
      </div>
    </PageShell>
  )
}
