'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { EquipmentShowcaseData, ShowcaseItem } from '@/lib/types'
import { FormSection, Field, Input, Textarea, Select, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { apiFetch } from '@/lib/api'

export default function AdminShowcase() {
  const [data, setData] = useState<EquipmentShowcaseData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/showcase').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/showcase', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Showcase saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const categoryOptions = data.categories.map((c) => ({ value: c.id, label: c.name }))

  const updateCategory = (i: number, field: string, value: string) => {
    const categories = [...data.categories]; categories[i] = {...categories[i], [field]: value}; setData({...data, categories})
  }

  const addItem = () => {
    const id = `item-${Date.now()}`
    const item: ShowcaseItem = {
      id, name: 'New Equipment', category: 'bakery', image: '/equipment/placeholder.jpg',
      description: '', specs: [''], features: [''], capacity: '', power: '', badge: '',
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
      <PageHeader title="Equipment Showcase" description="Product catalog with filterable categories." />

      <FormSection label="Section Header" badge="Header">
        <Field label="Badge"><Input value={data.header.badge} onChange={(e) => setData({...data, header: {...data.header, badge: e.target.value}})} /></Field>
        <Field label="Title"><Input value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} rows={2} /></Field>
      </FormSection>

      <FormSection label="Categories" badge="Filters">
        {data.categories.filter((c) => c.id !== 'all').map((cat, i) => (
          <div key={cat.id} className="flex gap-2">
            <Input value={cat.name} onChange={(e) => updateCategory(i + 1, 'name', e.target.value)} placeholder="Category name" />
            <button
              type="button"
              onClick={() => setData({ ...data, categories: data.categories.filter((_, idx) => idx !== i + 1) })}
              className="px-3 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setData({ ...data, categories: [...data.categories, { id: `cat-${Date.now()}`, name: 'New Category' }] })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </FormSection>

      <FormSection label="Item Button" badge="Card">
        <Field label="Button Label" hint="Shown on each equipment card">
          <Input value={data.detailsLabel} onChange={(e) => setData({...data, detailsLabel: e.target.value})} />
        </Field>
      </FormSection>

      <FormSection label="Bottom CTA" badge="Banner">
        <Field label="Description"><Textarea value={data.bottomCta.description} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, description: e.target.value}})} rows={2} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Button Text"><Input value={data.bottomCta.buttonText} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, buttonText: e.target.value}})} /></Field>
          <Field label="Button Link"><Input value={data.bottomCta.buttonHref} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, buttonHref: e.target.value}})} /></Field>
        </div>
      </FormSection>

      {data.items.map((item, i) => (
        <FormSection key={item.id} label={`Equipment ${i + 1}: ${item.name}`} badge={item.category}>
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
            <Field label="Name"><Input value={item.name} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], name: e.target.value}; setData({...data, items: u})}} /></Field>
            <Field label="Category">
              <Select value={item.category} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], category: e.target.value}; setData({...data, items: u})}}>
                {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Image Path" hint="Path relative to /public"><Input value={item.image} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], image: e.target.value}; setData({...data, items: u})}} /></Field>
            <Field label="Badge Label"><Input value={item.badge} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], badge: e.target.value}; setData({...data, items: u})}} /></Field>
          </div>
          <Field label="Description"><Textarea value={item.description} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], description: e.target.value}; setData({...data, items: u})}} rows={2} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Capacity"><Input value={item.capacity} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], capacity: e.target.value}; setData({...data, items: u})}} /></Field>
            <Field label="Power"><Input value={item.power} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], power: e.target.value}; setData({...data, items: u})}} /></Field>
          </div>
          <Field label="Specs">
            <div className="space-y-2">
              {item.specs.map((spec, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={spec} onChange={(e) => {const u = [...data.items]; u[i].specs[j] = e.target.value; setData({...data, items: u})}} />
                  <button type="button" onClick={() => {const u = [...data.items]; u[i].specs = u[i].specs.filter((_, sj) => sj !== j); setData({...data, items: u})}} className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => {const u = [...data.items]; u[i].specs = [...u[i].specs, '']; setData({...data, items: u})}} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Spec
              </button>
            </div>
          </Field>
          <Field label="Features">
            <div className="space-y-2">
              {item.features.map((feat, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={feat} onChange={(e) => {const u = [...data.items]; u[i].features[j] = e.target.value; setData({...data, items: u})}} />
                  <button type="button" onClick={() => {const u = [...data.items]; u[i].features = u[i].features.filter((_, fj) => fj !== j); setData({...data, items: u})}} className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => {const u = [...data.items]; u[i].features = [...u[i].features, '']; setData({...data, items: u})}} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Feature
              </button>
            </div>
          </Field>
        </FormSection>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Equipment
        </button>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
