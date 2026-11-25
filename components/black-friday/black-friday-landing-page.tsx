import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { getCatalog, getSiteData } from '@/lib/server-data'
import { breadcrumbLd, faqLd } from '@/lib/schema'
import { buildMetadata } from '@/lib/seo'
import { plainText } from '@/lib/site'
import type { CatalogProduct } from '@/lib/types'
import { BlackFridayHero, type HeroImage } from './black-friday-hero'
import { CampaignOrderCta } from './campaign-order-cta'
import { CampaignPageTracker } from './campaign-page-tracker'
import { CampaignProvider } from './campaign-provider'
import { CampaignStickyCta } from './campaign-sticky-cta'
import { CampaignFaq } from './campaign-faq'
import { CampaignVideo } from './campaign-video'
import { ProductBenefits } from './product-benefits'
import { FreeDeliveryBanner } from './free-delivery-banner'
import { FloatingWhatsapp } from './floating-whatsapp'
import { PurchaseActivityToast } from './purchase-activity-toast'
import { WhatsappTestimonialGallery, type Shot } from './whatsapp-testimonial-gallery'
import { WhatsappCta } from './campaign-cta'
import { CAMPAIGN, FAQ, VIDEO, PRODUCTS, naira, type CampaignProduct, type ProductKey } from './campaign-data'

const ASSET_DIR = 'assets/black-friday'
/** True when the site was built after the deadline, so the static FAQ markup never advertises an expired price. */
const ENDED_AT_BUILD = Date.now() > Date.parse(CAMPAIGN.endsAt)

async function matchCatalogProduct(p: CampaignProduct): Promise<CatalogProduct | null> {
  try {
    const { products } = await getCatalog()
    if (p.productSlug) return products.find((x) => x.slug === p.productSlug) ?? null
    const names = p.matchNames.map((n) => n.toLowerCase())
    return products.find((x) => names.includes(x.name.trim().toLowerCase())) ?? null
  } catch {
    return null
  }
}

function publicFile(rel: string): string | null {
  return fs.existsSync(path.join(process.cwd(), 'public', rel)) ? `/${rel}` : null
}

/** Only screenshots that really exist in public/assets/black-friday/ are shown. */
function findScreenshots(p: CampaignProduct): Shot[] {
  const out: Shot[] = []
  for (const letter of ['a', 'b', 'c', 'd']) {
    for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
      const src = publicFile(`${ASSET_DIR}/${p.screenshotPrefix}${letter}.${ext}`)
      if (src) { out.push({ src, alt: `Customer WhatsApp feedback about ${p.name}, screenshot ${out.length + 1}` }); break }
    }
  }
  return out
}

function heroImage(p: CampaignProduct, match: CatalogProduct | null): HeroImage {
  if (p.imageOverride) {
    const src = publicFile(`${ASSET_DIR}/${p.imageOverride}`)
    if (src) return { kind: 'file', src, alt: p.name }
  }
  const m = match?.images[0]
  return m ? { kind: 'media', media: m, alt: m.alt || match!.name } : null
}

export async function blackFridayMetadata(key: ProductKey): Promise<Metadata> {
  const p = PRODUCTS[key]
  const img = heroImage(p, await matchCatalogProduct(p))
  const image = img?.kind === 'media' ? { url: img.media.url, width: img.media.width, height: img.media.height, alt: p.name } : img?.kind === 'file' ? { url: img.src, width: null, height: null, alt: p.name } : { url: '/logo-main.png', width: null, height: null, alt: 'MASFIG LTD' }
  return buildMetadata({
    title: `MASFIG Black Friday 2026 | ${p.name} — ${naira(p.promoPrice)}`,
    absoluteTitle: true,
    description: p.seoDescription,
    path: p.route,
    image,
  })
}

export async function BlackFridayLandingPage({ productKey }: { productKey: ProductKey }) {
  const p = PRODUCTS[productKey]
  const [{ settings, footer }, match] = await Promise.all([getSiteData(), matchCatalogProduct(p)])
  const image = heroImage(p, match)
  const shots = findScreenshots(p)
  const videoSrc = publicFile(`${ASSET_DIR}/${VIDEO.file}`)
  const videoPoster = publicFile(`${ASSET_DIR}/${VIDEO.poster}`)
  const description = match ? (match.summary || plainText(match.description, 400)) || p.description : p.description
  const facts = match ? ([['Dimensions', match.dimensions], ['Capacity', match.capacity], ['Warranty', match.warranty]] as [string, string][]).filter(([, v]) => v) : []
  const faq = faqLd(FAQ.map((f, i) => ({ id: i, question: f.question, answer: f.answer(p, ENDED_AT_BUILD) })))
  const graph = [
    breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Black Friday 2026', path: p.route }, { name: p.name, path: p.route }]),
    ...(faq ? [faq] : []),
  ]

  return (
    <CampaignProvider product={p} whatsapp={settings.whatsapp}>
      <JsonLd data={graph} />
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Navbar settings={settings} />
        <main className="pt-[4.5rem]">
          <BlackFridayHero p={p} image={image} />
          <FreeDeliveryBanner />
          <ProductBenefits p={p} description={description} facts={facts}>
            <WhatsappCta placement="benefits" />
          </ProductBenefits>
          <WhatsappTestimonialGallery shots={shots}>
            <WhatsappCta placement="testimonial" />
          </WhatsappTestimonialGallery>
          {videoSrc && <CampaignVideo src={videoSrc} poster={videoPoster ?? undefined} />}
          <CampaignFaq p={p} />
          <CampaignOrderCta />
        </main>
        <Footer data={footer} settings={settings} />
        <CampaignStickyCta />
        <PurchaseActivityToast />
        <FloatingWhatsapp />
        <CampaignPageTracker />
      </div>
    </CampaignProvider>
  )
}
