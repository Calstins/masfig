import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardList, FileText, CheckCircle2, Truck, Wrench, LifeBuoy, MessageCircle, Phone } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { JsonLd } from '@/components/seo/json-ld'
import { Reveal } from '@/components/reveal'
import { getSiteData } from '@/lib/server-data'
import { breadcrumbLd, faqLd } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { telLink, whatsappLink } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Equipment Delivery & Installation in Nigeria | MASFIG LTD',
  description: 'How MASFIG LTD handles delivery and installation of commercial kitchen, bakery, refrigeration and food equipment from Lagos: from quote to handover.',
  path: '/delivery-and-installation/', absoluteTitle: true,
  keywords: ['equipment delivery Nigeria', 'kitchen equipment installation Lagos', 'commercial equipment installation'],
})

const STEPS = [
  { icon: ClipboardList, title: 'Tell us what you need', text: 'Send your equipment list or describe your business: what you make or serve, how much, and your location. Call, message us on WhatsApp or use the quote form.' },
  { icon: FileText, title: 'Receive your quotation', text: 'We confirm the models and options, availability, and what delivery and installation involve for your site. Specifications and prices are confirmed here.' },
  { icon: CheckCircle2, title: 'Confirm your order', text: 'Once you accept the quotation and we agree the payment terms in writing, we confirm the order and plan delivery with you.' },
  { icon: Truck, title: 'Delivery', text: 'We arrange transport to your premises. Give us the address, access route and a contact person so the equipment arrives smoothly.' },
  { icon: Wrench, title: 'Installation and handover', text: 'Where installation is included in your quotation, we position and connect the equipment and show your team how to use it. Gas, water, electrical and building work by qualified tradespeople should be ready beforehand.' },
  { icon: LifeBuoy, title: 'Support', text: 'If you have a question or a problem after handover, contact us and we will help you work out the next step.' },
]

const PREPARE = [
  'Measure the space and the doors, corridors and lifts the equipment must pass through.',
  'Confirm your gas type, water supply, drainage and electrical supply (single or three-phase) for each machine. We tell you the requirement of the specific model.',
  'Plan a backup power supply, if you use one, for everything that runs together.',
  'Clear the route and the installation area, and arrange a person to receive and inspect the delivery.',
  'Arrange any building, ventilation or electrical work with qualified tradespeople before installation day.',
]

const FAQS = [
  { question: 'Do you deliver outside Lagos?', answer: 'We supply from Lagos and can arrange delivery to other locations in Nigeria. Tell us your address when you request a quote and we will confirm what is involved.' },
  { question: 'Is installation included?', answer: 'It depends on the equipment and your site. We state what is included, and what you need to prepare, in your quotation.' },
  { question: 'How long does delivery take?', answer: 'It depends on the item, whether it is in stock or on order, and your location. We confirm the timing in your quotation rather than promising a fixed time here.' },
  { question: 'What should I prepare before delivery?', answer: 'Check your measurements, gas, water, drainage and power, and clear the route to the installation area. Our checklist on this page lists the main points.' },
  { question: 'Who do I contact if something is wrong on arrival?', answer: 'Inspect the equipment on delivery and tell us straight away by phone or WhatsApp, with photos if you can, so we can help.' },
]

export default async function DeliveryPage() {
  const { settings } = await getSiteData()
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Delivery & installation', path: '/delivery-and-installation/' }])} />
      <JsonLd data={faqLd(FAQS.map((f, i) => ({ id: i, ...f })))!} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: 'Delivery & installation' }]} title="Delivery and installation">
        From your first enquiry to a working kitchen, bakery or shop: how an order with MASFIG LTD works.
      </PageHeader>

      <section className="container-x section-pad">
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 60} as="li" className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-primary"><s.icon className="h-6 w-6" /></span>
              <h2 className="mt-4 text-xl font-bold text-ink"><span className="text-primary">{i + 1}.</span> {s.title}</h2>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-kitchen-soft border-y border-border bg-surface">
        <div className="container-x section-pad grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">Prepare your site</h2>
            <p className="mt-3 text-ink-soft">A little preparation avoids delays on the day.</p>
            <ul className="mt-6 space-y-3">{PREPARE.map((p) => <li key={p} className="flex gap-3 text-ink-soft"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{p}</li>)}</ul>
            <p className="mt-6 text-sm text-ink-soft">Read our guide on <Link href="/blog/preparing-your-premises-for-equipment-delivery/" className="font-semibold text-primary hover:underline">preparing your premises for equipment delivery</Link>.</p>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-ink">Common questions</h2>
            <div className="mt-6 space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-2xl border border-border bg-white p-5">
                  <summary className="cursor-pointer list-none font-semibold text-ink">{f.question}</summary>
                  <p className="mt-3 text-ink-soft">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-kitchen-red relative overflow-hidden py-16 text-white md:py-20">
        <div className="container-x text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">Ready to plan your delivery?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">Send us your list and location for a quotation that covers delivery and installation.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact/" className="btn bg-white px-8 py-4 text-base text-primary"><FileText className="h-5 w-5" />Request a quote</Link>
            <a href={whatsappLink(settings.whatsapp, 'Hello MASFIG, I would like to ask about delivery and installation.')} target="_blank" rel="noopener noreferrer" className="btn border border-white/60 px-8 py-4 text-base text-white hover:bg-white/10"><MessageCircle className="h-5 w-5" />WhatsApp</a>
            <a href={telLink(settings.phone1)} className="btn border border-white/60 px-8 py-4 text-base text-white hover:bg-white/10"><Phone className="h-5 w-5" />{settings.phone1}</a>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
