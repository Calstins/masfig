'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, FileText, MessageCircle, Pause, Play } from 'lucide-react'
import type { MediaRef } from '@/lib/types'
import { ResponsiveImage } from './responsive-image'

export type SlideView = {
  id: number
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  quoteLabel: string
  href: string
  quoteHref: string
  label: string
  image: MediaRef | null
  imageAlt: string
}

const DURATION = 4500

export function HeroSlider({ slides, whatsappHref, phone }: { slides: SlideView[]; whatsappHref: string; phone: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touch = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => go(index + 1), DURATION)
    return () => clearTimeout(t)
  }, [index, paused, count, go])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured equipment categories"
      className={`relative overflow-hidden bg-kitchen-soft pt-28 pb-14 md:pt-36 md:pb-16 ${paused ? 'hs-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKey}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touch.current = null
      }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl" />

      <div className="container-x relative grid">
        {slides.map((s, i) => {
          const active = i === index
          const Title = i === 0 ? 'h1' : 'h2'
          return (
            <div
              key={s.id}
              className={`hs-slide grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 ${active ? 'is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.label}`}
              aria-hidden={!active}
              {...(!active ? { inert: true } : {})}
            >
              <div className="order-2 lg:order-1">
                {s.eyebrow && <p className="eyebrow hs-up">{s.eyebrow}</p>}
                <Title className="hs-up mt-5 text-4xl font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-[3.4rem]" style={{ ['--d' as string]: '90ms' }}>{s.title}</Title>
                {s.subtitle && <p className="hs-up mt-6 max-w-xl text-lg leading-relaxed text-ink-soft" style={{ ['--d' as string]: '190ms' }}>{s.subtitle}</p>}
                <div className="hs-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '290ms' }}>
                  <Link href={s.href} className="btn-primary px-8 py-4 text-base">{s.ctaLabel} <ArrowRight className="h-4 w-4" /></Link>
                  <Link href={s.quoteHref} className="btn-outline px-8 py-4 text-base"><FileText className="h-4 w-4" />{s.quoteLabel}</Link>
                </div>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hs-up mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-primary" style={{ ['--d' as string]: '380ms' }}>
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp · {phone}
                </a>
              </div>

              <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
                <div aria-hidden className="hs-ring absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[42%_58%_55%_45%/50%_45%_55%_50%] border-2 border-dashed border-primary/30" />
                <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] bg-primary" />
                <div className="hs-pop relative aspect-square overflow-hidden rounded-[2rem] bg-surface shadow-2xl shadow-ink/20">
                  {s.image && (
                    <ResponsiveImage media={s.image} alt={s.imageAlt || s.label} priority={i === 0} sizes="(min-width:1024px) 45vw, 90vw" className="h-full w-full object-contain p-4" />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">{s.label}</span>
                </div>
                <div className="hs-chip absolute -left-3 bottom-8 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl shadow-ink/15 sm:flex" style={{ ['--d' as string]: '.55s' }}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-primary"><FileText className="h-5 w-5" /></span>
                  <span><span className="block text-sm font-semibold text-ink">Quoted to your needs</span><span className="block text-xs text-primary">Reply within the day</span></span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {count > 1 && (
        <div className="container-x relative mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(index - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:border-primary hover:text-primary" aria-label="Previous slide"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => setPaused(!paused)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:border-primary hover:text-primary" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
            <button type="button" onClick={() => go(index + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:border-primary hover:text-primary" aria-label="Next slide"><ArrowRight className="h-4 w-4" /></button>
          </div>
          <ol className="flex flex-wrap items-center justify-center gap-1" aria-label="Choose slide">
            {slides.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => go(i)} aria-current={i === index} aria-label={`Slide ${i + 1}: ${s.label}`} title={s.label} className="group block px-0.5 py-3">
                  <span className="block h-1 w-5 overflow-hidden rounded-full bg-ink/10 transition-all group-hover:bg-ink/20 sm:w-7">
                    {i === index && <span key={`${index}-${paused}`} className="hs-progress block h-full w-full rounded-full bg-primary" style={{ ['--dur' as string]: `${DURATION}ms` }} />}
                    {i < index && <span className="block h-full w-full rounded-full bg-primary/40" />}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
