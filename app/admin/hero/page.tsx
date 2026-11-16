'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { HeroData } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { apiFetch } from '@/lib/api'

export default function AdminHero() {
  const [data, setData] = useState<HeroData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/hero').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/hero', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Hero section saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const updateBadge = (i: number, field: string, value: string) => {
    const trustBadges = [...data.trustBadges]; trustBadges[i] = {...trustBadges[i], [field]: value}; setData({...data, trustBadges})
  }
  const addTrustBadge = () => {
    setData({ ...data, trustBadges: [...data.trustBadges, { label: '', value: '', subtext: '' }] })
  }
  const removeTrustBadge = (i: number) => {
    setData({ ...data, trustBadges: data.trustBadges.filter((_, idx) => idx !== i) })
  }
  const moveTrustBadge = (i: number, dir: -1 | 1) => {
    const trustBadges = [...data.trustBadges]
    const j = i + dir
    if (j < 0 || j >= trustBadges.length) return
    ;[trustBadges[i], trustBadges[j]] = [trustBadges[j], trustBadges[i]]
    setData({ ...data, trustBadges })
  }

  const updateCard = (i: number, field: string, value: string) => {
    const floatingCards = [...data.floatingCards]; floatingCards[i] = {...floatingCards[i], [field]: value}; setData({...data, floatingCards})
  }
  const addCard = () => {
    setData({ ...data, floatingCards: [...data.floatingCards, { image: '', value: '', label: '', subtext: '' }] })
  }
  const removeCard = (i: number) => {
    setData({ ...data, floatingCards: data.floatingCards.filter((_, idx) => idx !== i) })
  }
  const moveCard = (i: number, dir: -1 | 1) => {
    const floatingCards = [...data.floatingCards]
    const j = i + dir
    if (j < 0 || j >= floatingCards.length) return
    ;[floatingCards[i], floatingCards[j]] = [floatingCards[j], floatingCards[i]]
    setData({ ...data, floatingCards })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader title="Hero Section" description="The main banner — first thing visitors see." />

      <FormSection label="Main Content" badge="Hero">
        <Field label="Badge Text"><Input value={data.badge} onChange={(e) => setData({...data, badge: e.target.value})} /></Field>
        <Field label="Heading"><Textarea value={data.heading} onChange={(e) => setData({...data, heading: e.target.value})} rows={2} /></Field>
        <Field label="Description"><Textarea value={data.description} onChange={(e) => setData({...data, description: e.target.value})} rows={3} /></Field>
      </FormSection>

      <FormSection label="Call-to-Action Buttons" badge="CTA">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Primary CTA Text"><Input value={data.ctaPrimary.text} onChange={(e) => setData({...data, ctaPrimary: {...data.ctaPrimary, text: e.target.value}})} /></Field>
          <Field label="Primary CTA Link"><Input value={data.ctaPrimary.href} onChange={(e) => setData({...data, ctaPrimary: {...data.ctaPrimary, href: e.target.value}})} /></Field>
          <Field label="Secondary CTA Text"><Input value={data.ctaSecondary.text} onChange={(e) => setData({...data, ctaSecondary: {...data.ctaSecondary, text: e.target.value}})} /></Field>
          <Field label="Secondary CTA Link"><Input value={data.ctaSecondary.href} onChange={(e) => setData({...data, ctaSecondary: {...data.ctaSecondary, href: e.target.value}})} /></Field>
        </div>
      </FormSection>

      <FormSection label="Visual Panel" badge="Right Image">
        <p className="text-xs text-gray-400 -mt-2">The large showcase image on the right side of the hero (desktop only).</p>
        <Field label="Main Image Path"><Input value={data.visual.image} onChange={(e) => setData({...data, visual: {...data.visual, image: e.target.value}})} className="font-mono text-xs" /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Corner Badge Text" hint="Leave empty to hide">
            <Input value={data.visual.badge ?? ''} onChange={(e) => setData({...data, visual: {...data.visual, badge: e.target.value}})} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Chip Value" hint="e.g. 500+">
              <Input value={data.visual.chipValue ?? ''} onChange={(e) => setData({...data, visual: {...data.visual, chipValue: e.target.value}})} />
            </Field>
            <Field label="Chip Label" hint="e.g. Installations">
              <Input value={data.visual.chipLabel ?? ''} onChange={(e) => setData({...data, visual: {...data.visual, chipLabel: e.target.value}})} />
            </Field>
          </div>
        </div>
        <Field label="Caption Label" hint="Small mono text at bottom of panel">
          <Input value={data.visual.label} onChange={(e) => setData({...data, visual: {...data.visual, label: e.target.value}})} />
        </Field>
        <Field label="Caption Title">
          <Input value={data.visual.title} onChange={(e) => setData({...data, visual: {...data.visual, title: e.target.value}})} />
        </Field>
      </FormSection>

      <FormSection label="Floating Cards" badge="Overlays">
        <p className="text-xs text-gray-400 -mt-2">Small overlay cards on the hero panel. Cards with an image show a thumbnail; cards with only a value show a stat badge.</p>
        {data.floatingCards.map((card, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Card {i + 1}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveCard(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveCard(i, 1)} disabled={i === data.floatingCards.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white disabled:opacity-30">↓</button>
                <button type="button" onClick={() => removeCard(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Image Path" hint="If set, shows thumbnail card">
                <Input value={card.image ?? ''} onChange={(e) => updateCard(i, 'image', e.target.value)} className="font-mono text-xs" placeholder="/equipment/fryer.jpg" />
              </Field>
              <Field label="Value (stat badge)" hint="Used when no image, e.g. 98%">
                <Input value={card.value ?? ''} onChange={(e) => updateCard(i, 'value', e.target.value)} placeholder="98%" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Title / Label">
                <Input value={card.label} onChange={(e) => updateCard(i, 'label', e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <Input value={card.subtext ?? ''} onChange={(e) => updateCard(i, 'subtext', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" onClick={addCard} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </FormSection>

      <FormSection label="Trust Badges" badge="Social Proof">
        {data.trustBadges.map((badge, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge {i + 1}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveTrustBadge(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveTrustBadge(i, 1)} disabled={i === data.trustBadges.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white disabled:opacity-30">↓</button>
                <button type="button" onClick={() => removeTrustBadge(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Label"><Input value={badge.label} onChange={(e) => updateBadge(i, 'label', e.target.value)} /></Field>
              <Field label="Value"><Input value={badge.value} onChange={(e) => updateBadge(i, 'value', e.target.value)} /></Field>
              <Field label="Subtext"><Input value={badge.subtext} onChange={(e) => updateBadge(i, 'subtext', e.target.value)} /></Field>
            </div>
          </div>
        ))}
        <button type="button" onClick={addTrustBadge} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Badge
        </button>
      </FormSection>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
