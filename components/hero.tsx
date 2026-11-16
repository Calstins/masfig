import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import type { HeroData } from '@/lib/types'
import { Reveal } from './reveal'

export function Hero({ data }: { data: HeroData }) {
  const float = data.floatingCards.find((c) => c.image)
  return (
    <section className="relative overflow-hidden bg-kitchen-soft pt-32 pb-20 md:pt-40 md:pb-28">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <Reveal><p className="eyebrow">{data.badge}</p></Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-[3.6rem]">
              {data.heading}
            </h1>
          </Reveal>
          <Reveal delay={160}><p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{data.description}</p></Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/products/" className="btn-primary px-8 py-4 text-base">Browse equipment <ArrowRight className="h-4 w-4" /></Link>
              <a href={data.ctaSecondary.href} target="_blank" rel="noopener noreferrer" className="btn-outline px-8 py-4 text-base"><MessageCircle className="h-4 w-4" />{data.ctaSecondary.text}</a>
            </div>
            <a href={data.ctaPrimary.href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-primary"><Phone className="h-4 w-4" />{data.ctaPrimary.text}: {data.ctaPrimary.href.replace('tel:', '')}</a>
          </Reveal>
          {data.trustBadges.length > 0 && (
            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap gap-8 border-t border-border pt-8">
                {data.trustBadges.map((b, i) => (
                  <div key={i}><p className="font-[family-name:var(--font-display)] text-2xl font-bold text-primary">{b.value}</p><p className="text-sm text-muted-foreground">{b.label}</p></div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
        <Reveal from="scale" delay={200} className="relative">
          <div aria-hidden className="absolute -bottom-5 -right-5 h-full w-full rounded-[2rem] bg-primary" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface shadow-2xl shadow-ink/20">
            <Image src={data.visual.image} alt="Commercial kitchen equipment supplied by MASFIG" fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{data.visual.label}</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">{data.visual.title}</p>
            </div>
          </div>
          {float && (
            <div className="float-slow absolute -left-6 bottom-16 hidden w-52 items-center gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-ink/15 sm:flex">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface"><Image src={float.image} alt="" fill sizes="56px" className="object-cover" /></div>
              <div><p className="text-sm font-semibold text-ink">{float.label}</p><p className="text-xs text-primary">Ask for a quote</p></div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
