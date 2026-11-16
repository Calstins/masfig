'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { EquipmentGridData, EquipmentGridItem } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { IconPicker } from '@/components/admin/icon-picker'
import { apiFetch } from '@/lib/api'

const iconOptions = ['UtensilsCrossed', 'Flame', 'ChefHat', 'Loader', 'Package', 'Zap']

export default function AdminEquipmentGrid() {
  const [data, setData] = useState<EquipmentGridData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/equipment-grid').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/equipment-grid', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Equipment grid saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const updateItem = (i: number, field: string, value: unknown) => {
    const items = [...data.items]; items[i] = {...items[i], [field]: value}; setData({...data, items})
  }

  const addItem = () => {
    const id = Math.max(0, ...data.items.map((it) => it.id)) + 1
    const item: EquipmentGridItem = {
      id, title: 'New Item', description: '', icon: 'Zap',
      accent: 'from-primary to-primary', gradient: 'from-primary/20 to-transparent',
      stats: ['', ''], features: ['', '', ''],
    }
    setData({ ...data, items: [...data.items, item] })
  }

  const removeItem = (i: number) => {
    setData({ ...data, items: data.items.filter((_, idx) => idx !== i) })
  }

  const moveItem = (i: number, dir: -1 | 1) => {
    const items = [...data.items]
    const j = i + dir
    if (j < 0 || j >= items.length) return
    ;[items[i], items[j]] = [items[j], items[i]]
    setData({ ...data, items })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader title="Equipment Grid" description="Six category cards displayed in a bento grid layout." />

      <FormSection label="Section Header" badge="Header">
        <Field label="Badge"><Input value={data.header.badge} onChange={(e) => setData({...data, header: {...data.header, badge: e.target.value}})} /></Field>
        <Field label="Title"><Input value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} /></Field>
        <Field label="Gradient Title"><Input value={data.header.titleGradient} onChange={(e) => setData({...data, header: {...data.header, titleGradient: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} rows={3} /></Field>
      </FormSection>

      <FormSection label="CTA Buttons" badge="CTA">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Primary Text"><Input value={data.cta.primary.text} onChange={(e) => setData({...data, cta: {...data.cta, primary: {...data.cta.primary, text: e.target.value}}})} /></Field>
          <Field label="Primary Link"><Input value={data.cta.primary.href} onChange={(e) => setData({...data, cta: {...data.cta, primary: {...data.cta.primary, href: e.target.value}}})} /></Field>
          <Field label="Secondary Text"><Input value={data.cta.secondary.text} onChange={(e) => setData({...data, cta: {...data.cta, secondary: {...data.cta.secondary, text: e.target.value}}})} /></Field>
          <Field label="Secondary Link"><Input value={data.cta.secondary.href} onChange={(e) => setData({...data, cta: {...data.cta, secondary: {...data.cta.secondary, href: e.target.value}}})} /></Field>
        </div>
      </FormSection>

      <FormSection label="Bottom CTA" badge="Banner">
        <Field label="Heading"><Input value={data.bottomCta.heading} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, heading: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.bottomCta.description} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, description: e.target.value}})} rows={2} /></Field>
      </FormSection>

      {data.items.map((item, i) => (
        <FormSection key={item.id} label={`Item ${i + 1}: ${item.title}`} badge={`#${item.id}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↑ Up</button>
              <button type="button" onClick={() => moveItem(i, 1)} disabled={i === data.items.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↓ Down</button>
            </div>
            <button type="button" onClick={() => removeItem(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title"><Input value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} /></Field>
          <Field label="Icon">
            <IconPicker value={item.icon} onChange={(v) => updateItem(i, 'icon', v)} options={iconOptions} />
          </Field>
        </div>
          <Field label="Description"><Textarea value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} rows={2} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Accent Gradient" hint="e.g. from-primary to-red-500"><Input value={item.accent} onChange={(e) => updateItem(i, 'accent', e.target.value)} /></Field>
            <Field label="Background Gradient" hint="e.g. from-primary  to-transparent"><Input value={item.gradient} onChange={(e) => updateItem(i, 'gradient', e.target.value)} /></Field>
          </div>
          <Field label="Stats (hover)">
            <div className="space-y-2">
              {item.stats.map((stat, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={stat} onChange={(e) => {
                    const items = [...data.items]; items[i].stats[j] = e.target.value; setData({...data, items})
                  }} placeholder={`Stat ${j + 1}`} />
                  <button type="button" onClick={() => {
                    const items = [...data.items]; items[i].stats = items[i].stats.filter((_, sj) => sj !== j); setData({...data, items})
                  }} className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const items = [...data.items]; items[i].stats = [...items[i].stats, '']; setData({...data, items})
              }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            </div>
          </Field>
          <Field label="Features">
            <div className="space-y-2">
              {item.features.map((feat, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={feat} onChange={(e) => {
                    const items = [...data.items]; items[i].features[j] = e.target.value; setData({...data, items})
                  }} placeholder={`Feature ${j + 1}`} />
                  <button type="button" onClick={() => {
                    const items = [...data.items]; items[i].features = items[i].features.filter((_, fj) => fj !== j); setData({...data, items})
                  }} className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => {
                const items = [...data.items]; items[i].features = [...items[i].features, '']; setData({...data, items})
              }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Feature
              </button>
            </div>
          </Field>
        </FormSection>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
