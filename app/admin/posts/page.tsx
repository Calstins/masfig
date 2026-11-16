'use client'

import { Suspense, useCallback, useEffect, useMemo, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { FormSection, Field, Input, Textarea, Select, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { Counter } from '@/components/admin/faq-editor'
import { MediaPicker, MissingList, Pager, StatusBadge, btn, btnDanger, btnPrimary } from '@/components/admin/ui'
import { useAdminUser } from '@/components/admin/user-context'
import { ApiError, api, rebuildNote } from '@/lib/admin-api'
import { useAdminStore } from '@/lib/admin-store'

interface Post {
  id: number; slug: string; title: string; excerpt: string; body: string; coverImageId: number | null; cover: { url: string } | null; coverAlt: string
  tags: string[]; categoryId: number | null; productIds: number[]; seoTitle: string; seoDescription: string
  status: 'DRAFT' | 'PUBLISHED'; missingForPublish?: string[]
}
const LIMIT = 25

function List() {
  const [data, setData] = useState<{ items: Post[]; total: number } | null>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => { api<{ items: Post[]; total: number }>(`/admin/posts?limit=${LIMIT}&offset=${offset}`).then(setData).catch(() => setData({ items: [], total: 0 })) }, [offset])
  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Blog posts" description="Buying guides and advice. Published posts appear at /blog/<slug>/." />
        <Link href="/admin/posts?id=new" className={btnPrimary}>New post</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {!data ? <p className="p-6 text-gray-400">Loading…</p> : data.items.length === 0 ? <p className="p-6 text-gray-500 text-sm">No posts yet.</p> :
          data.items.map((p) => (
            <Link key={p.id} href={`/admin/posts?id=${p.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div><p className="font-medium text-gray-800">{p.title}</p><p className="text-xs text-gray-400">/blog/{p.slug}/</p></div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
      </div>
      {data && <Pager total={data.total} offset={offset} limit={LIMIT} onChange={setOffset} />}
    </div>
  )
}

const empty = { title: '', slug: '', excerpt: '', body: '', coverImageId: null as number | null, coverAlt: '', tags: '', categoryId: '' as number | '', productIds: [] as number[], seoTitle: '', seoDescription: '' }

function Editor({ id }: { id: string }) {
  const router = useRouter()
  const user = useAdminUser()
  const isNew = id === 'new'
  const [form, setForm] = useState(empty)
  const [coverUrl, setCoverUrl] = useState('')
  const [meta, setMeta] = useState<{ status: 'DRAFT' | 'PUBLISHED'; missing: string[] }>({ status: 'DRAFT', missing: [] })
  const cats = useAdminStore((s) => s.categories) ?? []
  const loadCategories = useAdminStore((s) => s.loadCategories)
  const [prods, setProds] = useState<{ id: number; name: string }[]>([])
  const [loaded, setLoaded] = useState(isNew)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [pick, setPick] = useState(false)
  const [preview, setPreview] = useState(false)

  const apply = useCallback((p: Post) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, body: p.body, coverImageId: p.coverImageId, coverAlt: p.coverAlt, tags: p.tags.join(', '), categoryId: p.categoryId ?? '', productIds: p.productIds, seoTitle: p.seoTitle, seoDescription: p.seoDescription })
    setCoverUrl(p.cover?.url ?? '')
    setMeta({ status: p.status, missing: p.missingForPublish ?? [] })
  }, [])

  useEffect(() => {
    void loadCategories()
    api<{ items: { id: number; name: string }[] }>('/admin/products?limit=200').then((r) => setProds(r.items)).catch(() => {})
    if (!isNew) api<Post>(`/admin/posts/${id}`).then((p) => { apply(p); setLoaded(true) }).catch((e) => setMsg({ text: e.message, type: 'error' }))
  }, [id, isNew, apply, loadCategories])

  const html = useMemo(() => (preview ? DOMPurify.sanitize(marked.parse(form.body, { async: false }) as string) : ''), [preview, form.body])
  const fail = (e: unknown) => setMsg({ text: e instanceof ApiError && e.missing.length ? `${e.message}: ${e.missing.join('; ')}` : e instanceof Error ? e.message : 'Failed', type: 'error' })
  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => setForm({ ...form, [k]: v })

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null)
    const payload = {
      title: form.title, slug: form.slug || undefined, excerpt: form.excerpt, body: form.body, coverImageId: form.coverImageId, coverAlt: form.coverAlt,
      tags: form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean), categoryId: form.categoryId === '' ? null : form.categoryId,
      productIds: form.productIds, seoTitle: form.seoTitle, seoDescription: form.seoDescription,
    }
    try {
      const p = await api<Post & { rebuild?: string }>(isNew ? '/admin/posts' : `/admin/posts/${id}`, { method: isNew ? 'POST' : 'PUT', json: payload })
      if (isNew) { router.replace(`/admin/posts?id=${p.id}`); return }
      apply(p); setMsg({ text: 'Saved.' + rebuildNote(p), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function act(kind: 'publish' | 'unpublish') {
    setBusy(true); setMsg(null)
    try {
      const r = await api<{ rebuild?: string }>(`/admin/posts/${id}/${kind}`, { method: 'POST', json: {} })
      apply(await api<Post>(`/admin/posts/${id}`))
      setMsg({ text: (kind === 'publish' ? 'Published.' : 'Unpublished.') + rebuildNote(r), type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function remove() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setBusy(true)
    try { await api(`/admin/posts/${id}`, { method: 'DELETE' }); router.replace('/admin/posts') } catch (err) { fail(err); setBusy(false) }
  }

  if (!loaded) return <div className="text-gray-400 animate-pulse">Loading…</div>
  const published = meta.status === 'PUBLISHED'

  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader title={isNew ? 'New post' : form.title} description={isNew ? undefined : `Status: ${meta.status}`} />
      {!published && !isNew && <MissingList items={meta.missing} />}
      <FormSection label="Article">
        <Field label="Title"><Input value={form.title} onChange={(e) => set('title', e.target.value)} required /></Field>
        <Field label="URL slug" hint={published ? 'Locked while published.' : 'Leave blank to generate from the title.'}><Input value={form.slug} disabled={published} onChange={(e) => set('slug', e.target.value)} className="font-mono text-xs" /></Field>
        <Field label="Excerpt" hint="At least 50 characters. Shown on the blog index."><Textarea rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></Field>
        <Field label="Body (Markdown)" hint="At least 600 characters. Use ## for headings. Write for buyers; only include facts you can stand behind.">
          <div className="flex gap-2 mb-2"><button type="button" className={btn} onClick={() => setPreview(false)} disabled={!preview}>Write</button><button type="button" className={btn} onClick={() => setPreview(true)} disabled={preview}>Preview</button></div>
          {preview ? <div className="prose max-w-none border rounded-lg p-4 bg-white" dangerouslySetInnerHTML={{ __html: html }} /> : <Textarea rows={18} value={form.body} onChange={(e) => set('body', e.target.value)} />}
        </Field>
        <Field label="Tags (comma separated)"><Input value={form.tags} onChange={(e) => set('tags', e.target.value)} /></Field>
      </FormSection>
      <FormSection label="Cover image">
        <div className="flex gap-4 items-start">
          {coverUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={coverUrl} alt="" className="w-40 h-28 object-cover rounded-lg border" />}
          <div className="flex-1 space-y-3">
            <button type="button" className={btn} onClick={() => setPick(true)}>{form.coverImageId ? 'Change image' : 'Choose image'}</button>
            <Field label="Image description (alt text)" hint="Required to publish."><Input value={form.coverAlt} onChange={(e) => set('coverAlt', e.target.value)} /></Field>
          </div>
        </div>
      </FormSection>
      <FormSection label="Links to equipment" badge="Optional">
        <Field label="Related category"><Select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value ? Number(e.target.value) : '')}><option value="">None</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
        <Field label="Products mentioned (up to 10)" hint="Only published products are linked on the live site.">
          <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-1">
            {prods.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.productIds.includes(p.id)}
                onChange={(e) => set('productIds', e.target.checked ? [...form.productIds, p.id].slice(0, 10) : form.productIds.filter((x) => x !== p.id))} />{p.name}</label>
            ))}
          </div>
        </Field>
      </FormSection>
      <FormSection label="Search appearance" badge="SEO">
        <Field label="SEO title"><Input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} /><Counter value={form.seoTitle} min={10} max={70} /></Field>
        <Field label="SEO description"><Textarea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} /><Counter value={form.seoDescription} min={50} max={170} /></Field>
      </FormSection>
      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <div className="flex flex-wrap gap-3">
        <button className={btnPrimary} disabled={busy}>{busy ? 'Working…' : 'Save'}</button>
        {!isNew && !published && <button type="button" className={btn} disabled={busy} onClick={() => act('publish')}>Publish</button>}
        {!isNew && published && <button type="button" className={btn} disabled={busy} onClick={() => act('unpublish')}>Unpublish</button>}
        {!isNew && user?.role === 'ADMIN' && <button type="button" className={btnDanger} disabled={busy} onClick={remove}>Delete</button>}
        <Link href="/admin/posts" className={btn}>Back to list</Link>
      </div>
      {pick && <MediaPicker value={form.coverImageId} onClose={() => setPick(false)} onPick={(m) => { setForm({ ...form, coverImageId: m.id }); setCoverUrl(m.url); setPick(false) }} />}
    </form>
  )
}

function Page() {
  const id = useSearchParams().get('id')
  return id ? <Editor key={id} id={id} /> : <List />
}
export default function PostsPage() {
  return <Suspense fallback={<div className="text-gray-400">Loading…</div>}><Page /></Suspense>
}
