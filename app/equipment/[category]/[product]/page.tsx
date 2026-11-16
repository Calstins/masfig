import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { ProductActions } from '@/components/product-actions'
import { ProductCard } from '@/components/product-card'
import { QuoteForm } from '@/components/quote-form'
import { ResponsiveImage } from '@/components/responsive-image'
import { getCatalog, getSiteData } from '@/lib/server-data'
import { breadcrumbLd, faqLd, productLd } from '@/lib/schema'
import { renderMarkdown } from '@/lib/markdown'
import { formatPrice } from '@/lib/site'

type Props = { params: Promise<{ category: string; product: string }> }
export const dynamicParams = false

export async function generateStaticParams() {
  const { products } = await getCatalog()
  return products.length ? products.map((p) => ({ category: p.category.slug, product: p.slug })) : [{ category: '__none__', product: '__none__' }]
}

async function find(params: Props['params']) {
  const { category, product } = await params
  const catalog = await getCatalog()
  const p = catalog.products.find((x) => x.slug === product && x.category.slug === category)
  return { catalog, p }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { p } = await find(params)
  if (!p) return { robots: { index: false, follow: false } }
  const url = `/equipment/${p.category.slug}/${p.slug}/`
  return {
    title: { absolute: p.seoTitle }, description: p.seoDescription, alternates: { canonical: url },
    openGraph: { title: p.seoTitle, description: p.seoDescription, url, type: 'website', ...(p.images[0] ? { images: [{ url: p.images[0].url }] } : {}) },
  }
}

const AVAIL: Record<string, string> = { IN_STOCK: 'In stock', ON_REQUEST: 'Available on request', OUT_OF_STOCK: 'Out of stock' }

export default async function ProductPage({ params }: Props) {
  const { catalog, p } = await find(params)
  if (!p) return <PageShell><p className="max-w-3xl mx-auto px-4 text-ink-soft">No product here.</p></PageShell>
  const { settings } = await getSiteData()
  const path = `/equipment/${p.category.slug}/${p.slug}/`
  const related = catalog.products.filter((x) => x.category.id === p.category.id && x.id !== p.id).slice(0, 3)
  const specs = Array.isArray(p.specs) ? p.specs : []
  const facts = [['Brand', p.brand], ['Model', p.model], ['Capacity', p.capacity], ['Power', p.power], ['Dimensions', p.dimensions], ['Warranty', p.warranty], ['Availability', AVAIL[p.availability] ?? '']].filter(([, v]) => v)
  const faq = faqLd(p.faqs)
  const graph = [
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Equipment', path: '/equipment/' }, { name: p.category.name, path: `/equipment/${p.category.slug}/` }, { name: p.name, path }]),
    productLd(p),
    ...(faq ? [faq] : []),
  ]
  return (
    <PageShell>
      <JsonLd data={graph} />
      <div className="container-x py-10 md:py-14">
        <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Equipment', path: '/equipment/' }, { name: p.category.name, path: `/equipment/${p.category.slug}/` }, { name: p.name }]} />
        <div className="grid gap-10 mb-14 lg:grid-cols-2">
          <div className="space-y-4">
            {p.images[0] && <ResponsiveImage media={p.images[0]} priority sizes="(min-width:1024px) 50vw, 100vw" className="w-full rounded-3xl object-cover shadow-xl" />}
            {p.images.length > 1 && <div className="grid grid-cols-3 gap-3">{p.images.slice(1, 4).map((i) => <ResponsiveImage key={i.mediaId} media={i} sizes="20vw" className="w-full rounded-2xl object-cover aspect-square" />)}</div>}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-ink md:text-4xl mb-4">{p.name}</h1>
            {p.summary && <p className="text-lg text-ink-soft mb-4">{p.summary}</p>}
            <p className="text-xl text-primary font-semibold mb-6">{p.priceMode === 'PRICE' && p.price ? formatPrice(p.price, p.currency) : 'Price on request — get a quote today'}</p>
            <ProductActions name={p.name} path={path} phone={settings.phone1} whatsapp={settings.whatsapp} productId={p.id} />
            {facts.length > 0 && <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl bg-surface p-5 text-sm">{facts.map(([k, v]) => <div key={k}><dt className="text-ink-soft">{k}</dt><dd className="font-semibold text-ink">{v}</dd></div>)}</dl>}
          </div>
        </div>
        <section className="max-w-3xl mb-12"><h2 className="text-2xl font-extrabold text-ink mb-4">About this {p.category.name.toLowerCase().replace(/s$/, '')}</h2>
          <div className="prose-masfig" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.description) }} />
          {p.applications.length > 0 && <><h3 className="text-lg font-bold text-ink mt-6 mb-2">Best suited for</h3><ul className="list-disc pl-6 text-ink-soft">{p.applications.map((a) => <li key={a}>{a}</li>)}</ul></>}
        </section>
        {specs.length > 0 && <section className="max-w-3xl mb-12"><h2 className="text-2xl font-extrabold text-ink mb-4">Specifications</h2>
          <table className="w-full text-sm"><tbody>{specs.map((s, i) => <tr key={i} className="border-b border-border"><th scope="row" className="text-left font-medium text-ink-soft py-3 pr-4 w-1/3">{s.label}</th><td className="py-3 text-ink">{s.value}</td></tr>)}</tbody></table></section>}
        {p.faqs.length > 0 && <section className="max-w-3xl mb-12"><h2 className="text-2xl font-extrabold text-ink mb-4">Frequently asked questions</h2>
          {p.faqs.map((f) => <details key={f.id} className="border-b border-border py-4"><summary className="cursor-pointer font-semibold text-ink">{f.question}</summary><p className="mt-2 text-ink-soft">{f.answer}</p></details>)}</section>}
        <section className="mb-16 max-w-2xl rounded-3xl border border-border bg-surface p-6 md:p-8"><h2 className="text-2xl font-extrabold text-ink mb-4">Request a quote for {p.name}</h2><QuoteForm productId={p.id} categoryId={p.category.id} productName={p.name} /></section>
        {related.length > 0 && <section><h2 className="text-2xl font-extrabold text-ink mb-6">Related in <Link className="text-primary" href={`/equipment/${p.category.slug}/`}>{p.category.name}</Link></h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{related.map((r) => <li key={r.id}><ProductCard p={r} /></li>)}</ul></section>}
      </div>
    </PageShell>
  )
}
