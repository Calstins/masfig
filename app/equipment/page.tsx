import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { ResponsiveImage } from '@/components/responsive-image'
import { Reveal } from '@/components/reveal'
import { getCatalog } from '@/lib/server-data'
import { breadcrumbLd, itemListLd } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Commercial Kitchen & Bakery Equipment',
  description: 'Browse commercial kitchen, bakery, supermarket and food processing equipment from MASFIG LTD, Lagos. Request a quote by WhatsApp, phone or form.',
  alternates: { canonical: '/equipment/' },
}

export default async function EquipmentIndex() {
  const { categories } = await getCatalog()
  return (
    <PageShell>
      <JsonLd data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Equipment', path: '/equipment/' }]), itemListLd('Equipment categories', categories.map((c) => ({ name: c.name, path: `/equipment/${c.slug}/` })))]} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Equipment' }]} title="Commercial equipment">
        Choose a category to see the equipment we supply. Every item is quoted individually, so message us on WhatsApp or send a request.
      </PageHeader>
      <div className="container-x section-pad">
        {categories.length === 0 ? (
          <p className="text-ink-soft">Our catalogue is being updated. Please <Link className="font-semibold text-primary underline" href="/contact/">contact us</Link> for current availability.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <Link href={`/equipment/${c.slug}/`} className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
                    <div className="aspect-[4/3] overflow-hidden bg-surface">
                      {c.image && <ResponsiveImage media={c.image} alt={c.imageAlt || c.name} sizes="(min-width:1024px) 30vw, 100vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl font-bold text-ink">{c.name}</h2>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-soft">{c.intro.replace(/[#*_>`]/g, '').slice(0, 170)}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">{c.productCount ? `${c.productCount} items` : 'View range'} <ArrowUpRight className="h-4 w-4" /></span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  )
}
