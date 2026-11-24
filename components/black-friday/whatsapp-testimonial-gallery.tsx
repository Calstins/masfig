'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface Shot { src: string; alt: string }

/** Customer WhatsApp screenshots: swipeable strip on mobile, grid on desktop, click to enlarge. Images keep their own aspect ratio (never cropped). */
export function WhatsappTestimonialGallery({ shots, children }: { shots: Shot[]; children?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length])
  useEffect(() => {
    if (open === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; opener.current?.focus() }
  }, [open, go])

  if (!shots.length) return null
  return (
    <section id="feedback" className="scroll-mt-24 bg-surface py-16 md:py-24" aria-labelledby="fb-heading">
      <div className="container-x">
        <p className="eyebrow">Customer feedback</p>
        <h2 id="fb-heading" className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">What our customers are saying</h2>
        <p className="mt-2 max-w-xl text-ink-soft">Messages from customers on WhatsApp. Tap a screenshot to enlarge it.</p>
        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {shots.map((s, i) => (
            <li key={s.src} className="w-64 shrink-0 snap-center md:w-auto">
              <button
                type="button"
                onClick={(e) => { opener.current = e.currentTarget; setOpen(i) }}
                aria-label={`Enlarge screenshot ${i + 1} of ${shots.length}`}
                className="block w-full overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" className="h-auto w-full" />
              </button>
            </li>
          ))}
        </ul>
        {children && <div className="mt-8 flex justify-center">{children}</div>}
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Customer screenshot" className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)}>
          <button ref={closeRef} type="button" onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"><X aria-hidden className="h-6 w-6" /></button>
          {shots.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous screenshot" className="absolute left-3 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"><ChevronLeft aria-hidden className="h-6 w-6" /></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next screenshot" className="absolute right-3 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"><ChevronRight aria-hidden className="h-6 w-6" /></button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[open].src} alt={shots[open].alt} onClick={(e) => e.stopPropagation()} className="max-h-[88vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  )
}
