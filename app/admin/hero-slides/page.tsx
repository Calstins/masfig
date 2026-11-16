/* eslint-disable @next/next/no-img-element */
'use client'

import { Suspense, useCallback, useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormSection, Field, Input, Textarea, Select, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { MediaPicker, btn, btnDanger, btnPrimary } from '@/components/admin/ui'
import { ApiError, api, rebuildNote } from '@/lib/admin-api'
import type { HeroSlideData } from '@/lib/types'

interface CatOpt { id: number; name: string; status: string; image: { url: string } | null }

function List() {
  const [rows, setRows] = useState<HeroSlideData[] | null>(null)
  useEffect(() => { api<HeroSlideData[]>('/admin/hero-slides').then(setRows).catch(() => setRows([])) }, [])
  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Hero slides" description="The sliding banner at the top of the home page. Each slide links to a category page and its quote request form. Slides are shown in display order; switch one off to hide it." />
        <Link href="/admin/hero-slides?id=new" className={btnPrimary}>New slide</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {rows === null ? <p className="p-6 text-gray-400">Loading…</p> : rows.length === 0 ? <p className="p-6 text-gray-500 text-sm">No slides yet. The site falls back to the Hero text until you add one.</p> :
          rows.map((s) => (
            <Link key={s.id} href={`/admin/hero-slides?id=${s.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
              {s.image ? <img src={s.image.url} alt="" className="w-14 h-14 object-contain rounded-lg border bg-gray-50" /> : <div className="w-14 h-14 rounded-lg border bg-gray-50" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{s.title}</p>
                <p className="text-xs text-gray-400">#{s.sortOrder}{s.category ? ` · ${s.category.name}` : ' · custom link'}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${s.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{s.active ? 'Active' : 'Hidden'}</span>
            </Link>
          ))}
      </div>
    </div>
  )
}

const empty = { eyebrow: '', title: '', subtitle: '', ctaLabel: 'Explore range', quoteLabel: 'Request a quote', categoryId: '' as number | '', linkUrl: '', imageId: null as number | null, imageAlt: '', sortOrder: 0, active: true }

function Editor({ id }: { id: string }) {
  const router = useRouter()
  const isNew = id === 'new'
  const [form, setForm] = useState(empty)
  const [imageUrl, setImageUrl] = useState('')
  const [cats, setCats] = useState<CatOpt[]>([])
  const [loaded, setLoaded] = useState(isNew)
  const [busy, setBusy] = useState(false)
  const [pick, setPick] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const apply = useCallback((s: HeroSlideData) => {
    setForm({ eyebrow: s.eyebrow, title: s.title, subtitle: s.subtitle, ctaLabel: s.ctaLabel, quoteLabel: s.quoteLabel, categoryId: s.categoryId ?? '', linkUrl: s.linkUrl, imageId: s.image?.id ?? null, imageAlt: s.imageAlt, sortOrder: s.sortOrder, active: s.active })
    setImageUrl(s.image?.url ?? '')
  }, [])

  useEffect(() => {
    api<CatOpt[]>('/admin/categories').then(setCats).catch(() => undefined)
    if (!isNew) api<HeroSlideData[]>('/admin/hero-slides').then((all) => { const s = all.find((x) => String(x.id) === id); if (s) apply(s); setLoaded(true) }).catch((e) => setMsg({ text: e.message, type: 'error' }))
  }, [id, isNew, apply])

  const fail = (e: unknown) => setMsg({ text: e instanceof ApiError ? e.message : 'Failed', type: 'error' })
  const set = (k: keyof typeof empty, v: unknown) => setForm({ ...form, [k]: v })

  function chooseCategory(cid: number | '') {
    const c = cats.find((x) => x.id === cid)
    setForm((f) => ({ ...f, categoryId: cid, title: f.title || c?.name || '' }))
  }

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null)
    const payload = { ...form, categoryId: form.categoryId === '' ? null : form.categoryId }
    try {
      const s = await api<HeroSlideData & { rebuild?: string }>(isNew ? '/admin/hero-slides' : `/admin/hero-slides/${id}`, { method: isNew ? 'POST' : 'PUT', json: payload })
      if (isNew) { router.replace(`/admin/hero-slides?id=${s.id}`); return }
      apply(s); setMsg({ text: 'Saved.' + rebuildNote(s), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function remove() {
    if (!confirm('Delete this slide?')) return
    setBusy(true)
    try { await api(`/admin/hero-slides/${id}`, { method: 'DELETE' }); router.replace('/admin/hero-slides') } catch (err) { fail(err); setBusy(false) }
  }

  if (!loaded) return <div className="text-gray-400 animate-pulse">Loading…</div>
  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader title={isNew ? 'New hero slide' : form.title} />
      <FormSection label="Destination">
        <Field label="Category" hint="The slide's buttons open this category page; “Request a quote” jumps to its quote form.">
          <Select value={form.categoryId} onChange={(e) => chooseCategory(e.target.value ? Number(e.target.value) : '')}>
            <option value="">— none (use a custom link) —</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}{c.status !== 'PUBLISHED' ? ' (draft — slide stays hidden until published)' : ''}</option>)}
          </Select>
        </Field>
        {!form.categoryId && <Field label="Custom link" hint="e.g. /contact/ or /products/"><Input value={form.linkUrl} onChange={(e) => set('linkUrl', e.target.value)} className="font-mono text-xs" /></Field>}
      </FormSection>
      <FormSection label="Text">
        <Field label="Small heading (eyebrow)"><Input value={form.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} placeholder="Bakery equipment" /></Field>
        <Field label="Headline"><Input value={form.title} onChange={(e) => set('title', e.target.value)} required /></Field>
        <Field label="Supporting text"><Textarea rows={3} value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Main button label"><Input value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} /></Field>
          <Field label="Quote button label"><Input value={form.quoteLabel} onChange={(e) => set('quoteLabel', e.target.value)} /></Field>
        </div>
      </FormSection>
      <FormSection label="Product image">
        <div className="flex gap-4 items-start">
          {imageUrl && <img src={imageUrl} alt="" className="w-32 h-32 object-contain rounded-lg border bg-gray-50" />}
          <div className="flex-1 space-y-3">
            <button type="button" className={btn} onClick={() => setPick(true)}>{form.imageId ? 'Change image' : 'Choose image'}</button>
            <Field label="Image description (alt text)"><Input value={form.imageAlt} onChange={(e) => set('imageAlt', e.target.value)} /></Field>
          </div>
        </div>
      </FormSection>
      <FormSection label="Display">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Display order" hint="Lowest number shows first."><Input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value) || 0)} /></Field>
          <label className="flex items-center gap-3 text-sm text-gray-700 mt-7"><input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} /> Show this slide on the site</label>
        </div>
      </FormSection>
      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <div className="flex flex-wrap gap-3">
        <button className={btnPrimary} disabled={busy}>{busy ? 'Working…' : 'Save'}</button>
        {!isNew && <button type="button" className={btnDanger} disabled={busy} onClick={remove}>Delete</button>}
        <Link href="/admin/hero-slides" className={btn}>Back to list</Link>
      </div>
      {pick && <MediaPicker value={form.imageId} onClose={() => setPick(false)} onPick={(m) => { setForm({ ...form, imageId: m.id }); setImageUrl(m.url); setPick(false) }} />}
    </form>
  )
}

function Page() {
  const id = useSearchParams().get('id')
  return id ? <Editor key={id} id={id} /> : <List />
}

export default function HeroSlidesPage() {
  return <Suspense fallback={<div className="text-gray-400">Loading…</div>}><Page /></Suspense>
}
