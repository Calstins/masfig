export interface SiteSettings {
  siteName: string
  tagline: string
  metaTitle: string
  metaDescription: string
  phone1: string
  phone2: string
  whatsapp: string
  copyright: string
  logo: string
  navLinks: NavLink[]
  callLabel: string
  whatsappLabel: string
  /** Optional, added for SEO. Leave empty until MASFIG confirms them. */
  address?: string
  email?: string
  hours?: string
  /** Extra contact details from the product catalogue. */
  phone3?: string
  branchAddress?: string
  instagram?: string
  facebook?: string
  twitter?: string
  /** Site-wide switch. Off (default) = every product says "Request a quote" and no price is published. */
  showPrices?: boolean
  /** When false/absent, unverified claims (install counts, uptime, ROI figures) are hidden. */
  showUnverifiedClaims?: boolean
}

export interface NavLink {
  label: string
  href: string
}

export interface HeroVisual {
  image: string
  badge: string
  chipValue: string
  chipLabel: string
  label: string
  title: string
}

export interface HeroFloatingCard {
  image: string
  value: string
  label: string
  subtext: string
}

export interface HeroData {
  badge: string
  heading: string
  description: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary: { text: string; href: string }
  trustBadges: { label: string; value: string; subtext: string }[]
  visual: HeroVisual
  floatingCards: HeroFloatingCard[]
}

export interface EquipmentGridItem {
  id: number
  title: string
  description: string
  icon: string
  accent: string
  gradient: string
  stats: string[]
  features: string[]
}

export interface EquipmentGridData {
  header: { badge: string; title: string; titleGradient: string; description: string }
  cta: { primary: { text: string; href: string }; secondary: { text: string; href: string } }
  items: EquipmentGridItem[]
  bottomCta: { heading: string; description: string }
}

export interface StatItem {
  label: string
  value: number
  suffix: string
  icon: string
}

export interface StatsData {
  header: { badge: string; title: string; description: string }
  items: StatItem[]
  footerNote: string
}

export interface ShowcaseItem {
  id: string
  name: string
  category: string
  image: string
  description: string
  specs: string[]
  features: string[]
  capacity: string
  power: string
  badge: string
}

export interface ShowcaseCategory {
  id: string
  name: string
}

export interface EquipmentShowcaseData {
  header: { badge: string; title: string; description: string }
  categories: ShowcaseCategory[]
  items: ShowcaseItem[]
  detailsLabel: string
  bottomCta: { description: string; buttonText: string; buttonHref: string }
}

export interface ProjectMetric {
  label: string
  value: string
}

export interface Project {
  id: string
  client: string
  title: string
  category: string
  image: string
  metrics: ProjectMetric[]
  testimonial: string
  author: string
  role: string
  result: string
  equipment: string[]
}

export interface ProjectsData {
  header: { badge: string; title: string; description: string }
  labels: { achievement: string; equipmentDeployed: string }
  items: Project[]
  bottomCta: { heading: string; description: string; buttonText: string; buttonHref: string }
}

export interface DeliveryStep {
  icon: string
  title: string
  description: string
  details: string[]
}

export interface DeliveryFeature {
  icon: string
  title: string
  description: string
}

