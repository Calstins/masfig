import { abs, SITE_URL, waNumber } from './site'
import type { CatalogPost, CatalogProduct, Faq, SiteSettings } from './types'

const ORG_ID = `${SITE_URL}/#organization`

function phones(s: SiteSettings) {
  return [s.phone1, s.phone2, s.phone3].filter((x): x is string => !!x)
}

export function organizationLd(s: SiteSettings) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: s.siteName,
    url: SITE_URL,
    logo: abs(s.logo),
    contactPoint: phones(s).map((t) => ({ '@type': 'ContactPoint', telephone: t, contactType: 'sales', areaServed: 'NG', availableLanguage: 'English' })),
    ...(s.email ? { email: s.email } : {}),
    ...(sameAs(s).length ? { sameAs: sameAs(s) } : {}),
  }
}

function sameAs(s: SiteSettings) {
  return [s.facebook, s.instagram, s.twitter].filter((x): x is string => !!x)
}

export function websiteLd(s: SiteSettings) {
  return { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: s.siteName, publisher: { '@id': ORG_ID }, inLanguage: 'en-NG' }
}

/** Only emitted when a real street address has been entered in Admin > Settings. */
export function localBusinessLd(s: SiteSettings) {
  if (!s.address?.trim()) return null
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: s.siteName,
    url: SITE_URL,
    image: abs(s.logo),
    telephone: s.phone1,
    address: { '@type': 'PostalAddress', streetAddress: s.address.trim(), addressCountry: 'NG' },
    ...(s.hours ? { openingHours: s.hours } : {}),
    parent: { '@id': ORG_ID },
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  }
}

export function itemListLd(name: string, items: { name: string; path: string }[]) {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })),
  }
}

export function collectionPageLd(name: string, description: string, path: string, items: { name: string; path: string }[]) {
  const url = abs(path)
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name,
    description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': ORG_ID },
    inLanguage: 'en-NG',
    mainEntity: itemListLd(name, items),
  }
}

export function faqLd(faqs: Faq[]) {
  if (!faqs.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }
}

const AVAIL: Record<string, string> = {
  IN_STOCK: 'https://schema.org/InStock',
  OUT_OF_STOCK: 'https://schema.org/OutOfStock',
}

export function productLd(p: CatalogProduct) {
  const url = abs(`/products/${p.category.slug}/${p.slug}/`)
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    description: p.summary || p.description.slice(0, 300),
    url,
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    ...(p.model ? { model: p.model } : {}),
    category: p.category.name,
    image: p.images.map((i) => abs(i.url)),
    // An offer is only published for products with a real, admin-entered price. Quote-only items get none.
    ...(p.priceMode === 'PRICE' && p.price
      ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency || 'NGN', url, availability: AVAIL[p.availability] ?? undefined, seller: { '@id': ORG_ID } } }
      : {}),
  }
}

export function postLd(p: CatalogPost) {
  const url = abs(`/blog/${p.slug}/`)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: p.title,
    description: p.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: p.publishedAt ?? undefined,
    dateModified: p.updatedAt,
    inLanguage: 'en-NG',
    ...(p.cover ? { image: abs(p.cover.url) } : {}),
    author: p.author ? { '@type': 'Person', name: p.author.name } : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  }
}

export { waNumber }
