'use client'

import { Suspense, useCallback, useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormSection, Field, Input, Textarea, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { FaqEditor, Counter, type FaqDraft } from '@/components/admin/faq-editor'
import { MediaPicker, MissingList, StatusBadge, btn, btnDanger, btnPrimary } from '@/components/admin/ui'
import { useAdminUser } from '@/components/admin/user-context'
import { ApiError, api, rebuildNote } from '@/lib/admin-api'
import { useAdminStore } from '@/lib/admin-store'

interface Cat {
  id: number; slug: string; name: string; h1: string; intro: string; seoTitle: string; seoDescription: string
  imageId: number | null; image: { url: string } | null; imageAlt: string; sortOrder: number
  status: 'DRAFT' | 'PUBLISHED'; productCount?: number; faqs: FaqDraft[]; missingForPublish?: string[]
}

function List() {
  const [rows, setRows] = useState<Cat[] | null>(null)
  useEffect(() => { api<Cat[]>('/admin/categories').then(setRows).catch(() => setRows([])) }, [])
  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Categories" description="Each published category becomes a page at /products/<slug>/. It needs an intro, SEO fields and an image with alt text." />
        <Link href="/admin/categories?id=new" className={btnPrimary}>New category</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {rows === null ? <p className="p-6 text-gray-400">Loading…</p> : rows.length === 0 ? <p className="p-6 text-gray-500 text-sm">No categories yet.</p> :
          rows.map((c) => (
            <Link key={c.id} href={`/admin/categories?id=${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div><p className="font-medium text-gray-800">{c.name}</p><p className="text-xs text-gray-400">/products/{c.slug}/</p></div>
              <StatusBadge status={c.status} />
            </Link>
          ))}
      </div>
    </div>
  )
}

const empty = { name: '', slug: '', h1: '', intro: '', seoTitle: '', seoDescription: '', imageId: null as number | null, imageAlt: '', sortOrder: 0, faqs: [] as FaqDraft[] }

function Editor({ id }: { id: string }) {
  const router = useRouter()
  const user = useAdminUser()
  const isNew = id === 'new'
  const [form, setForm] = useState(empty)
  const [meta, setMeta] = useState<{ status: 'DRAFT' | 'PUBLISHED'; imageUrl: string; missing: string[]; productCount?: number }>({ status: 'DRAFT', imageUrl: '', missing: [] })
  const [loaded, setLoaded] = useState(isNew)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [pick, setPick] = useState(false)

  const apply = useCallback((c: Cat) => {
    setForm({ name: c.name, slug: c.slug, h1: c.h1 === c.name ? '' : c.h1, intro: c.intro, seoTitle: c.seoTitle, seoDescription: c.seoDescription, imageId: c.imageId, imageAlt: c.imageAlt, sortOrder: c.sortOrder, faqs: c.faqs.map(({ question, answer }) => ({ question, answer })) })
    setMeta({ status: c.status, imageUrl: c.image?.url ?? '', missing: c.missingForPublish ?? [], productCount: c.productCount })
  }, [])

  useEffect(() => { if (!isNew) api<Cat>(`/admin/categories/${id}`).then((c) => { apply(c); setLoaded(true) }).catch((e) => setMsg({ text: e.message, type: 'error' })) }, [id, isNew, apply])

  const fail = (e: unknown) => setMsg({ text: e instanceof ApiError && e.missing.length ? `${e.message}: ${e.missing.join('; ')}` : e instanceof Error ? e.message : 'Failed', type: 'error' })

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null)
    const payload = { ...form, slug: form.slug || undefined, faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()) }
    try {
      const c = await api<Cat & { rebuild?: string }>(isNew ? '/admin/categories' : `/admin/categories/${id}`, { method: isNew ? 'POST' : 'PUT', json: payload })
      useAdminStore.getState().invalidateCategories()
      if (isNew) { router.replace(`/admin/categories?id=${c.id}`); return }
      apply(c); setMsg({ text: 'Saved.' + rebuildNote(c), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function act(kind: 'publish' | 'unpublish') {
    setBusy(true); setMsg(null)
    try {
      const c = await api<Cat & { rebuild?: string }>(`/admin/categories/${id}/${kind}`, { method: 'POST', json: {} })
      useAdminStore.getState().invalidateCategories()
      const fresh = await api<Cat>(`/admin/categories/${id}`); apply(fresh)
      setMsg({ text: (kind === 'publish' ? 'Published.' : 'Unpublished.') + rebuildNote(c), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function remove() {
    if (!confirm('Delete this category? This cannot be undone.')) return
    setBusy(true)
    try { await api(`/admin/categories/${id}`, { method: 'DELETE' }); useAdminStore.getState().invalidateCategories(); router.replace('/admin/categories') } catch (err) { fail(err); setBusy(false) }
  }

  if (!loaded) return <div className="text-gray-400 animate-pulse">Loading…</div>
  const set = (k: keyof typeof empty, v: unknown) => setForm({ ...form, [k]: v })
  const published = meta.status === 'PUBLISHED'

  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader title={isNew ? 'New category' : form.name} description={isNew ? undefined : `Status: ${meta.status}`} />
      {!published && !isNew && <MissingList items={meta.missing} />}
      <FormSection label="Basics">
        <Field label="Name"><Input value={form.name} onChange={(e) => set('name', e.target.value)} required /></Field>
        <Field label="URL slug" hint={published ? 'Locked while published (changing it would break search rankings).' : 'Leave blank to generate from the name.'}>
          <Input value={form.slug} disabled={published} onChange={(e) => set('slug', e.target.value)} className="font-mono text-xs" />
        </Field>
        <Field label="Page heading (H1)" hint="Optional. Defaults to the name."><Input value={form.h1} onChange={(e) => set('h1', e.target.value)} /></Field>
        <Field label="Introduction (Markdown)" hint="At least 150 characters of real, useful text about this equipment type."><Textarea rows={8} value={form.intro} onChange={(e) => set('intro', e.target.value)} /></Field>
        <Field label="Display order"><Input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value) || 0)} /></Field>
      </FormSection>
      <FormSection label="Search appearance" badge="SEO">
        <Field label="SEO title"><Input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} /><Counter value={form.seoTitle} min={10} max={70} /></Field>
        <Field label="SEO description"><Textarea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} /><Counter value={form.seoDescription} min={50} max={170} /></Field>
      </FormSection>
      <FormSection label="Image">
        <div className="flex gap-4 items-start">
          {meta.imageUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={meta.imageUrl} alt="" className="w-32 h-24 object-cover rounded-lg border" />}
          <div className="flex-1 space-y-3">
            <button type="button" className={btn} onClick={() => setPick(true)}>{form.imageId ? 'Change image' : 'Choose image'}</button>
            <Field label="Image description (alt text)" hint="Describe what is in the picture. Required to publish."><Input value={form.imageAlt} onChange={(e) => set('imageAlt', e.target.value)} /></Field>
          </div>
        </div>
      </FormSection>
      <FormSection label="Frequently asked questions" badge="Optional"><FaqEditor faqs={form.faqs} onChange={(f) => set('faqs', f)} /></FormSection>
      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <div className="flex flex-wrap gap-3">
        <button className={btnPrimary} disabled={busy}>{busy ? 'Working…' : 'Save'}</button>
        {!isNew && !published && <button type="button" className={btn} disabled={busy} onClick={() => act('publish')}>Publish</button>}
        {!isNew && published && <button type="button" className={btn} disabled={busy} onClick={() => act('unpublish')}>Unpublish</button>}
        {!isNew && user?.role === 'ADMIN' && <button type="button" className={btnDanger} disabled={busy} onClick={remove}>Delete</button>}
        <Link href="/admin/categories" className={btn}>Back to list</Link>
      </div>
      {pick && <MediaPicker value={form.imageId} onClose={() => setPick(false)} onPick={(m) => { setForm({ ...form, imageId: m.id, imageAlt: form.imageAlt || '' }); setMeta({ ...meta, imageUrl: m.url }); setPick(false) }} />}
    </form>
  )
}

function Page() {
  const id = useSearchParams().get('id')
  return id ? <Editor key={id} id={id} /> : <List />
}

export default function CategoriesPage() {
  return <Suspense fallback={<div className="text-gray-400">Loading…</div>}><Page /></Suspense>
}
