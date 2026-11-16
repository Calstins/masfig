import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Marquee } from '@/components/marquee'
import { ScrollProgress } from '@/components/scroll-progress'
import { CategoryGrid } from '@/components/category-grid'
import { HeroSlider, type SlideView } from '@/components/hero-slider'
import { FacebookFeedSection } from '@/components/facebook-feed'
import { Reveal } from '@/components/reveal'
import Link from 'next/link'
import { FeaturedProducts } from '@/components/featured-products'
import { StatsSection } from '@/components/stats-section'
import { Projects } from '@/components/projects'
import { DeliveryProcess } from '@/components/delivery-process'
import { BlogTeaser } from '@/components/blog-teaser'
import { CtaBand } from '@/components/cta-band'
import { Footer } from '@/components/footer'
import { StickyContact } from '@/components/sticky-contact'
import { getSiteData, getCatalog, getHeroSlides } from '@/lib/server-data'
import { whatsappLink } from '@/lib/site'
import { withoutUnverifiedClaims } from '@/lib/claims'
import { JsonLd } from '@/components/seo/json-ld'
import { organizationLd, websiteLd, localBusinessLd, itemListLd } from '@/lib/schema'

export default async function Page() {
  const raw = await getSiteData()
  const catalog = await getCatalog()
  const slides = await getHeroSlides()
  const claims = !!raw.settings.showUnverifiedClaims
  const { data, showStats, showProjects } = claims
    ? { data: raw, showStats: true, showProjects: true }
    : withoutUnverifiedClaims(raw)

  const graph: object[] = [organizationLd(data.settings), websiteLd(data.settings)]
  const lb = localBusinessLd(data.settings)
  if (lb) graph.push(lb)
  if (catalog.categories.length) graph.push(itemListLd('Product categories', catalog.categories.map((c) => ({ name: c.name, path: `/products/${c.slug}/` }))))

  const marqueeItems = catalog.categories.length ? catalog.categories.map((c) => c.name) : data.equipmentGrid.items.map((i) => i.title)

  const views: SlideView[] = slides.map((s) => ({
    id: s.id, eyebrow: s.eyebrow, title: s.title, subtitle: s.subtitle, ctaLabel: s.ctaLabel, quoteLabel: s.quoteLabel,
    href: s.category ? `/products/${s.category.slug}/` : s.linkUrl || '/products/',
    quoteHref: s.category ? `/products/${s.category.slug}/#quote` : '/contact/',
    label: s.category?.name ?? s.title, image: s.image, imageAlt: s.imageAlt,
  }))
  const grid = data.equipmentGrid.header

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={graph} />
      <ScrollProgress />
      <Navbar settings={data.settings} />
      <main>
        {views.length ? <HeroSlider slides={views} whatsappHref={whatsappLink(data.settings.whatsapp, 'Hello MASFIG, I would like a quote for equipment.')} phone={data.settings.phone1} /> : <Hero data={data.hero} />}
        <Marquee items={marqueeItems} />
        {catalog.categories.length > 0 && (
          <section id="equipment" className="section-pad">
            <div className="container-x">
              <Reveal className="mx-auto max-w-2xl text-center">
                <p className="eyebrow justify-center">{grid.badge}</p>
                <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">{grid.title} <span className="text-primary">{grid.titleGradient}</span></h2>
                <p className="mt-4 text-lg text-ink-soft">{grid.description}</p>
              </Reveal>
              <div className="mt-14"><CategoryGrid categories={catalog.categories} /></div>
              <div className="mt-10 text-center"><Link href="/products/" className="btn-outline px-8 py-3.5">Browse all products</Link></div>
            </div>
          </section>
        )}
        <FeaturedProducts header={data.showcase.header} products={catalog.products} />
        {showStats && <StatsSection data={data.stats} />}
        {showProjects && <Projects data={data.projects} />}
        <FacebookFeedSection />
        <DeliveryProcess data={data.delivery} />
        <BlogTeaser posts={catalog.posts} />
        <CtaBand footer={data.footer} settings={data.settings} />
      </main>
      <Footer data={data.footer} settings={data.settings} />
      <StickyContact phone={data.settings.phone1} whatsapp={data.settings.whatsapp} />
    </div>
  )
}
