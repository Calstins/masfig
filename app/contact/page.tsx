import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { QuoteForm } from '@/components/quote-form'
import { ProductActions } from '@/components/product-actions'
import { getSiteData } from '@/lib/server-data'
import { breadcrumbLd } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Contact MASFIG LTD & Request a Quote | Lagos, Nigeria',
  description: 'Contact MASFIG LTD for commercial kitchen, bakery and food processing equipment. Call, WhatsApp or send a quote request.',
  alternates: { canonical: '/contact/' },
}

export default async function ContactPage() {
  const { settings } = await getSiteData()
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Contact' }]} title="Request a quote">
        Tell us what you need and we will respond with availability and pricing.
      </PageHeader>
      <div className="container-x section-pad grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <ProductActions name="general equipment enquiry" path="/contact/" phone={settings.phone1} whatsapp={settings.whatsapp} />
          <dl className="mt-8 space-y-4 rounded-3xl bg-surface p-6 text-ink">
            <div><dt className="text-sm text-ink-soft">Phone</dt><dd className="font-semibold"><a href={`tel:${settings.phone1}`} className="hover:text-primary">{settings.phone1}</a>{settings.phone2 && <> · <a href={`tel:${settings.phone2}`} className="hover:text-primary">{settings.phone2}</a></>}{settings.phone3 && <> · <a href={`tel:${settings.phone3}`} className="hover:text-primary">{settings.phone3}</a></>}</dd></div>
            {settings.email && <div><dt className="text-sm text-ink-soft">Email</dt><dd className="font-semibold"><a href={`mailto:${settings.email}`} className="hover:text-primary">{settings.email}</a></dd></div>}
            {settings.address && <div><dt className="text-sm text-ink-soft">Head office</dt><dd className="font-semibold">{settings.address}</dd></div>}
            {settings.branchAddress && <div><dt className="text-sm text-ink-soft">Branch office</dt><dd className="font-semibold">{settings.branchAddress}</dd></div>}
            {settings.hours && <div><dt className="text-sm text-ink-soft">Hours</dt><dd className="font-semibold">{settings.hours}</dd></div>}
          </dl>
        </div>
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8"><QuoteForm kind="GENERAL" /></div>
      </div>
    </PageShell>
  )
}
