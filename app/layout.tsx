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
    icons: { icon: '/favicon.png' },
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
  return (
    <html lang="en-NG" className="bg-background" suppressHydrationWarning>
      <body className="antialiased font-sans text-foreground">
        <ThemeLoader />
        {children}
        <ConsentAndTags initial={tracking} />
        <SiteStats />
      </body>
    </html>
  )
}
