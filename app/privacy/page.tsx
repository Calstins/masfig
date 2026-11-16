import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { getSiteData } from '@/lib/server-data'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | MASFIG LTD',
  description: 'How MASFIG LTD collects, uses and protects personal information from quote requests, enquiries and website visits.',
  path: '/privacy/', absoluteTitle: true,
})

export default async function PrivacyPage() {
  const { settings } = await getSiteData()
  return (
    <LegalPage title="Privacy Policy" path="/privacy/" intro="What information we collect through this website, why, and the choices you have.">
      <section><h2>Who we are</h2><p>This website is operated by {settings.siteName}{settings.address ? `, ${settings.address}` : ', Lagos, Nigeria'}. We handle personal information in line with applicable Nigerian data protection law, including the Nigeria Data Protection Act 2023.</p></section>
      <section><h2>Information we collect</h2>
        <ul>
          <li><strong>Enquiries and quote requests:</strong> your name, phone number, email (optional), company (optional), the message you write, the product or category you asked about and the page you were on.</li>
          <li><strong>Campaign information:</strong> if you arrive from an advertisement or link with tracking tags (such as UTM tags), we record them with your enquiry so we know which advertising works.</li>
          <li><strong>Technical data:</strong> to protect the site from spam and abuse we process your IP address in a scrambled (hashed) form. We do not store it in readable form with your enquiry.</li>
          <li><strong>Analytics (only if you agree):</strong> where we use analytics or advertising tags, they load only after you accept the cookie notice.</li>
          <li><strong>Messages you send us elsewhere:</strong> if you contact us on WhatsApp or by phone, that conversation is handled on those services.</li>
        </ul>
      </section>
      <section><h2>How we use it</h2>
        <ul>
          <li>To reply to your enquiry, prepare a quotation and arrange delivery and installation.</li>
          <li>To keep business records and follow up on your request.</li>
          <li>To understand how the website performs and improve it.</li>
          <li>To prevent spam, fraud and misuse.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>
      <section><h2>Who we share it with</h2><p>We share information only with people and services that help us run the business and the website, such as hosting, data storage and communication providers, and with authorities where the law requires it. These providers process data on our behalf.</p></section>
      <section><h2>Third-party content</h2><p>Some pages may show content from other services, for example a Facebook video or post, or links to WhatsApp and social media. Those services may set their own cookies and apply their own privacy policies.</p></section>
      <section><h2>Cookies and similar technologies</h2><p>The site stores your cookie choice in your browser. You can change it by clearing your browser storage for this site, and you can block cookies in your browser settings.</p></section>
      <section><h2>How long we keep it</h2><p>We keep enquiry information for as long as it is needed to respond, to carry out any resulting order and to keep reasonable business and legal records, then delete or anonymise it.</p></section>
      <section><h2>Your rights</h2><p>Subject to the law, you may ask to access, correct or delete the personal information we hold about you, object to certain uses, or withdraw consent you gave. You may also complain to the Nigeria Data Protection Commission. To make a request, contact us using the details below and tell us what you want us to do.</p></section>
      <section><h2>Security</h2><p>We use reasonable technical and organisational measures to protect information, but no online service can promise absolute security.</p></section>
      <section><h2>Contact</h2><p>Phone: <a href={`tel:${settings.phone1}`}>{settings.phone1}</a>{settings.email && <> · Email: <a href={`mailto:${settings.email}`}>{settings.email}</a></>}{' '}· <a href="/contact/">Contact page</a></p></section>
      <section><h2>Changes</h2><p>We may update this policy and will change the date above when we do.</p></section>
    </LegalPage>
  )
}
