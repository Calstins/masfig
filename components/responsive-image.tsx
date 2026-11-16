import type { MediaRef } from '@/lib/types'

/** <img> with srcset built from the WebP variants the API generates at upload time. */
export function ResponsiveImage({ media, alt, sizes = '(min-width:1024px) 33vw, 100vw', priority = false, className = '' }: {
  media: MediaRef; alt?: string; sizes?: string; priority?: boolean; className?: string
}) {
  const variants = [...media.variants].sort((a, b) => a.width - b.width)
  const srcSet = variants.length ? variants.map((v) => `${v.url} ${v.width}w`).join(', ') : undefined
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.url}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt ?? media.alt}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
}
