'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { FooterData } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { apiFetch } from '@/lib/api'

type ListKey = 'quickLinks' | 'services' | 'footerLinks'

function withList(data: FooterData, list: ListKey, links: FooterData['footerLinks']): FooterData {
  if (list === 'footerLinks') return { ...data, footerLinks: links }
  return { ...data, [list]: { ...data[list], links } } as FooterData
}

function updateLink(data: FooterData, list: ListKey, i: number, field: string, value: string): FooterData {
  const links = (list === 'footerLinks' ? data.footerLinks : data[list].links).map((link, idx) =>
    idx === i ? { ...link, [field]: value } : link
  )
  return withList(data, list, links)
}

function addLink(data: FooterData, list: ListKey): FooterData {
  const links = [...(list === 'footerLinks' ? data.footerLinks : data[list].links), { label: 'New Link', href: '#' }]
  return withList(data, list, links)
}

function removeLink(data: FooterData, list: ListKey, i: number): FooterData {
  const links = (list === 'footerLinks' ? data.footerLinks : data[list].links).filter((_, idx) => idx !== i)
  return withList(data, list, links)
}

function moveLink(data: FooterData, list: ListKey, i: number, dir: -1 | 1): FooterData {
  const links = [...(list === 'footerLinks' ? data.footerLinks : data[list].links)]
  const j = i + dir
  if (j < 0 || j >= links.length) return data
  ;[links[i], links[j]] = [links[j], links[i]]
  return withList(data, list, links)
}

function LinkListEditor({
  title, badge, list, data, setData,
}: {
  title: string
  badge: string
  list: ListKey
  data: FooterData
  setData: (d: FooterData) => void
}) {
  const links = list === 'footerLinks' ? data.footerLinks : data[list].links
  const showTitleField = list !== 'footerLinks'
  return (
    <FormSection label={title} badge={badge}>
      {showTitleField && (
        <Field label="Section Title">
          <Input value={data[list].title} onChange={(e) => setData({...data, [list]: {...data[list], title: e.target.value}})} />
        </Field>
      )}
      {links.map((link, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex gap-2">
            <Input value={link.label} onChange={(e) => setData(updateLink(data, list, i, 'label', e.target.value))} placeholder="Label" />
            <Input value={link.href} onChange={(e) => setData(updateLink(data, list, i, 'href', e.target.value))} placeholder="href" className="font-mono text-xs" />
            <button type="button" onClick={() => setData(removeLink(data, list, i))} className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => setData(moveLink(data, list, i, -1))} disabled={i === 0} className="px-2 py-0.5 rounded border border-gray-200 text-gray-400 text-[11px] hover:bg-gray-50 disabled:opacity-30">↑</button>
            <button type="button" onClick={() => setData(moveLink(data, list, i, 1))} disabled={i === links.length - 1} className="px-2 py-0.5 rounded border border-gray-200 text-gray-400 text-[11px] hover:bg-gray-50 disabled:opacity-30">↓</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setData(addLink(data, list))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
        <Plus className="w-4 h-4" /> Add Link
      </button>
    </FormSection>
  )
}

export default function AdminFooter() {
  const [data, setData] = useState<FooterData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/footer').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/footer', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Footer saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader title="Footer" description="CTA section, quick links, and bottom navigation." />

      <FormSection label="CTA Section" badge="Top">
        <Field label="Heading"><Input value={data.cta.heading} onChange={(e) => setData({...data, cta: {...data.cta, heading: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.cta.description} onChange={(e) => setData({...data, cta: {...data.cta, description: e.target.value}})} rows={2} /></Field>
      </FormSection>

      <FormSection label="Contact Area" badge="Labels">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Phone Card 1 Label"><Input value={data.contactLabels.callLabel} onChange={(e) => setData({...data, contactLabels: {...data.contactLabels, callLabel: e.target.value}})} /></Field>
          <Field label="Phone Card 2 Label"><Input value={data.contactLabels.altLabel} onChange={(e) => setData({...data, contactLabels: {...data.contactLabels, altLabel: e.target.value}})} /></Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="WhatsApp Tagline"><Input value={data.contactLabels.whatsappTagline} onChange={(e) => setData({...data, contactLabels: {...data.contactLabels, whatsappTagline: e.target.value}})} /></Field>
          <Field label="WhatsApp Title"><Input value={data.contactLabels.whatsappTitle} onChange={(e) => setData({...data, contactLabels: {...data.contactLabels, whatsappTitle: e.target.value}})} /></Field>
          <Field label="WhatsApp Subtitle"><Input value={data.contactLabels.whatsappSubtitle} onChange={(e) => setData({...data, contactLabels: {...data.contactLabels, whatsappSubtitle: e.target.value}})} /></Field>
        </div>
        <Field label="Contact Column Title" hint="Heading of the footer contact column">
          <Input value={data.contactColumnTitle} onChange={(e) => setData({...data, contactColumnTitle: e.target.value})} />
        </Field>
      </FormSection>

      <FormSection label="Brand" badge="About">
        <Field label="Tagline"><Textarea value={data.brand.tagline} onChange={(e) => setData({...data, brand: {...data.brand, tagline: e.target.value}})} rows={2} /></Field>
      </FormSection>

      <LinkListEditor title="Quick Links" badge="Navigation" list="quickLinks" data={data} setData={setData} />
      <LinkListEditor title="Services Links" badge="Navigation" list="services" data={data} setData={setData} />
      <LinkListEditor title="Bottom Footer Links" badge="Legal" list="footerLinks" data={data} setData={setData} />

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
