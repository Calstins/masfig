import Link from 'next/link'
import { MessageCircle, FileText, Phone } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { ProductBrowser } from '@/components/product-browser'
import { QuoteForm } from '@/components/quote-form'
import { ResponsiveImage } from '@/components/responsive-image'
import { getCatalog, getSiteData } from '@/lib/server-data'
import { breadcrumbLd, collectionPageLd, faqLd } from '@/lib/schema'
import { renderMarkdown } from '@/lib/markdown'
import { buildMetadata } from '@/lib/seo'
import { compact } from '@/lib/compact'
import { telLink, whatsappLink } from '@/lib/site'

type Props = { params: Promise<{ category: string }> }
export const dynamicParams = false

export async function generateStaticParams() {
  const { categories } = await getCatalog()
  return categories.length ? categories.map((c) => ({ category: c.slug })) : [{ category: '__none__' }]
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const c = (await getCatalog()).categories.find((x) => x.slug === category)
  if (!c) return { robots: { index: false, follow: false } }
  return buildMetadata({ title: c.seoTitle, description: c.seoDescription, path: `/products/${c.slug}/`, absoluteTitle: true, image: c.image ? { ...c.image, alt: c.imageAlt || c.name } : null })
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const catalog = await getCatalog()
  const c = catalog.categories.find((x) => x.slug === category)
  if (!c) return <PageShell><p className="mx-auto max-w-3xl px-4 text-ink-soft">No category here.</p></PageShell>
  const { settings } = await getSiteData()
  const products = catalog.products.filter((p) => p.category.slug === c.slug)
  const others = catalog.categories.filter((x) => x.id !== c.id)
  const faq = faqLd(c.faqs)
  const path = `/products/${c.slug}/`
  const graph = [
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products/' }, { name: c.name, path }]),
    collectionPageLd(c.name, c.seoDescription, path, products.map((p) => ({ name: p.name, path: `/products/${c.slug}/${p.slug}/` }))),
    ...(faq ? [faq] : []),
  ]
  const wa = whatsappLink(settings.whatsapp, `Hello MASFIG, I would like a quote for ${c.name.toLowerCase()}.`)
  return (
    <PageShell>
      <JsonLd data={graph} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Products', path: '/products/' }, { name: c.name }]} title={c.h1}>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="#quote" className="btn-primary px-6 py-3"><FileText className="h-4 w-4" />Request a quote</a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3"><MessageCircle className="h-4 w-4" />WhatsApp</a>
          <a href={telLink(settings.phone1)} className="btn-outline px-6 py-3"><Phone className="h-4 w-4" />{settings.phone1}</a>
        </div>
      </PageHeader>
      <div className="container-x section-pad">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-masfig" dangerouslySetInnerHTML={{ __html: renderMarkdown(c.intro) }} />
          {c.image && <div className="rounded-3xl bg-surface p-6 shadow-xl"><ResponsiveImage media={c.image} alt={c.imageAlt || c.name} priority sizes="(min-width:1024px) 40vw, 100vw" className="aspect-square w-full object-contain" /></div>}
        </div>

        <h2 className="mb-8 mt-16 text-2xl font-extrabold text-ink md:text-3xl">{c.name} we supply</h2>
        {products.length === 0
          ? <p className="mb-16 text-ink-soft">Items in this category are being added. Request a quote below and we will advise you directly.</p>
          : <div className="mb-16"><ProductBrowser products={products.map(compact)} showCategory={false} /></div>}

        {c.faqs.length > 0 && (
          <section className="mb-16 max-w-3xl"><h2 className="mb-4 text-2xl font-extrabold text-ink">Frequently asked questions</h2>
            {c.faqs.map((f) => <details key={f.id} className="border-b border-border py-4"><summary className="cursor-pointer font-semibold text-ink">{f.question}</summary><p className="mt-2 text-ink-soft">{f.answer}</p></details>)}
          </section>
        )}

        <section id="quote" className="scroll-mt-28 grid items-start gap-8 rounded-3xl border border-border bg-surface p-6 md:p-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Request a quote</p>
            <h2 className="mt-3 text-2xl font-extrabold text-ink md:text-3xl">Get a quote for {c.name.toLowerCase()}</h2>
            <p className="mt-3 text-ink-soft">Tell us which items you need and your quantity. We reply with availability, delivery and installation details.</p>
            <ul className="mt-6 space-y-2 text-sm text-ink-soft">
              <li>Call <a className="font-semibold text-primary" href={telLink(settings.phone1)}>{settings.phone1}</a></li>
              <li>Or <a className="font-semibold text-primary" href={wa} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a></li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5 md:p-6"><QuoteForm categoryId={c.id} /></div>
        </section>

        {others.length > 0 && (
          <nav aria-label="Other product ranges" className="mt-16">
            <h2 className="mb-4 text-xl font-extrabold text-ink">More from MASFIG</h2>
            <ul className="flex flex-wrap gap-2">{others.map((o) => <li key={o.id}><Link href={`/products/${o.slug}/`} className="inline-block rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary">{o.name}</Link></li>)}</ul>
          </nav>
        )}
      </div>
    </PageShell>
  )
}
