import type { Metadata } from 'next'
import { abs } from './site'
import type { MediaRef } from './types'

type Input = {
  title: string
  description: string
  path: string
  /** Use an absolute title (already contains the brand) instead of the layout template. */
  absoluteTitle?: boolean
  image?: Pick<MediaRef, 'url' | 'width' | 'height'> & { alt?: string } | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  keywords?: string[]
  noindex?: boolean
}

/** One place for canonical, Open Graph, Twitter and robots rules so every dynamic page gets the same treatment. */
export function buildMetadata(i: Input): Metadata {
  const image = i.image ? [{ url: i.image.url, ...(i.image.width ? { width: i.image.width } : {}), ...(i.image.height ? { height: i.image.height } : {}), alt: i.image.alt || i.title }] : undefined
  return {
    title: i.absoluteTitle ? { absolute: i.title } : i.title,
    description: i.description,
    ...(i.keywords?.length ? { keywords: i.keywords } : {}),
    alternates: { canonical: i.path },
    robots: i.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      title: i.title, description: i.description, url: i.path, type: i.type ?? 'website', locale: 'en_NG', siteName: 'MASFIG LTD',
      ...(image ? { images: image } : {}),
      ...(i.type === 'article' ? { publishedTime: i.publishedTime ?? undefined, modifiedTime: i.modifiedTime ?? undefined } : {}),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: i.title, description: i.description, ...(image ? { images: [image[0].url] } : {}) },
  }
}

export { abs }
