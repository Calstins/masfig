'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { StatsData } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { apiFetch } from '@/lib/api'

export default function AdminStats() {
  const [data, setData] = useState<StatsData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/stats').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/stats', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Stats saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const updateItem = (i: number, field: string, value: unknown) => {
    const items = [...data.items]; items[i] = {...items[i], [field]: value}; setData({...data, items})
  }
  const addItem = () => {
    setData({ ...data, items: [...data.items, { label: 'New Stat', value: 0, suffix: '+', icon: '⭐' }] })
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
      <PageHeader title="Stats Section" description="Animated number counters with labels." />

      <FormSection label="Section Header" badge="Header">
        <Field label="Badge"><Input value={data.header.badge} onChange={(e) => setData({...data, header: {...data.header, badge: e.target.value}})} /></Field>
        <Field label="Title"><Input value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} rows={2} /></Field>
      </FormSection>

      {data.items.map((item, i) => (
        <FormSection key={i} label={`Stat ${i + 1}: ${item.label}`} badge={`#${i + 1}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↑ Up</button>
              <button type="button" onClick={() => moveItem(i, 1)} disabled={i === data.items.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↓ Down</button>
            </div>
            <button type="button" onClick={() => removeItem(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Label"><Input value={item.label} onChange={(e) => updateItem(i, 'label', e.target.value)} /></Field>
            <Field label="Value (number)"><Input type="number" value={item.value} onChange={(e) => updateItem(i, 'value', Number(e.target.value))} /></Field>
            <Field label="Suffix"><Input value={item.suffix} onChange={(e) => updateItem(i, 'suffix', e.target.value)} /></Field>
            <Field label="Icon (emoji)"><Input value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} /></Field>
          </div>
        </FormSection>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Stat
        </button>
      </div>

      <FormSection label="Footer Note" badge="Bottom">
        <Field label="Note Text" hint="Shown at the bottom of the stats section; leave empty to hide">
          <Input value={data.footerNote || ''} onChange={(e) => setData({...data, footerNote: e.target.value})} />
        </Field>
      </FormSection>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
