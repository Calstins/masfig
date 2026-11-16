import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { CategoryGrid } from '@/components/category-grid'
import { ProductBrowser } from '@/components/product-browser'
import { Reveal } from '@/components/reveal'
import { getCatalog } from '@/lib/server-data'
import { breadcrumbLd, collectionPageLd } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { compact } from '@/lib/compact'

const DESCRIPTION = 'Browse every product range from MASFIG LTD, Lagos: bakery, cooking, refrigeration, food processing, fast food, supermarket, laundry, water production and sound equipment. Request a quote.'

export const metadata = buildMetadata({
  title: 'Commercial Kitchen, Bakery & Food Equipment in Nigeria | Product Catalogue',
  description: DESCRIPTION,
  path: '/products/',
  absoluteTitle: true,
  keywords: ['commercial kitchen equipment Nigeria', 'bakery equipment Lagos', 'restaurant equipment Nigeria', 'supermarket equipment Nigeria', 'food processing machines Nigeria'],
})

export default async function ProductsIndex() {
  const { categories, products } = await getCatalog()
  const items = products.map(compact)
  const counts = categories.map((c) => ({ slug: c.slug, name: c.name, count: products.filter((p) => p.category.slug === c.slug).length }))
  return (
    <PageShell>
      <JsonLd data={[
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products/' }]),
        collectionPageLd('MASFIG product catalogue', DESCRIPTION, '/products/', categories.map((c) => ({ name: c.name, path: `/products/${c.slug}/` }))),
      ]} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Products' }]} title="Our product range">
        Equipment and machines for bakeries, restaurants, supermarkets, food factories, laundries and events. Pick a range below, or search the full catalogue. Every item is quoted individually.
      </PageHeader>
      <div className="container-x section-pad">
        {categories.length === 0 ? (
          <p className="text-ink-soft">Our catalogue is being updated. Please <Link className="font-semibold text-primary underline" href="/contact/">contact us</Link> for current availability.</p>
        ) : (
          <>
            <section aria-labelledby="ranges"><h2 id="ranges" className="sr-only">Product ranges</h2><CategoryGrid categories={categories} variant="index" /></section>
            <Reveal className="mt-20">
              <h2 className="text-2xl font-extrabold text-ink md:text-3xl">Search the full catalogue</h2>
              <p className="mb-8 mt-2 max-w-2xl text-ink-soft">Looking for something specific? Type a name, or filter by range.</p>
              <ProductBrowser products={items} categories={counts} />
            </Reveal>
          </>
        )}
      </div>
    </PageShell>
  )
}
