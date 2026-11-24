'use client'

import { useRef, useState } from 'react'
import { Loader2, Play } from 'lucide-react'

type State = 'idle' | 'loading' | 'playing' | 'error'

/**
 * The campaign video, hosted with the site (public/assets/black-friday/). Portrait frame, no heading, never autoplays.
 * Nothing but the poster downloads until the visitor presses play. If the browser cannot load or play the file, a plain
 * link to the file is shown so the visitor can still open it.
 */
export function CampaignVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<State>('idle')

  function start() {
    const v = ref.current
    if (!v) return
    setState('loading')
    v.controls = true
    v.play().catch(() => {
      // The browser refused to start it (or the file could not be loaded)
      if (v.error) setState('error')
      else setState('idle')
    })
  }

  return (
    <section id="video" className="bg-ink py-12 md:py-16" aria-label="MASFIG video">
      <div className="container-x">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-3xl bg-black ring-1 ring-white/15 sm:max-w-sm">
          <video
            ref={ref}
            playsInline
            preload="metadata"
            poster={poster}
            src={src}
            className="h-full w-full bg-black object-contain"
            onPlaying={() => setState('playing')}
            onWaiting={() => setState((s) => (s === 'playing' ? 'loading' : s))}
            onPause={() => setState((s) => (s === 'playing' ? 'idle' : s))}
            onEnded={() => setState('idle')}
            onError={() => setState('error')}
          >
            Your browser cannot play this video.
          </video>
          {(state === 'idle' || state === 'loading') && (
            <button
              type="button"
              onClick={start}
              disabled={state === 'loading'}
              aria-label={state === 'loading' ? 'Loading video' : 'Play video'}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/10"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-xl">
                {state === 'loading' ? <Loader2 aria-hidden className="h-9 w-9 animate-spin" /> : <Play aria-hidden className="h-9 w-9 translate-x-0.5" fill="currentColor" />}
              </span>
            </button>
          )}
          {state === 'error' && (
            <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 p-6 text-center text-white">
              <p className="font-semibold">This video could not be played here.</p>
              <a href={src} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold">Open the video</a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
