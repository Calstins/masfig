'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, Pause, Play, Quote } from 'lucide-react'
import type { ProjectsData } from '@/lib/types'
import { Reveal } from './reveal'

const DURATION = 7000

/** Client projects and testimonials as a slider. Only shown once real projects have been saved in the admin. */
export function Projects({ data }: { data: ProjectsData }) {
  const items = data.items.filter((p) => p.client.trim() || p.title.trim())
  const count = items.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touch = useRef<number | null>(null)
  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => go(index + 1), DURATION)
    return () => clearTimeout(t)
  }, [index, paused, count, go])

  if (!count) return null

  return (
    <section
      id="projects"
      aria-roledescription="carousel"
      aria-label="Client projects and testimonials"
      className="relative overflow-hidden bg-surface py-16 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1) }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touch.current = null
      }}
    >
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          {data.header.badge && <p className="eyebrow justify-center">{data.header.badge}</p>}
          <h2 className="mt-4 text-3xl font-extrabold text-ink md:text-5xl">{data.header.title}</h2>
          {data.header.description && <p className="mt-4 text-lg text-ink-soft">{data.header.description}</p>}
        </Reveal>

        <div className="mt-12 overflow-hidden">
          <div className="flex transition-transform duration-700 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${index * 100}%)` }}>
            {items.map((p, i) => {
              const metrics = p.metrics.filter((m) => m.label.trim() && m.value.trim())
              const equipment = p.equipment.filter((e) => e.trim())
              return (
                <div key={p.id} className="w-full shrink-0 px-1" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}: ${p.client}`} aria-hidden={i !== index} {...(i !== index ? { inert: true } : {})}>
                  <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_1fr]">
                    <div className="relative min-h-[18rem] overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-ink/10 lg:min-h-[28rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.image && <img src={p.image} alt={`${p.title || p.client}, a MASFIG LTD project`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                      {p.category && <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">{p.category}</span>}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold md:text-3xl">{p.client}</h3>
                        {p.title && <p className="mt-1 text-white/85">{p.title}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-5 rounded-[2rem] border border-border bg-white p-7 shadow-sm md:p-9">
                      {p.testimonial && (
                        <figure>
                          <Quote aria-hidden className="h-8 w-8 text-primary/30" />
                          <blockquote className="mt-2 text-lg leading-relaxed text-ink md:text-xl">{p.testimonial}</blockquote>
                          {(p.author || p.role) && (
                            <figcaption className="mt-4">
                              {p.author && <span className="block font-semibold text-ink">{p.author}</span>}
                              {p.role && <span className="block text-sm text-ink-soft">{p.role}</span>}
                            </figcaption>
                          )}
                        </figure>
                      )}
                      {p.result && (
                        <div className="flex items-start gap-3 rounded-2xl bg-brand-50 p-4">
                          <Award aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{data.labels.achievement}</p><p className="mt-0.5 font-medium text-ink">{p.result}</p></div>
                        </div>
                      )}
                      {metrics.length > 0 && (
                        <dl className="grid grid-cols-2 gap-3">
                          {metrics.map((m, k) => <div key={k} className="rounded-xl bg-surface p-3"><dt className="text-xs text-ink-soft">{m.label}</dt><dd className="text-xl font-extrabold text-primary">{m.value}</dd></div>)}
                        </dl>
                      )}
                      {equipment.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{data.labels.equipmentDeployed}</p>
                          <ul className="mt-2 flex flex-wrap gap-2">{equipment.map((e, k) => <li key={k} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink">{e}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {count > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => go(index - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:border-primary hover:text-primary" aria-label="Previous project"><ArrowLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => setPaused(!paused)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:border-primary hover:text-primary" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
              <button type="button" onClick={() => go(index + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:border-primary hover:text-primary" aria-label="Next project"><ArrowRight className="h-4 w-4" /></button>
            </div>
            <ol className="flex items-center gap-1" aria-label="Choose project">
              {items.map((p, i) => (
                <li key={p.id}>
                  <button type="button" onClick={() => go(i)} aria-current={i === index} aria-label={`Project ${i + 1}: ${p.client}`} className="block px-0.5 py-3">
                    <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : 'w-3 bg-ink/15 hover:bg-ink/30'}`} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        {data.bottomCta.heading && (
          <div className="mt-14 rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
            <h3 className="text-2xl font-extrabold text-ink md:text-3xl">{data.bottomCta.heading}</h3>
            {data.bottomCta.description && <p className="mx-auto mt-3 max-w-2xl text-ink-soft">{data.bottomCta.description}</p>}
            {data.bottomCta.buttonText && <Link href={data.bottomCta.buttonHref || '/contact/'} className="btn-primary mt-6 inline-flex px-8 py-4 text-base">{data.bottomCta.buttonText}</Link>}
          </div>
        )}
      </div>
    </section>
  )
}
