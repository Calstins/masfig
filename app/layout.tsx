import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeLoader } from '@/components/theme-loader'
import { ConsentAndTags } from '@/components/consent-and-tags'
import { SiteStats } from '@/components/site-stats'
import { SITE_URL } from '@/lib/site'
import { getSiteData } from '@/lib/server-data'
import { EMPTY_TRACKING } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData()
  const { settings } = site
  const tracking = { ...EMPTY_TRACKING, ...(site.tracking ?? {}) }
  const title = settings.metaTitle || 'MASFIG LTD — Commercial Kitchen & Bakery Equipment, Lagos'
  const description = settings.metaDescription
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${settings.siteName}` },
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', siteName: settings.siteName, locale: 'en_NG', title, description, url: '/', images: [{ url: settings.logo }] },
    twitter: { card: 'summary_large_image', title, description },
    icons: {
      // Google shows the icon in search results and ads: it needs a square image in multiples of 48px, plus /favicon.ico
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    verification: {
      google: tracking.googleSiteVerification || undefined,
      other: {
        ...(tracking.bingSiteVerification ? { 'msvalidate.01': tracking.bingSiteVerification } : {}),
        ...(tracking.facebookDomainVerification ? { 'facebook-domain-verification': tracking.facebookDomainVerification } : {}),
      },
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#a83236',
  userScalable: true,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const tracking = { ...EMPTY_TRACKING, ...((await getSiteData()).tracking ?? {}) }
  const pixel = /^\d{10,18}$/.test(tracking.metaPixelId) ? tracking.metaPixelId : ''
  return (
    <html lang="en-NG" className="bg-background" suppressHydrationWarning>
      <head>
        {/* Meta Pixel base code written straight into the page HTML, so Meta's setup tool and crawlers detect it without running scripts. */}
        {pixel && (
          <>
            <script dangerouslySetInnerHTML={{ __html: `if(location.pathname.indexOf('/admin')!==0){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');}` }} />
            <noscript><img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1`} /></noscript>
          </>
        )}
      </head>
      <body className="antialiased font-sans text-foreground">
        <ThemeLoader />
        {children}
        <ConsentAndTags initial={tracking} />
        <SiteStats />
      </body>
    </html>
  )
}
