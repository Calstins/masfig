'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

/** The share link may use any Facebook host; the official plugin needs www.facebook.com. */
function plugin(url: string) {
  let u = url
  try { const x = new URL(url); x.hostname = 'www.facebook.com'; u = x.toString() } catch { /* use as given */ }
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false&width=560&t=0`
}

/**
 * Click-to-load official Facebook video player: nothing from Facebook loads (and no Facebook cookies are set) until the visitor
 * presses play, it never autoplays, and a plain link stays underneath in case Facebook blocks embedding.
 */
export function FacebookVideoFrame({ url }: { url: string }) {
  const [on, setOn] = useState(false)
  return (
    <section id="video" className="scroll-mt-24 bg-ink py-16 text-white md:py-24" aria-labelledby="video-heading">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="video-heading" className="text-3xl font-extrabold sm:text-4xl">See our equipment in action</h2>
          <p className="mt-3 text-white/75">Explore our products and discover how MASFIG supports professional storage and business operations.</p>
        </div>
        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl bg-black ring-1 ring-white/15">
          <div className="relative aspect-video">
            {on ? (
              <iframe
                src={plugin(url)}
                title="MASFIG video on Facebook"
                loading="lazy"
                allow="encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button type="button" onClick={() => setOn(true)} aria-label="Play the MASFIG video" className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#2e2829] to-black">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl transition group-hover:scale-105"><Play aria-hidden className="h-9 w-9 translate-x-0.5" fill="currentColor" /></span>
                <span className="text-sm font-semibold text-white/80">Play video</span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-white/60">
          Video not loading?{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline underline-offset-4">Watch it on Facebook</a>.
        </p>
      </div>
    </section>
  )
}
