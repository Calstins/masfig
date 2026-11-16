'use client'

import { useEffect, useState } from 'react'
import { Play, ThumbsUp } from 'lucide-react'
import { getApiUrl } from '@/lib/api'
import type { FacebookFeed, FacebookFeedPost } from '@/lib/types'
import { Reveal } from './reveal'

function FbIcon({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor"><path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8S15.6 3.5 14.4 3.5c-2.6 0-4.2 1.5-4.2 4.3v2.7H7.5v3.3h2.7V22h3.3z" /></svg>
}

function when(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Card({ p }: { p: FacebookFeedPost }) {
  const [playing, setPlaying] = useState(false)
  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white">
      <div className="relative aspect-video bg-surface">
        {p.isVideo && playing && p.videoEmbedUrl ? (
          <iframe src={p.videoEmbedUrl} title="Video from our Facebook page" className="absolute inset-0 h-full w-full border-0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen />
        ) : (
          <>
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            ) : <div className="flex h-full w-full items-center justify-center text-primary/40"><FbIcon className="h-12 w-12" /></div>}
            {p.isVideo && (
              <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 flex items-center justify-center bg-ink/20 transition hover:bg-ink/30" aria-label="Play video">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition group-hover:scale-110"><Play className="h-6 w-6 translate-x-0.5" fill="currentColor" /></span>
              </button>
            )}
          </>
        )}
        {p.isVideo && !playing && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">Video</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted-foreground">{when(p.createdTime)}</p>
        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-ink-soft">{p.message || 'New post on our Facebook page.'}</p>
        <a href={p.permalink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><ThumbsUp className="h-4 w-4" />View on Facebook</a>
      </div>
    </article>
  )
}

/** Latest four posts of the Facebook page set up in Admin. Fetched in the browser so it is always current, and hidden when not connected. */
export function FacebookFeedSection() {
  const [feed, setFeed] = useState<FacebookFeed | null>(null)
  const [done, setDone] = useState(false)
  useEffect(() => {
    let off = false
    fetch(getApiUrl('/social/facebook'))
      .then((r) => (r.ok ? (r.json() as Promise<FacebookFeed>) : null))
      .then((f) => { if (!off) setFeed(f) })
      .catch(() => undefined)
      .finally(() => { if (!off) setDone(true) })
    return () => { off = true }
  }, [])

  if (done && (!feed || !feed.configured || feed.posts.length === 0)) return null
  return (
    <section className="section-pad bg-surface" aria-labelledby="fb-heading">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Latest from Facebook</p>
            <h2 id="fb-heading" className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{feed?.pageName || 'MASFIG'} on Facebook</h2>
            <p className="mt-2 max-w-xl text-ink-soft">New equipment, installations and demos from our team.</p>
          </div>
          {feed?.pageUrl && <a href={feed.pageUrl} target="_blank" rel="noopener noreferrer" className="btn-outline shrink-0"><FbIcon className="h-4 w-4" />Follow our page</a>}
        </Reveal>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!feed
            ? [0, 1, 2, 3].map((i) => <li key={i}><div className="shimmer h-80 rounded-3xl" /></li>)
            : feed.posts.slice(0, 4).map((p, i) => <li key={p.id}><Reveal delay={i * 80} className="h-full"><Card p={p} /></Reveal></li>)}
        </ul>
      </div>
    </section>
  )
}
