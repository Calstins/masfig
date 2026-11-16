'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { ProjectsData, Project } from '@/lib/types'
import { FormSection, Field, Input, Textarea, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { apiFetch } from '@/lib/api'
import { MediaPicker, btn } from '@/components/admin/ui'

const EMPTY: ProjectsData = {
  header: { badge: 'OUR PROJECTS', title: 'Businesses we have equipped', description: 'Projects delivered by MASFIG LTD and what our clients say.' },
  labels: { achievement: 'RESULT', equipmentDeployed: 'EQUIPMENT SUPPLIED' },
  items: [],
  bottomCta: { heading: 'Planning your own project?', description: 'Tell us what you need and we will prepare a quotation.', buttonText: 'Request a quote', buttonHref: '/contact/' },
}

export default function AdminProjects() {
  const [pickFor, setPickFor] = useState<number | null>(null)
  const [data, setData] = useState<ProjectsData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch('/sections/projects')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d && Array.isArray(d.items) ? d : EMPTY))
      .catch(() => setData(EMPTY))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/sections/projects', {
      method: 'POST', body: JSON.stringify(data),
    })
    setMessage(res.ok ? 'Projects saved' : 'Error saving')
    setSaving(false)
  }

  if (!data) return <div className="text-gray-400 animate-pulse">Loading...</div>

  const addItem = () => {
    const id = `project-${Date.now()}`
    const project: Project = {
      id, client: 'New Client', title: 'Project Title', category: 'General', image: '',
      metrics: [{ label: '', value: '' }], testimonial: '', author: '', role: '', result: '', equipment: [''],
    }
    setData({ ...data, items: [...data.items, project] })
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
      <PageHeader title="Projects" description="Client projects and testimonials, shown as a slider on the home page once at least one project is saved. Only add real projects and quotes you have permission to publish." />
      {pickFor !== null && <MediaPicker onClose={() => setPickFor(null)} onPick={(m) => { const u = [...data.items]; u[pickFor] = { ...u[pickFor], image: m.url }; setData({ ...data, items: u }); setPickFor(null) }} />}

      <FormSection label="Section Header" badge="Header">
        <Field label="Badge"><Input value={data.header.badge} onChange={(e) => setData({...data, header: {...data.header, badge: e.target.value}})} /></Field>
        <Field label="Title"><Input value={data.header.title} onChange={(e) => setData({...data, header: {...data.header, title: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.header.description} onChange={(e) => setData({...data, header: {...data.header, description: e.target.value}})} rows={2} /></Field>
      </FormSection>

      <FormSection label="Card Labels" badge="Labels">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Achievement Label" hint="Shown above each project's key result">
            <Input value={data.labels.achievement} onChange={(e) => setData({...data, labels: {...data.labels, achievement: e.target.value}})} />
          </Field>
          <Field label="Equipment Label" hint="Heading of the equipment list per project">
            <Input value={data.labels.equipmentDeployed} onChange={(e) => setData({...data, labels: {...data.labels, equipmentDeployed: e.target.value}})} />
          </Field>
        </div>
      </FormSection>

      <FormSection label="Bottom CTA" badge="Banner">
        <Field label="Heading"><Input value={data.bottomCta.heading} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, heading: e.target.value}})} /></Field>
        <Field label="Description"><Textarea value={data.bottomCta.description} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, description: e.target.value}})} rows={2} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Button Text"><Input value={data.bottomCta.buttonText} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, buttonText: e.target.value}})} /></Field>
          <Field label="Button Link"><Input value={data.bottomCta.buttonHref} onChange={(e) => setData({...data, bottomCta: {...data.bottomCta, buttonHref: e.target.value}})} /></Field>
        </div>
      </FormSection>

      {data.items.map((project, i) => (
        <FormSection key={project.id} label={`Project ${i + 1}: ${project.client}`} badge={project.category}>
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
            <Field label="Client Name"><Input value={project.client} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], client: e.target.value}; setData({...data, items: u})}} /></Field>
            <Field label="Category"><Input value={project.category} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], category: e.target.value}; setData({...data, items: u})}} /></Field>
          </div>
          <Field label="Project Title"><Input value={project.title} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], title: e.target.value}; setData({...data, items: u})}} /></Field>
          <Field label="Project image">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {project.image && <img src={project.image} alt="" className="h-16 w-24 rounded-lg object-cover border border-gray-200" />}
              <button type="button" className={btn} onClick={() => setPickFor(i)}>{project.image ? 'Change image' : 'Choose image'}</button>
            </div>
          </Field>
          <Field label="Testimonial"><Textarea value={project.testimonial} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], testimonial: e.target.value}; setData({...data, items: u})}} rows={3} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Author Name"><Input value={project.author} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], author: e.target.value}; setData({...data, items: u})}} /></Field>
            <Field label="Author Role"><Input value={project.role} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], role: e.target.value}; setData({...data, items: u})}} /></Field>
          </div>
          <Field label="Key Result/Achievement"><Textarea value={project.result} onChange={(e) => {const u = [...data.items]; u[i] = {...u[i], result: e.target.value}; setData({...data, items: u})}} rows={2} /></Field>
          <Field label="Metrics (label / value)">
            {project.metrics.map((metric, j) => (
              <div key={j} className="flex gap-2 mb-2">
                <Input value={metric.label} onChange={(e) => {const u = [...data.items]; u[i].metrics[j] = {...u[i].metrics[j], label: e.target.value}; setData({...data, items: u})}} placeholder="Label" />
                <Input value={metric.value} onChange={(e) => {const u = [...data.items]; u[i].metrics[j] = {...u[i].metrics[j], value: e.target.value}; setData({...data, items: u})}} placeholder="Value" className="w-40" />
                <button
                  type="button"
                  onClick={() => {const u = [...data.items]; u[i].metrics = u[i].metrics.filter((_, mj) => mj !== j); setData({...data, items: u})}}
                  className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {const u = [...data.items]; u[i].metrics = [...u[i].metrics, { label: '', value: '' }]; setData({...data, items: u})}}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </Field>
          <Field label="Equipment Deployed">
            <div className="grid grid-cols-2 gap-2">
              {project.equipment.map((eq, j) => (
                <div key={j} className="flex gap-2">
                  <Input value={eq} onChange={(e) => {const u = [...data.items]; u[i].equipment[j] = e.target.value; setData({...data, items: u})}} />
                  <button
                    type="button"
                    onClick={() => {const u = [...data.items]; u[i].equipment = u[i].equipment.filter((_, ej) => ej !== j); setData({...data, items: u})}}
                    className="px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {const u = [...data.items]; u[i].equipment = [...u[i].equipment, '']; setData({...data, items: u})}}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Equipment
            </button>
          </Field>
        </FormSection>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}
