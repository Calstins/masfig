'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { DeliveryProcessData } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { IconPicker } from '@/components/admin/icon-picker'
import { apiFetch } from '@/lib/api'

const iconOptions = ['Zap', 'Package', 'Truck', 'CheckCircle', 'MapPin', 'Clock', 'Shield']

export default function AdminDelivery() {
  const [data, setData] = useState<DeliveryProcessData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/delivery').then((r) => r.json()).then(setData)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/delivery', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Delivery process saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const updateStep = (i: number, field: string, value: unknown) => {
    const steps = [...data.steps]; steps[i] = {...steps[i], [field]: value}; setData({...data, steps})
  }
  const addStep = () => {
    setData({ ...data, steps: [...data.steps, { icon: 'Zap', title: 'New Step', description: '', details: [''] }] })
  }
  const removeStep = (i: number) => {
    setData({ ...data, steps: data.steps.filter((_, idx) => idx !== i) })
  }
  const moveStep = (i: number, dir: -1 | 1) => {
    const steps = [...data.steps]
    const j = i + dir
    if (j < 0 || j >= steps.length) return
    ;[steps[i], steps[j]] = [steps[j], steps[i]]
    setData({ ...data, steps })
  }

  const updateFeature = (i: number, field: string, value: string) => {
    const features = [...data.features]; features[i] = {...features[i], [field]: value}; setData({...data, features})
  }
  const addFeature = () => {
    setData({ ...data, features: [...data.features, { icon: 'Zap', title: 'New Feature', description: '' }] })
  }
  const removeFeature = (i: number) => {
    setData({ ...data, features: data.features.filter((_, idx) => idx !== i) })
  }
  const moveFeature = (i: number, dir: -1 | 1) => {
    const features = [...data.features]
    const j = i + dir
    if (j < 0 || j >= features.length) return
    ;[features[i], features[j]] = [features[j], features[i]]
    setData({ ...data, features })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader title="Delivery Process" description="Delivery pipeline steps and service features." />

      <FormSection label="Section Header" badge="Header">
        <Field label="Badge"><Input value={data.header.badge} onChange={(e) => setData({...data, header: {...data.header, badge: e.target.value}})} /></Field>
        <Field label="Title"><Input value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} rows={2} /></Field>
      </FormSection>

      {data.steps.map((step, i) => (
        <FormSection key={i} label={`Step ${i + 1}: ${step.title}`} badge={`#${i + 1}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↑ Up</button>
              <button type="button" onClick={() => moveStep(i, 1)} disabled={i === data.steps.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-30">↓ Down</button>
            </div>
            <button type="button" onClick={() => removeStep(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title"><Input value={step.title} onChange={(e) => updateStep(i, 'title', e.target.value)} /></Field>
            <Field label="Icon">
              <IconPicker value={step.icon} onChange={(v) => updateStep(i, 'icon', v)} options={iconOptions} />
            </Field>
          </div>
          <Field label="Description"><Input value={step.description} onChange={(e) => updateStep(i, 'description', e.target.value)} /></Field>
          <Field label="Detail Points">
            <div className="space-y-2">
              {step.details.map((detail, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={detail} onChange={(e) => {const s = [...data.steps]; s[i].details[j] = e.target.value; setData({...data, steps: s})}} />
                  <button
                    type="button"
                    onClick={() => {const s = [...data.steps]; s[i].details = s[i].details.filter((_, dj) => dj !== j); setData({...data, steps: s})}}
                    className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {const s = [...data.steps]; s[i].details = [...s[i].details, '']; setData({...data, steps: s})}}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Detail
              </button>
            </div>
          </Field>
        </FormSection>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={addStep} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Step
        </button>
      </div>

      <FormSection label="Service Features" badge="Features">
        {data.features.map((feat, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature {i + 1}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveFeature(i, -1)} disabled={i === 0} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveFeature(i, 1)} disabled={i === data.features.length - 1} className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white disabled:opacity-30">↓</button>
                <button type="button" onClick={() => removeFeature(i)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-100 text-red-500 text-xs hover:bg-red-50">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"><Input value={feat.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} /></Field>
              <Field label="Icon">
                <IconPicker value={feat.icon} onChange={(v) => updateFeature(i, 'icon', v)} options={iconOptions} />
              </Field>
            </div>
            <Field label="Description"><Textarea value={feat.description} onChange={(e) => updateFeature(i, 'description', e.target.value)} rows={2} /></Field>
          </div>
        ))}
        <button type="button" onClick={addFeature} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </FormSection>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
