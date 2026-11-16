'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { apiFetch } from '@/lib/api'

export default function AdminSettings() {
  const [data, setData] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/settings').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const res = await apiFetch('/sections/settings', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Settings saved successfully' : 'Error saving settings')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const updateNavLink = (i: number, field: string, value: string) => {
    const navLinks = [...data.navLinks]; navLinks[i] = {...navLinks[i], [field]: value}; setData({...data, navLinks})
  }
  const addNavLink = () => {
    setData({ ...data, navLinks: [...data.navLinks, { label: 'New Link', href: '#' }] })
  }
  const removeNavLink = (i: number) => {
    setData({ ...data, navLinks: data.navLinks.filter((_, idx) => idx !== i) })
  }
  const moveNavLink = (i: number, dir: -1 | 1) => {
    const navLinks = [...data.navLinks]
    const j = i + dir
    if (j < 0 || j >= navLinks.length) return
    ;[navLinks[i], navLinks[j]] = [navLinks[j], navLinks[i]]
    setData({ ...data, navLinks })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader title="Site Settings" description="Manage your site name, branding, contact information, and metadata." />

      <FormSection label="Branding" badge="Logo">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex-1">
            <Field label="Logo Path" hint="Path relative to /public or full URL from Media Library">
              <Input value={data.logo} onChange={(e) => setData({...data, logo: e.target.value})} placeholder="/logo-main.png" className="font-mono text-xs" />
            </Field>
          </div>
        </div>
        <Field label="Site Name"><Input value={data.siteName} onChange={(e) => setData({...data, siteName: e.target.value})} /></Field>
        <Field label="Tagline"><Input value={data.tagline} onChange={(e) => setData({...data, tagline: e.target.value})} /></Field>
      </FormSection>

      <FormSection label="Navbar Links" badge="Navigation">
        {data.navLinks.map((link, i) => (
          <div key={i} className="space-y-2">
            <div className="flex gap-2">
              <Input value={link.label} onChange={(e) => updateNavLink(i, 'label', e.target.value)} placeholder="Label" />
              <Input value={link.href} onChange={(e) => updateNavLink(i, 'href', e.target.value)} placeholder="#section" className="font-mono text-xs" />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveNavLink(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↑ Up</button>
              <button type="button" onClick={() => moveNavLink(i, 1)} disabled={i === data.navLinks.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↓ Down</button>
              <button type="button" onClick={() => removeNavLink(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50 ml-auto">
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addNavLink} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </FormSection>

      <FormSection label="SEO" badge="Metadata">
        <Field label="Meta Title" hint="Shown in browser tabs and search results"><Input value={data.metaTitle} onChange={(e) => setData({...data, metaTitle: e.target.value})} /></Field>
        <Field label="Meta Description" hint="Appears in search engine results"><Textarea value={data.metaDescription} onChange={(e) => setData({...data, metaDescription: e.target.value})} rows={3} /></Field>
      </FormSection>

      <FormSection label="Contact Info" badge="Phone">
        <Field label="Phone 1 (Primary)"><Input value={data.phone1} onChange={(e) => setData({...data, phone1: e.target.value})} /></Field>
        <Field label="Phone 2 (Alternative)"><Input value={data.phone2} onChange={(e) => setData({...data, phone2: e.target.value})} /></Field>
        <Field label="Email" hint="Shown on the contact page and in search results data. Leave blank until confirmed."><Input type="email" value={data.email ?? ''} onChange={(e) => setData({...data, email: e.target.value})} /></Field>
        <Field label="Business address" hint="Full street address. Adds local-business data for Google only when filled in. Must match the Google Business Profile exactly."><Textarea rows={2} value={data.address ?? ''} onChange={(e) => setData({...data, address: e.target.value})} /></Field>
        <Field label="Opening hours" hint="Schema format, e.g. Mo-Sa 08:00-18:00. Leave blank until confirmed."><Input value={data.hours ?? ''} onChange={(e) => setData({...data, hours: e.target.value})} /></Field>
        <Field label="Phone 3 (Alternative)"><Input value={data.phone3 ?? ''} onChange={(e) => setData({...data, phone3: e.target.value})} /></Field>
        <Field label="Branch office address" hint="Second office from the catalogue. Shown in the footer and on the contact page."><Textarea rows={2} value={data.branchAddress ?? ''} onChange={(e) => setData({...data, branchAddress: e.target.value})} /></Field>
        <Field label="WhatsApp Number" hint="Without + prefix, numbers only"><Input value={data.whatsapp} onChange={(e) => setData({...data, whatsapp: e.target.value})} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Call Button Label" hint="Navbar call button text"><Input value={data.callLabel || ''} onChange={(e) => setData({...data, callLabel: e.target.value})} /></Field>
          <Field label="WhatsApp Button Label" hint="Navbar WhatsApp button text"><Input value={data.whatsappLabel || ''} onChange={(e) => setData({...data, whatsappLabel: e.target.value})} /></Field>
        </div>
      </FormSection>

      <FormSection label="Social profiles" badge="Social">
        <Field label="Instagram URL"><Input value={data.instagram ?? ''} onChange={(e) => setData({...data, instagram: e.target.value})} placeholder="https://instagram.com/masfigltd" /></Field>
        <Field label="Facebook URL" hint="For the live Facebook feed, connect the page under Facebook feed."><Input value={data.facebook ?? ''} onChange={(e) => setData({...data, facebook: e.target.value})} placeholder="https://facebook.com/masfig" /></Field>
        <Field label="X (Twitter) URL"><Input value={data.twitter ?? ''} onChange={(e) => setData({...data, twitter: e.target.value})} placeholder="https://x.com/masfigltd" /></Field>
      </FormSection>

      <FormSection label="Price display" badge="Products">
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input type="checkbox" className="mt-1" checked={!!data.showPrices} onChange={(e) => setData({...data, showPrices: e.target.checked})} />
          <span>Show prices on the website for products set to “Show a price”.<br /><span className="text-xs text-gray-400">Default is OFF: every product shows “Request a quote” and no price is published anywhere, including the site data. Each product also has its own price setting.</span></span>
        </label>
      </FormSection>

      <FormSection label="Footer Copyright" badge="Footer">
        <Field label="Copyright Text" hint="Year is auto-set to current date"><Input value={data.copyright} onChange={(e) => setData({...data, copyright: e.target.value})} /></Field>
      </FormSection>

      <div className="flex items-center gap-4 pt-2">
        <FormSection label="Unverified claims" badge="Trust">
        <label className="flex items-start gap-3 text-sm text-gray-700">
          <input type="checkbox" className="mt-1" checked={!!data.showUnverifiedClaims} onChange={(e) => setData({...data, showUnverifiedClaims: e.target.checked})} />
          <span>Show figures and guarantees on the public site (installation counts, uptime, client numbers, case-study results, delivery times, damage protection).<br /><span className="text-xs text-gray-400">Leave OFF until MASFIG has evidence for every number. Unproven claims can damage trust and break advertising rules.</span></span>
        </label>
      </FormSection>
      <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
