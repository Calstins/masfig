import type { MetadataRoute } from 'next'
import { getCatalog } from '@/lib/server-data'
import { abs } from '@/lib/site'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products, posts } = await getCatalog()
  const at = (d?: string | null) => (d ? new Date(d) : undefined)
  return [
    { url: abs('/'), changeFrequency: 'weekly', priority: 1 },
    { url: abs('/products/'), changeFrequency: 'weekly', priority: 0.9 },
    { url: abs('/blog/'), changeFrequency: 'weekly', priority: 0.6 },
    { url: abs('/contact/'), changeFrequency: 'yearly', priority: 0.5 },
    { url: abs('/delivery-and-installation/'), changeFrequency: 'yearly', priority: 0.6 },
    { url: abs('/privacy/'), changeFrequency: 'yearly', priority: 0.2 },
    { url: abs('/terms/'), changeFrequency: 'yearly', priority: 0.2 },
    { url: abs('/sitemap/'), changeFrequency: 'monthly', priority: 0.2 },
    ...categories.map((c) => ({ url: abs(`/products/${c.slug}/`), lastModified: at(c.updatedAt), priority: 0.8, changeFrequency: 'weekly' as const, ...(c.image ? { images: [c.image.url] } : {}) })),
    ...products.map((p) => ({ url: abs(`/products/${p.category.slug}/${p.slug}/`), lastModified: at(p.updatedAt), priority: 0.7, changeFrequency: 'monthly' as const, images: p.images.slice(0, 4).map((i) => i.url) })),
    ...posts.map((p) => ({ url: abs(`/blog/${p.slug}/`), lastModified: at(p.updatedAt), priority: 0.6, changeFrequency: 'monthly' as const, ...(p.cover ? { images: [p.cover.url] } : {}) })),
  ]
}
