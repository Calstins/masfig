/**
 * MASFIG BLACK FRIDAY 2026 — the ONE place to change prices, dates, copy and messages.
 * Nothing else in the codebase contains a promotional price.
 */

export type ProductKey = 'single-shelves' | 'double-shelves' | 'warehouse-rack'

export const CAMPAIGN = {
  id: 'black_friday_2026',
  name: 'MASFIG BLACK FRIDAY 2026',
  timezone: 'Africa/Lagos',
  /** WAT is UTC+01:00 all year (Nigeria has no daylight saving). */
  startsAt: '2026-11-24T00:00:00+01:00',
  endsAt: '2026-11-30T23:59:59+01:00',
  minQty: 10,
  maxQty: 5000,
} as const

/** Campaign video, hosted with the site. Files live in public/assets/black-friday/ (Cloudflare Pages allows up to 25 MiB per file). */
export const VIDEO = { file: 'masfig-video.mp4', poster: 'masfig-video-poster.jpg' }

export interface ActivityEntry { quantity: number; place: string }
/** A verified purchase record, for when a backend supplies real data. Nothing else may be shown as a real purchase. */
export interface VerifiedActivity { text: string; place?: string }

export interface CampaignProduct {
  key: ProductKey
  /** Tracking id used in analytics events. */
  trackingId: 'single_shelves' | 'double_shelves' | 'warehouse_rack'
  route: string
  name: string
  /** Plural used in sentences such as "10 Single Shelves". */
  plural: string
  /** Exact catalogue product names (case-insensitive) to take the photo and description from. */
  matchNames: string[]
  /** Set this to a catalogue product slug to force the match (overrides matchNames). */
  productSlug?: string
  /** Optional photo placed in public/assets/black-friday/ (used before the catalogue image). */
  imageOverride?: string
  previousPrice: number
  promoPrice: number
  minQty: number
  headline: string
  tagline: string
  /** Used when the catalogue has no description for the product. Keep it free of unverified technical claims. */
  description: string
  benefits: { title: string; text: string; promo?: boolean }[]
  /** Prefix of the WhatsApp screenshot files, e.g. "product1" → product1a.png … product1d.png. */
  screenshotPrefix: string
  seoDescription: string
  /** ILLUSTRATIVE entries for the "recent activity" pop-up. They are labelled as sample activity on screen. */
  demoActivity: ActivityEntry[]
  /** Replace with real, verified orders (or load them from an API) to show them without the "sample" label. */
  verifiedActivity: VerifiedActivity[]
}

const common = {
  verifiedActivity: [] as VerifiedActivity[],
}

export const PRODUCTS: Record<ProductKey, CampaignProduct> = {
  'single-shelves': {
    ...common,
    key: 'single-shelves',
    trackingId: 'single_shelves',
    route: '/black-friday/single-shelves/',
    name: 'Single Shelves',
    plural: 'Single Shelves',
    matchNames: ['Single Shelves', 'Single Shelf'],
    previousPrice: 110_000,
    promoPrice: 100_000,
    minQty: 10,
    headline: 'Upgrade Your Storage. Save More This Black Friday.',
    tagline: 'Organised storage for shops, stores and warehouses.',
    description:
      'Single Shelves help you organise stock and use your available space more efficiently.',
    benefits: [
      { title: 'Organised storage', text: 'Keep stock sorted, visible and easier to find for your team.' },
      { title: 'Efficient use of space', text: 'Make better use of the floor and wall space you already have.' },
      { title: 'Suited to your business', text: 'Message us your shop or store layout and we will advise whether Single Shelves fit your use.' },
      { title: 'Bulk Black Friday price', text: 'Every unit is priced at ₦100,000 when you order 10 or more pieces.', promo: true },
    ],
    screenshotPrefix: 'product1',
    seoDescription:
      'MASFIG Black Friday 2026: Single Shelves at ₦100,000 per unit (was ₦110,000) when you order 10 or more pieces. Save ₦100,000 on the minimum order. Offer ends 30 November 2026.',
    demoActivity: [
      { quantity: 10, place: 'Abuja, Nigeria' },
      { quantity: 12, place: 'Lagos, Nigeria' },
      { quantity: 10, place: 'Port Harcourt, Nigeria' },
    ],
  },
  'double-shelves': {
    ...common,
    key: 'double-shelves',
    trackingId: 'double_shelves',
    route: '/black-friday/double-shelves/',
    name: 'Double Shelves',
    plural: 'Double Shelves',
    matchNames: ['Double Shelves', 'Double Shelf'],
    previousPrice: 160_000,
    promoPrice: 150_000,
    minQty: 10,
    headline: 'Arrange More. Save More This Black Friday.',
    tagline: 'Storage organisation for commercial spaces.',
    description:
      'Double Shelves help you arrange products efficiently in commercial storage areas.',
    benefits: [
      { title: 'Storage organisation', text: 'Arrange stock in an orderly layout that is easier to manage.' },
      { title: 'Efficient product arrangement', text: 'Plan your shelving around the products you sell and store.' },
      { title: 'Commercial applications', text: 'Message us how you plan to use them and we will advise on suitability.' },
      { title: 'Bulk Black Friday price', text: 'Every unit is priced at ₦150,000 when you order 10 or more pieces.', promo: true },
    ],
    screenshotPrefix: 'product2',
    seoDescription:
      'MASFIG Black Friday 2026: Double Shelves at ₦150,000 per unit (was ₦160,000) when you order 10 or more pieces. Save ₦100,000 on the minimum order. Offer ends 30 November 2026.',
    demoActivity: [
      { quantity: 10, place: 'Abuja, Nigeria' },
      { quantity: 15, place: 'Lagos, Nigeria' },
      { quantity: 10, place: 'Kano, Nigeria' },
    ],
  },
  'warehouse-rack': {
    ...common,
    key: 'warehouse-rack',
    trackingId: 'warehouse_rack',
    route: '/black-friday/warehouse-rack/',
    name: 'Warehouse Rack',
    plural: 'Warehouse Racks',
    matchNames: ['Warehouse Rack', 'Warehouse Racks', 'Warehouse Racking'],
    previousPrice: 220_000,
    promoPrice: 195_000,
    minQty: 10,
    headline: 'Build Your Storage Infrastructure. Save This Black Friday.',
    tagline: 'Warehouse organisation for business and industrial storage.',
    description:
      'Warehouse Racks give your business a structured way to organise stock and storage areas.',
    benefits: [
      { title: 'Warehouse organisation', text: 'Bring order to stock, goods and storage areas.' },
      { title: 'Storage infrastructure', text: 'A structured base for growing storage needs.' },
      { title: 'Business and industrial storage', text: 'Tell us what you store and we will advise on suitability before you order.' },
      { title: 'Bulk Black Friday price', text: 'Every unit is priced at ₦195,000 when you order 10 or more pieces.', promo: true },
    ],
    screenshotPrefix: 'product3',
    seoDescription:
      'MASFIG Black Friday 2026: Warehouse Rack at ₦195,000 per unit (was ₦220,000) when you order 10 or more pieces. Save ₦250,000 on the minimum order. Offer ends 30 November 2026.',
    demoActivity: [
      { quantity: 10, place: 'Abuja, Nigeria' },
      { quantity: 10, place: 'Lagos, Nigeria' },
      { quantity: 20, place: 'Ibadan, Nigeria' },
    ],
  },
}