export interface DeliveryProcessData {
  header: { badge: string; title: string; description: string }
  steps: DeliveryStep[]
  features: DeliveryFeature[]
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterData {
  cta: { heading: string; description: string }
  contactLabels: {
    callLabel: string
    altLabel: string
    whatsappTagline: string
    whatsappTitle: string
    whatsappSubtitle: string
  }
  contactColumnTitle: string
  brand: { tagline: string }
  quickLinks: { title: string; links: FooterLink[] }
  services: { title: string; links: FooterLink[] }
  footerLinks: FooterLink[]
}

export type SectionData =
  | SiteSettings
  | HeroData
  | EquipmentGridData
  | StatsData
  | EquipmentShowcaseData
  | ProjectsData
  | DeliveryProcessData
  | FooterData

export interface Theme {
  background: string
  foreground: string
  card: string
  card_foreground: string
  popover: string
  popover_foreground: string
  primary: string
  primary_foreground: string
  secondary: string
  secondary_foreground: string
  muted: string
  muted_foreground: string
  accent: string
  accent_foreground: string
  destructive: string
  ring: string
}

export interface MediaItem {
  id: number
  filename: string
  path: string
  url: string
  mime_type: string
  size: number
  created_at: string
  alt?: string
  width?: number | null
  height?: number | null
  variants?: { width: number; url: string }[]
}

export interface MediaRef {
  id: number
  url: string
  alt: string
  width: number | null
  height: number | null
  variants: { width: number; url: string }[]
}

export interface Faq { id: number; question: string; answer: string }

export interface CatalogCategory {
  id: number; slug: string; name: string; h1: string; intro: string
  seoTitle: string; seoDescription: string
  image: MediaRef | null; imageAlt: string
  publishedAt: string | null; updatedAt: string
  faqs: Faq[]; productCount?: number
}

export interface CatalogProduct {
  id: number; slug: string; name: string; brand: string; model: string
  category: { id: number; slug: string; name: string }
  summary: string; description: string
  specs: { label: string; value: string }[] | Record<string, string> | null
  dimensions: string; capacity: string; power: string; applications: string[]
  availability: 'IN_STOCK' | 'ON_REQUEST' | 'OUT_OF_STOCK' | 'UNKNOWN'
  priceMode: 'PRICE' | 'QUOTE'
  price: number | null; currency: 'NGN' | 'USD'; warranty: string
  seoTitle: string; seoDescription: string
  publishedAt: string | null; updatedAt: string
  images: (MediaRef & { mediaId: number })[]
  faqs: Faq[]
}

export interface CatalogPost {
  id: number; slug: string; title: string; excerpt: string; body: string
  cover: MediaRef | null; coverAlt: string
  author: { id: number; name: string } | null
  tags: string[]
  category: { id: number; slug: string; name: string } | null
  products: { id: number; slug: string; name: string }[]
  seoTitle: string; seoDescription: string
  publishedAt: string | null; updatedAt: string
}

export interface Catalog {
  generatedAt: string
  /** Site-wide price switch from Admin > Settings. Off by default. */
  showPrices?: boolean
  categories: CatalogCategory[]
  products: CatalogProduct[]
  posts: CatalogPost[]
}

export interface AuthUser { id: number; name: string; email: string; role: 'ADMIN' | 'EDITOR'; mustChangePassword?: boolean }

export interface HeroSlideData {
  id: number
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  quoteLabel: string
  categoryId: number | null
  category: { id: number; slug: string; name: string } | null
  linkUrl: string
  image: MediaRef | null
  imageAlt: string
  sortOrder: number
  active: boolean
}

export interface FacebookFeedPost {
  id: string
  message: string
  createdTime: string
  permalink: string
  image: string | null
  isVideo: boolean
  videoEmbedUrl: string | null
}
export interface FacebookFeed { configured: boolean; pageUrl: string; pageName: string; stale?: boolean; posts: FacebookFeedPost[] }

/** Public tag IDs managed in Admin > Tracking. Empty string = not set. */
export interface TrackingConfig {
  gtmId: string
  ga4Id: string
  metaPixelId: string
  googleAdsId: string
  googleAdsLeadLabel: string
  clarityId: string
  googleSiteVerification: string
  bingSiteVerification: string
  facebookDomainVerification: string
  /** When true (default) nothing loads until the visitor accepts the cookie banner. */
  requireConsent: boolean
}

export const EMPTY_TRACKING: TrackingConfig = {
  gtmId: '', ga4Id: '', metaPixelId: '', googleAdsId: '', googleAdsLeadLabel: '', clarityId: '',
  googleSiteVerification: '', bingSiteVerification: '', facebookDomainVerification: '', requireConsent: true,
}
