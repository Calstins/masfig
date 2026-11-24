/**
 * The campaign video, hosted with the site (public/assets/black-friday/). Portrait frame, no heading, never autoplays and
 * downloads nothing until the visitor presses play (preload="none", with a poster image).
 */
export function CampaignVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <section id="video" className="bg-ink py-12 md:py-16" aria-label="MASFIG video">
      <div className="container-x">
        <div className="mx-auto w-full max-w-[22rem] overflow-hidden rounded-3xl bg-black ring-1 ring-white/15 sm:max-w-sm">
          <video
            controls
            playsInline
            preload="none"
            poster={poster}
            className="aspect-[9/16] w-full bg-black object-contain"
          >
            <source src={src} type="video/mp4" />
            Your browser cannot play this video.
          </video>
        </div>
      </div>
    </section>
  )
}
