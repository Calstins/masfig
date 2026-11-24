import { ResponsiveImage } from '@/components/responsive-image'
import type { MediaRef } from '@/lib/types'
import { CAMPAIGN, type CampaignProduct } from './campaign-data'
import { CampaignCountdown } from './campaign-countdown'
import { CampaignPricePanel } from './campaign-price-panel'
import { ScrollCta, WhatsappCta } from './campaign-cta'
import { ActiveOnly } from './active-only'

export type HeroImage = { kind: 'media'; media: MediaRef; alt: string } | { kind: 'file'; src: string; alt: string } | null

export function BlackFridayHero({ p, image }: { p: CampaignProduct; image: HeroImage }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white" aria-labelledby="bf-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_20%,rgba(168,50,54,0.45),transparent_60%)]" />
      <div className="container-x relative grid gap-10 py-10 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#ff6b2c] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-ink">Black Friday 2026</p>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Black Friday special — {p.name}</p>
          <h1 id="bf-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{p.headline}</h1>
          <div className="mt-6"><CampaignPricePanel /></div>
          <div className="mt-6 max-w-md"><CampaignCountdown /></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsappCta placement="hero" />
            <ScrollCta href="#details" placement="hero_details">See details</ScrollCta>
          </div>
          <ActiveOnly><p className="mt-3 text-xs text-white/55">Offer runs 24–30 November 2026 (Lagos time). Promotional price applies to orders of {p.minQty} or more pieces only.</p></ActiveOnly>
        </div>
        <div className="relative">
          {image ? (
            <div className="rounded-3xl bg-white p-4 shadow-2xl shadow-black/40">
              {image.kind === 'media'
                ? <ResponsiveImage media={image.media} alt={image.alt} priority sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[4/3] w-full rounded-2xl object-contain" />
                // eslint-disable-next-line @next/next/no-img-element
                : <img src={image.src} alt={image.alt} fetchPriority="high" className="aspect-[4/3] w-full rounded-2xl object-contain" />}
            </div>
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
              <p className="font-display text-3xl font-extrabold">{p.name}</p>
              <p className="mt-1 text-sm text-white/60">{CAMPAIGN.name}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
