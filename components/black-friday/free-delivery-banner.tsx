'use client'

import { MapPin, Truck } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { DELIVERY, deliveryCities } from './campaign-data'
import { useCampaign } from './campaign-provider'
import { WhatsappCta } from './campaign-cta'

/** Free-delivery band: a truck driving along a moving road, city chips that pop in, and a WhatsApp button. Hidden once the offer ends. */
export function FreeDeliveryBanner() {
  const { product: p, status } = useCampaign()
  if (status !== 'active') return null
  return (
    <section aria-labelledby="delivery-heading" className="relative overflow-hidden bg-gradient-to-r from-primary via-[#8f2a2e] to-primary text-white">
      <div className="container-x grid items-center gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:py-14">
        <Reveal from="left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em]"><Truck aria-hidden className="h-4 w-4" /> Black Friday bonus</p>
          <h2 id="delivery-heading" className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Free delivery in {deliveryCities()}</h2>
          <p className="mt-3 max-w-lg text-white/90">Order {DELIVERY.freeMinQty} or more {p.plural} and we deliver free to your location in these cities. Send us your address on WhatsApp to confirm.</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {DELIVERY.cities.map((c, i) => (
              <li key={c} className="bf-chip inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink" style={{ animationDelay: `${300 + i * 180}ms` }}>
                <MapPin aria-hidden className="h-4 w-4 text-primary" /> {c}
              </li>
            ))}
          </ul>
          <div className="mt-6"><WhatsappCta placement="delivery" /></div>
        </Reveal>

        <Reveal from="right" delay={120}>
          <div aria-hidden className="relative h-40 overflow-hidden rounded-3xl bg-black/30 ring-1 ring-white/20 md:h-48">
            <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-9 flex">
              <div className="bf-truck">
                <Truck className="h-16 w-16 text-white drop-shadow-lg md:h-20 md:w-20" strokeWidth={1.6} />
              </div>
            </div>
            <div className="bf-road absolute inset-x-0 bottom-6 h-1" />
            <div className="absolute inset-x-0 bottom-0 h-6 bg-black/40" />
            <span className="absolute right-3 top-3"><span className="bf-shine block rounded-full bg-[#ff6b2c] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink">Free delivery</span></span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
