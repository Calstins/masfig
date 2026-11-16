'use client'

import { Suspense, useCallback, useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { FormSection, Field, Input, Textarea, Select, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { FaqEditor, Counter, type FaqDraft } from '@/components/admin/faq-editor'
import { MediaPicker, MissingList, Pager, StatusBadge, btn, btnDanger, btnPrimary } from '@/components/admin/ui'
import { useAdminUser } from '@/components/admin/user-context'
import { ApiError, api, rebuildNote } from '@/lib/admin-api'
import { useAdminStore } from '@/lib/admin-store'

interface Prod {
  id: number; slug: string; name: string; brand: string; model: string; categoryId: number
  category: { name: string }
  summary: string; description: string; specs: { label: string; value: string }[] | null
  dimensions: string; capacity: string; power: string; applications: string[]
  availability: string; priceMode: 'QUOTE' | 'PRICE'; price: number | null; currency: 'NGN' | 'USD'; warranty: string
  seoTitle: string; seoDescription: string; sortOrder: number; status: 'DRAFT' | 'PUBLISHED'
  images: { mediaId: number; url: string; alt: string }[]; faqs: FaqDraft[]; missingForPublish?: string[]
}
interface CatOpt { id: number; name: string }
const LIMIT = 25

function List() {
  const [data, setData] = useState<{ items: Prod[]; total: number } | null>(null)
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [offset, setOffset] = useState(0)
  useEffect(() => {
    const p = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) })
    if (q.trim()) p.set('q', q.trim()); if (status) p.set('status', status)
    const t = setTimeout(() => api<{ items: Prod[]; total: number }>(`/admin/products?${p}`).then(setData).catch(() => setData({ items: [], total: 0 })), 250)
    return () => clearTimeout(t)
  }, [q, status, offset])
  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Products" description="Each published product becomes a page at /products/<category>/<slug>/. Prices are optional — leave on “Quote” unless you want a price shown." />
        <Link href="/admin/products?id=new" className={btnPrimary}>New product</Link>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="flex-1"><Input placeholder="Search name, brand, model" value={q} onChange={(e) => { setQ(e.target.value); setOffset(0) }} /></div>
        <div className="w-40"><Select value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0) }}><option value="">All statuses</option><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></Select></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {!data ? <p className="p-6 text-gray-400">Loading…</p> : data.items.length === 0 ? <p className="p-6 text-gray-500 text-sm">No products found.</p> :
          data.items.map((p) => (
            <Link key={p.id} href={`/admin/products?id=${p.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div><p className="font-medium text-gray-800">{p.name}</p><p className="text-xs text-gray-400">{p.category.name}{p.brand ? ` · ${p.brand}` : ''}</p></div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
      </div>
      {data && <Pager total={data.total} offset={offset} limit={LIMIT} onChange={setOffset} />}
    </div>
  )
}

type Form = {
  name: string; slug: string; categoryId: number | ''; brand: string; model: string; summary: string; description: string
  specs: { label: string; value: string }[]; dimensions: string; capacity: string; power: string; applications: string
  availability: string; priceMode: 'QUOTE' | 'PRICE'; price: string; currency: 'NGN' | 'USD'; warranty: string
  seoTitle: string; seoDescription: string; sortOrder: number; images: { mediaId: number; url: string; alt: string }[]; faqs: FaqDraft[]
}
const empty: Form = { name: '', slug: '', categoryId: '', brand: '', model: '', summary: '', description: '', specs: [], dimensions: '', capacity: '', power: '', applications: '', availability: 'UNKNOWN', priceMode: 'QUOTE', price: '', currency: 'NGN', warranty: '', seoTitle: '', seoDescription: '', sortOrder: 0, images: [], faqs: [] }

function Editor({ id }: { id: string }) {
  const router = useRouter()
  const user = useAdminUser()
  const isNew = id === 'new'
  const [form, setForm] = useState<Form>(empty)
  const cats = (useAdminStore((s) => s.categories) ?? []) as CatOpt[]
  const loadCategories = useAdminStore((s) => s.loadCategories)
  const [meta, setMeta] = useState<{ status: 'DRAFT' | 'PUBLISHED'; missing: string[] }>({ status: 'DRAFT', missing: [] })
  const [loaded, setLoaded] = useState(isNew)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [pick, setPick] = useState(false)

  const apply = useCallback((p: Prod) => {
    setForm({
      name: p.name, slug: p.slug, categoryId: p.categoryId, brand: p.brand, model: p.model, summary: p.summary, description: p.description,
      specs: (p.specs ?? []).map(({ label, value }) => ({ label, value })), dimensions: p.dimensions, capacity: p.capacity, power: p.power,
      applications: p.applications.join('\n'), availability: p.availability, priceMode: p.priceMode, price: p.price == null ? '' : String(p.price), currency: p.currency,
      warranty: p.warranty, seoTitle: p.seoTitle, seoDescription: p.seoDescription, sortOrder: p.sortOrder,
      images: p.images.map(({ mediaId, url, alt }) => ({ mediaId, url, alt })), faqs: p.faqs.map(({ question, answer }) => ({ question, answer })),
    })
    setMeta({ status: p.status, missing: p.missingForPublish ?? [] })
  }, [])

  useEffect(() => {
    void loadCategories()
    if (!isNew) api<Prod>(`/admin/products/${id}`).then((p) => { apply(p); setLoaded(true) }).catch((e) => setMsg({ text: e.message, type: 'error' }))
  }, [id, isNew, apply, loadCategories])

  const fail = (e: unknown) => setMsg({ text: e instanceof ApiError && e.missing.length ? `${e.message}: ${e.missing.join('; ')}` : e instanceof Error ? e.message : 'Failed', type: 'error' })
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm({ ...form, [k]: v })

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null)
    if (form.categoryId === '') { setMsg({ text: 'Choose a category', type: 'error' }); setBusy(false); return }
    const payload = {
      name: form.name, slug: form.slug || undefined, categoryId: form.categoryId, brand: form.brand, model: form.model, summary: form.summary, description: form.description,
      specs: form.specs.filter((s) => s.label.trim() && s.value.trim()), dimensions: form.dimensions, capacity: form.capacity, power: form.power,
      applications: form.applications.split('\n').map((s) => s.trim()).filter(Boolean),
      availability: form.availability, priceMode: form.priceMode, price: form.priceMode === 'PRICE' ? Number(form.price) || 0 : null, currency: form.currency,
      warranty: form.warranty, seoTitle: form.seoTitle, seoDescription: form.seoDescription, sortOrder: form.sortOrder,
      images: form.images.map(({ mediaId, alt }) => ({ mediaId, alt })), faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()),
    }
    try {
      const p = await api<Prod & { rebuild?: string }>(isNew ? '/admin/products' : `/admin/products/${id}`, { method: isNew ? 'POST' : 'PUT', json: payload })
      if (isNew) { router.replace(`/admin/products?id=${p.id}`); return }
      apply(p); setMsg({ text: 'Saved.' + rebuildNote(p), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function act(kind: 'publish' | 'unpublish') {
    setBusy(true); setMsg(null)
    try {
      const r = await api<{ rebuild?: string }>(`/admin/products/${id}/${kind}`, { method: 'POST', json: {} })
      apply(await api<Prod>(`/admin/products/${id}`))
      setMsg({ text: (kind === 'publish' ? 'Published.' : 'Unpublished.') + rebuildNote(r), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function remove() {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setBusy(true)
    try { await api(`/admin/products/${id}`, { method: 'DELETE' }); router.replace('/admin/products') } catch (err) { fail(err); setBusy(false) }
  }

  if (!loaded) return <div className="text-gray-400 animate-pulse">Loading…</div>
  const published = meta.status === 'PUBLISHED'

  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader title={isNew ? 'New product' : form.name} description={isNew ? undefined : `Status: ${meta.status}`} />
      {!published && !isNew && <MissingList items={meta.missing} />}
      <FormSection label="Basics">
        <Field label="Name"><Input value={form.name} onChange={(e) => set('name', e.target.value)} required /></Field>
        <Field label="Category" hint="A product can only be published when its category is published.">
          <Select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value ? Number(e.target.value) : '')} required>
            <option value="">Select…</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Brand"><Input value={form.brand} onChange={(e) => set('brand', e.target.value)} /></Field>
          <Field label="Model"><Input value={form.model} onChange={(e) => set('model', e.target.value)} /></Field>
        </div>
        <Field label="URL slug" hint={published ? 'Locked while published.' : 'Leave blank to generate from the name.'}><Input value={form.slug} disabled={published} onChange={(e) => set('slug', e.target.value)} className="font-mono text-xs" /></Field>
        <Field label="Short summary" hint="One or two sentences shown on cards."><Textarea rows={2} value={form.summary} onChange={(e) => set('summary', e.target.value)} /></Field>
        <Field label="Description (Markdown)" hint="At least 120 characters. Describe what it does, who it suits, and what is included. Only state facts you can back up."><Textarea rows={8} value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
        <Field label="Display order"><Input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value) || 0)} /></Field>
      </FormSection>

      <FormSection label="Specifications">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Capacity"><Input value={form.capacity} onChange={(e) => set('capacity', e.target.value)} /></Field>
          <Field label="Power"><Input value={form.power} onChange={(e) => set('power', e.target.value)} /></Field>
          <Field label="Dimensions"><Input value={form.dimensions} onChange={(e) => set('dimensions', e.target.value)} /></Field>
        </div>
        <Field label="Warranty"><Input value={form.warranty} onChange={(e) => set('warranty', e.target.value)} placeholder="Only if confirmed" /></Field>
        <Field label="Suitable for (one per line)"><Textarea rows={3} value={form.applications} onChange={(e) => set('applications', e.target.value)} /></Field>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Specification table</p>
          {form.specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input value={s.label} placeholder="Label" onChange={(e) => set('specs', form.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <Input value={s.value} placeholder="Value" onChange={(e) => set('specs', form.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              <button type="button" aria-label="Remove row" className="text-red-500 px-2" onClick={() => set('specs', form.specs.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" className={btn} onClick={() => set('specs', [...form.specs, { label: '', value: '' }])}><Plus className="w-4 h-4" /> Add row</button>
        </div>
      </FormSection>

      <FormSection label="Availability & price">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Availability"><Select value={form.availability} onChange={(e) => set('availability', e.target.value)}><option value="UNKNOWN">Not stated</option><option value="IN_STOCK">In stock</option><option value="ON_REQUEST">Available on request</option><option value="OUT_OF_STOCK">Out of stock</option></Select></Field>
          <Field label="Price display"><Select value={form.priceMode} onChange={(e) => set('priceMode', e.target.value as 'QUOTE' | 'PRICE')}><option value="QUOTE">Request a quote (no price shown)</option><option value="PRICE">Show a price</option></Select></Field>
        </div>
        {form.priceMode === 'PRICE' && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price"><Input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} /></Field>
            <Field label="Currency"><Select value={form.currency} onChange={(e) => set('currency', e.target.value as 'NGN' | 'USD')}><option value="NGN">Naira (₦)</option><option value="USD">US dollar ($)</option></Select></Field>
          </div>
        )}
      </FormSection>

      <FormSection label="Images" badge="Required to publish">
        <div className="grid sm:grid-cols-2 gap-4">
          {form.images.map((im, i) => (
            <div key={im.mediaId} className="rounded-lg border border-gray-100 p-3 space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" className="w-full h-32 object-cover rounded" />
              <Input value={im.alt} placeholder="Describe the image (alt text, required)" onChange={(e) => set('images', form.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} />
              <div className="flex gap-3 text-xs">
                {i > 0 && <button type="button" className="text-gray-500" onClick={() => { const a = [...form.images]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set('images', a) }}>Move up</button>}
                <button type="button" className="text-red-500" onClick={() => set('images', form.images.filter((_, j) => j !== i))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        {form.images.length < 12 && <button type="button" className={btn} onClick={() => setPick(true)}><Plus className="w-4 h-4" /> Add image</button>}
      </FormSection>

      <FormSection label="Search appearance" badge="SEO">
        <Field label="SEO title"><Input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} /><Counter value={form.seoTitle} min={10} max={70} /></Field>
        <Field label="SEO description"><Textarea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} /><Counter value={form.seoDescription} min={50} max={170} /></Field>
      </FormSection>
      <FormSection label="Frequently asked questions" badge="Optional"><FaqEditor faqs={form.faqs} onChange={(f) => set('faqs', f)} /></FormSection>

      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <div className="flex flex-wrap gap-3">
        <button className={btnPrimary} disabled={busy}>{busy ? 'Working…' : 'Save'}</button>
        {!isNew && !published && <button type="button" className={btn} disabled={busy} onClick={() => act('publish')}>Publish</button>}
        {!isNew && published && <button type="button" className={btn} disabled={busy} onClick={() => act('unpublish')}>Unpublish</button>}
        {!isNew && user?.role === 'ADMIN' && <button type="button" className={btnDanger} disabled={busy} onClick={remove}>Delete</button>}
        <Link href="/admin/products" className={btn}>Back to list</Link>
      </div>
      {pick && <MediaPicker onClose={() => setPick(false)} onPick={(m) => { if (!form.images.some((x) => x.mediaId === m.id)) set('images', [...form.images, { mediaId: m.id, url: m.url, alt: m.alt || '' }]); setPick(false) }} />}
    </form>
  )
}

function Page() {
  const id = useSearchParams().get('id')
  return id ? <Editor key={id} id={id} /> : <List />
}
export default function ProductsPage() {
  return <Suspense fallback={<div className="text-gray-400">Loading…</div>}><Page /></Suspense>
}
