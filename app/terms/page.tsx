import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { getSiteData } from '@/lib/server-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use | MASFIG LTD',
  description: 'Terms for using the MASFIG LTD website, including product information, quotations, images and links.',
  path: '/terms/', absoluteTitle: true,
})

export default async function TermsPage() {
  const { settings } = await getSiteData()
  return (
    <LegalPage title="Terms of Use" path="/terms/" intro="The rules for using this website and how quotations and product information work.">
      <section><h2>About these terms</h2><p>By using this website you agree to these terms. If you do not agree, please do not use the site. The website is operated by {settings.siteName}, Nigeria.</p></section>
      <section><h2>Product information</h2><p>We take care to describe our equipment accurately, but descriptions, photographs, options and sizes on this site are for guidance. Photographs may show a representative unit. Exact specifications, capacity, power or fuel requirements, dimensions and finish are confirmed in your quotation for the model supplied.</p></section>
      <section><h2>Prices, quotations and availability</h2>
        <ul>
          <li>Where a price is not shown, please request a quotation.</li>
          <li>A quotation is an offer based on the information you gave us. An order is confirmed only when we confirm it in writing and any agreed payment terms are met.</li>
          <li>Prices, models and availability can change without notice and are not guaranteed until confirmed in your quotation.</li>
        </ul>
      </section>
      <section><h2>Delivery and installation</h2><p>Delivery and installation are arranged per order and described in <Link href="/delivery-and-installation/">Delivery &amp; installation</Link>. Timing and scope are confirmed on your quotation.</p></section>
      <section><h2>Using the website</h2><p>You agree not to misuse the site, attempt unauthorised access, send spam or unlawful content through our forms, copy the site at scale, or interfere with how it works.</p></section>
      <section><h2>Intellectual property</h2><p>The content, design, logos and images on this site belong to {settings.siteName} or its licensors and are protected by law. You may view and share pages for personal or ordinary business reference, but may not copy or reuse them commercially without our written permission.</p></section>
      <section><h2>Links and third-party content</h2><p>The site may link to or show content from other services. We do not control them and are not responsible for their content or practices.</p></section>
      <section><h2>Limits of liability</h2><p>The website is provided “as is”. To the extent the law allows, we are not liable for losses that result from using the website or relying on its information without confirming it in a quotation. Nothing in these terms limits any right you have under Nigerian consumer law that cannot be excluded.</p></section>
      <section><h2>Governing law</h2><p>These terms are governed by the laws of the Federal Republic of Nigeria, and disputes are subject to the courts of Lagos State unless the law requires otherwise.</p></section>
      <section><h2>Changes and contact</h2><p>We may update these terms and will change the date above when we do. Questions: <Link href="/contact/">contact us</Link> or call <a href={`tel:${settings.phone1}`}>{settings.phone1}</a>. See also our <Link href="/privacy/">Privacy Policy</Link>.</p></section>
    </LegalPage>
  )
}