export const PRODUCT_LIST = Object.values(PRODUCTS)

const ENDED = 'The MASFIG Black Friday 2026 offer has ended. Contact us on WhatsApp for current pricing and availability.'

export const FAQ: { question: string; answer: (p: CampaignProduct, ended?: boolean) => string }[] = [
  { question: 'What is the minimum order for the Black Friday price?', answer: (p, ended) => ended ? ENDED : `The promotional price of ${naira(p.promoPrice)} per unit applies when you order at least ${p.minQty} pieces of ${p.name}. That is a minimum order value of ${naira(p.promoPrice * p.minQty)}.` },
  { question: 'Does the promotional price apply to a single piece?', answer: (p, ended) => ended ? ENDED : `No. The Black Friday price applies only to orders of ${p.minQty} or more pieces of ${p.name}.` },
  { question: 'When does the offer end?', answer: (_p, ended) => ended ? ENDED : 'The offer runs from 24 November 2026 to 30 November 2026, 23:59 (Lagos time, WAT).' },
  { question: 'How do I order?', answer: () => 'Tap the WhatsApp button and send us the prefilled message, or use the quote form. Our team will confirm availability and payment details with you.' },
  { question: 'Is the quantity selector a checkout?', answer: () => 'No. It helps you work out the price. Nothing is reserved or paid until our team confirms your order with you.' },
  { question: 'Do you deliver and install?', answer: () => 'Delivery and installation arrangements depend on your location and order. Send us your location on WhatsApp and we will confirm the details.' },
]

/* ---------- helpers ---------- */

export function naira(n: number): string {
  return `₦${Math.round(n).toLocaleString('en-NG')}`
}

export function totals(p: CampaignProduct, qty: number) {
  const q = Math.max(p.minQty, Math.floor(qty) || p.minQty)
  const original = p.previousPrice * q
  const promo = p.promoPrice * q
  return { qty: q, original, promo, savings: original - promo, unitSaving: p.previousPrice - p.promoPrice }
}

export type CampaignStatus = 'upcoming' | 'active' | 'ended'

export function campaignStatus(now: number): CampaignStatus {
  if (now < Date.parse(CAMPAIGN.startsAt)) return 'upcoming'
  if (now > Date.parse(CAMPAIGN.endsAt)) return 'ended'
  return 'active'
}

export function whatsappMessage(p: CampaignProduct, qty: number, status: CampaignStatus): string {
  if (status !== 'active') {
    return `Hello MASFIG,\n\nI saw your Black Friday campaign for ${p.name}. Please share your current pricing and availability.`
  }
  const t = totals(p, qty)
  const lines = t.qty === p.minQty
    ? [`Promotional price: ${naira(p.promoPrice)} per unit.`, `Minimum quantity: ${p.minQty} pieces.`, `Total minimum order: ${naira(t.promo)}.`]
    : [`Promotional price: ${naira(p.promoPrice)} per unit.`, `Minimum quantity: ${p.minQty} pieces.`, `Quantity I need: ${t.qty} pieces.`, `Promotional total: ${naira(t.promo)}.`]
  return `Hello MASFIG,\n\nI am interested in your Black Friday offer for ${p.name}.\n\n${lines.join('\n')}\n\nPlease share more information, availability and payment details.`
}
