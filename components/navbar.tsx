'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { telLink, whatsappLink } from '@/lib/site'
import { track } from '@/lib/track'

const LINKS = [
  { label: 'Products', href: '/products/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Delivery', href: '/delivery-and-installation/' },
  { label: 'Contact', href: '/contact/' },
]

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const wa = whatsappLink(settings.whatsapp, 'Hello MASFIG, I would like a quote for equipment.')
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(35,31,32,.08)]' : 'bg-white/60 backdrop-blur-sm'}`}>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label={`${settings.siteName} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-full.png" alt={settings.siteName} width={1260} height={300} className="h-11 sm:h-14 w-auto object-contain" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group relative text-sm font-medium text-ink-soft transition-colors hover:text-primary">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href={telLink(settings.phone1)} onClick={() => track('call_click', { location: 'navbar' })} className="btn-outline !px-4 !py-2"><Phone className="h-4 w-4" />{settings.callLabel || 'Call'}</a>
          <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { location: 'navbar' })} className="btn-primary !px-4 !py-2"><MessageCircle className="h-4 w-4" />{settings.whatsappLabel || 'WhatsApp'}</a>
        </div>
        <button className="rounded-lg p-2 text-ink md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div className={`grid overflow-hidden border-t border-border bg-white transition-[grid-template-rows] duration-300 md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] border-transparent'}`}>
        <div className="min-h-0">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile">
            {LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium text-ink hover:bg-surface">{l.label}</Link>)}
            <div className="mt-2 flex gap-3">
              <a href={telLink(settings.phone1)} className="btn-outline flex-1"><Phone className="h-4 w-4" />Call</a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
