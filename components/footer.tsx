import Link from 'next/link'
import { MessageCircle, Phone, Mail, MapPin, Lock } from 'lucide-react'
import type { FooterData, SiteSettings } from '@/lib/types'
import { telLink, whatsappLink } from '@/lib/site'
import { DevCredit } from './dev-credit'

const EXPLORE = [
  { label: 'All equipment', href: '/products/' },
  { label: 'Blog & guides', href: '/blog/' },
  { label: 'Delivery & installation', href: '/delivery-and-installation/' },
  { label: 'Request a quote', href: '/contact/' },
]

const SERVICES = [
  { label: 'Delivery', href: '/delivery-and-installation/' },
  { label: 'Installation', href: '/delivery-and-installation/' },
  { label: 'Support', href: '/contact/' },
]
const LEGAL = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Sitemap', href: '/sitemap/' },
]

const SVG = 'h-4 w-4'
function Social({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null
  return <a href={href} target="_blank" rel="noopener noreferrer me" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink-soft transition-colors hover:border-primary hover:bg-primary hover:text-white">{children}</a>
}

export function Footer({ data, settings }: { data: FooterData; settings: SiteSettings }) {
  const year = new Date().getFullYear()
  return (
    <footer id="contact" className="bg-kitchen-soft relative border-t border-border bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center" aria-label={`${settings.siteName} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-full.png" alt={settings.siteName} width={1260} height={300} className="h-14 sm:h-16 w-auto object-contain" />
        </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-soft">{data.brand.tagline}</p>
          {(settings.facebook || settings.instagram || settings.twitter) && (
            <div className="mt-5 flex gap-2.5">
              <Social href={settings.facebook} label="MASFIG on Facebook"><svg viewBox="0 0 24 24" className={SVG} fill="currentColor" aria-hidden><path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8S15.6 3.5 14.4 3.5c-2.6 0-4.2 1.5-4.2 4.3v2.7H7.5v3.3h2.7V22h3.3z" /></svg></Social>
              <Social href={settings.instagram} label="MASFIG on Instagram"><svg viewBox="0 0 24 24" className={SVG} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></Social>
              <Social href={settings.twitter} label="MASFIG on X"><svg viewBox="0 0 24 24" className={SVG} fill="currentColor" aria-hidden><path d="M17.8 3h3l-6.6 7.5L22 21h-6.1l-4.8-6.2L5.5 21h-3l7.1-8.1L2 3h6.2l4.3 5.7L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z" /></svg></Social>
            </div>
          )}
        </div>
        <nav aria-label="Explore">
          <p className="text-sm font-bold uppercase tracking-wider text-ink">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {EXPLORE.map((l) => <li key={l.href}><Link href={l.href} className="text-ink-soft transition-colors hover:text-primary">{l.label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label={data.services.title}>
          <p className="text-sm font-bold uppercase tracking-wider text-ink">{data.services.title}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICES.map((l) => <li key={l.label}><Link href={l.href} className="text-ink-soft transition-colors hover:text-primary">{l.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-ink">{data.contactColumnTitle}</p>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary" /><a href={telLink(settings.phone1)} className="hover:text-primary">{settings.phone1}</a></li>
            {settings.phone2 && <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary" /><a href={telLink(settings.phone2)} className="hover:text-primary">{settings.phone2}</a></li>}
            {settings.phone3 && <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary" /><a href={telLink(settings.phone3)} className="hover:text-primary">{settings.phone3}</a></li>}
            <li className="flex items-center gap-2.5"><MessageCircle className="h-4 w-4 text-primary" /><a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp</a></li>
            {settings.email && <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${settings.email}`} className="hover:text-primary">{settings.email}</a></li>}
            {settings.address && <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><span className="block text-xs font-semibold uppercase tracking-wide text-ink">Head office</span>{settings.address}</span></li>}
            {settings.branchAddress && <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><span className="block text-xs font-semibold uppercase tracking-wide text-ink">Branch office</span>{settings.branchAddress}</span></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-soft sm:flex-row">
          <p>&copy; {year} {settings.copyright}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL.map((l) => <li key={l.label}><Link href={l.href} className="hover:text-primary">{l.label}</Link></li>)}
            <li><Link href="/admin/login/" rel="nofollow" className="inline-flex items-center gap-1.5 font-medium hover:text-primary"><Lock className="h-3.5 w-3.5" />Admin login</Link></li>
          </ul>
        </div>
        <div className="container-x flex justify-center pb-6 empty:hidden"><DevCredit /></div>
      </div>
    </footer>
  )
}
