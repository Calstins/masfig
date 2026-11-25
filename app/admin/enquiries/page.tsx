'use client'

import { useCallback, useEffect, useState } from 'react'
import { PageHeader, Select, SaveMessage } from '@/components/admin/form-components'
import { Pager, StatusBadge, btn, btnDanger } from '@/components/admin/ui'
import { api } from '@/lib/admin-api'
import { fetchMe } from '@/lib/auth'
import { telLink, waNumber } from '@/lib/site'

interface Enquiry {
  id: number; kind: string; name: string; phone: string; email: string | null; company: string | null; message: string; quantity: string | null
  productName: string | null; pageUrl: string | null; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null
  status: 'NEW' | 'HANDLED'; createdAt: string
}
const LIMIT = 25

export default function EnquiriesPage() {
  const [data, setData] = useState<{ items: Enquiry[]; total: number } | null>(null)
  const [status, setStatus] = useState('NEW'); const [offset, setOffset] = useState(0)
  const [err, setErr] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [picked, setPicked] = useState<number[]>([])
  const [confirm, setConfirm] = useState<number | 'selected' | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { fetchMe().then((u) => setIsAdmin(u?.role === 'ADMIN')).catch(() => {}) }, [])

  const load = useCallback(() => {
    const p = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) }); if (status) p.set('status', status)
    api<{ items: Enquiry[]; total: number }>(`/admin/enquiries?${p}`).then((d) => { setData(d); setPicked([]); setConfirm(null); if (!d.items.length && offset > 0) setOffset(Math.max(0, offset - LIMIT)) }).catch((e) => { setErr(e.message); setData({ items: [], total: 0 }) })
  }, [status, offset])
  useEffect(load, [load])

  async function toggle(e: Enquiry) {
    try {
      await api(`/admin/enquiries/${e.id}/handled`, { method: 'POST', json: { handled: e.status === 'NEW' } })
      // Show the change at once; with a New/Handled filter the row leaves this list.
      setData((d) => d && { items: status ? d.items.filter((i) => i.id !== e.id) : d.items.map((i) => (i.id === e.id ? { ...i, status: i.status === 'NEW' ? 'HANDLED' : 'NEW' } : i)), total: status ? Math.max(0, d.total - 1) : d.total })
    } catch (x) { setErr((x as Error).message) }
  }

  function dropRows(ids: number[]) {
    const left = (data?.items ?? []).filter((i) => !ids.includes(i.id))
    setData((d) => d && { items: left, total: Math.max(0, d.total - ids.length) })
    setPicked([]); setConfirm(null)
    if (!left.length) load() // page emptied: pull the next page, or the empty state
  }

  async function remove(ids: number[]) {
    setBusy(true); setErr('')
    try {
      if (ids.length === 1) await api(`/admin/enquiries/${ids[0]}`, { method: 'DELETE' })
      else await api('/admin/enquiries/delete-many', { method: 'POST', json: { ids } })
      dropRows(ids)
    } catch (x) {
      // Already gone (for example deleted in another tab): just remove it from the list.
      if ((x as { status?: number }).status === 404) { dropRows(ids) } else { setErr((x as Error).message); setConfirm(null) }
    } finally { setBusy(false) }
  }
  const toggleOne = (id: number) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const pageIds = data?.items.map((i) => i.id) ?? []
  const allPicked = pageIds.length > 0 && pageIds.every((id) => picked.includes(id))

  return (
    <div>
      <PageHeader title="Enquiries" description="Quote requests from the website. Reply quickly — by phone or WhatsApp — then mark as handled." />
      <div className="w-48 mb-4"><Select value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0) }}><option value="NEW">New</option><option value="HANDLED">Handled</option><option value="">All</option></Select></div>
      {err && <SaveMessage message={err} type="error" />}
      {isAdmin && data && data.items.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-gray-600"><input type="checkbox" checked={allPicked} onChange={() => setPicked(allPicked ? [] : pageIds)} className="h-4 w-4 accent-red-600" /> Select all on this page</label>
          {picked.length > 0 && (confirm === 'selected'
            ? <span className="inline-flex items-center gap-2"><span className="text-red-600">Delete {picked.length} enquir{picked.length === 1 ? 'y' : 'ies'} permanently?</span><button className={btnDanger} disabled={busy} onClick={() => remove(picked)}>{busy ? 'Deleting…' : 'Yes, delete'}</button><button className={btn} onClick={() => setConfirm(null)}>Cancel</button></span>
            : <button className={btnDanger} onClick={() => setConfirm('selected')}>Delete selected ({picked.length})</button>)}
        </div>
      )}
      <div className="space-y-3">
        {!data ? <p className="text-gray-400">Loading…</p> : data.items.length === 0 ? <p className="text-gray-500 text-sm">Nothing here.</p> : data.items.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3">
              {isAdmin && <input type="checkbox" aria-label={`Select enquiry from ${e.name}`} checked={picked.includes(e.id)} onChange={() => toggleOne(e.id)} className="mt-1.5 h-4 w-4 shrink-0 accent-red-600" />}
              <div className="mr-auto">
                <p className="font-semibold text-gray-800">{e.name}{e.company ? ` · ${e.company}` : ''}</p>
                <p className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleString('en-NG')} · {e.kind}{e.productName ? ` · ${e.productName}` : ''}</p>
              </div>
              <StatusBadge status={e.status} />
            </div>
            <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{e.message}</p>
            {e.quantity && <p className="text-sm text-gray-500 mt-1">Quantity: {e.quantity}</p>}
            {(e.utmSource || e.utmCampaign) && <p className="text-xs text-gray-400 mt-2">Source: {[e.utmSource, e.utmMedium, e.utmCampaign].filter(Boolean).join(' / ')}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              <a className={btn} href={telLink(e.phone)}>Call {e.phone}</a>
              <a className={btn} href={`https://wa.me/${waNumber(e.phone)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              {e.email && <a className={btn} href={`mailto:${e.email}`}>Email</a>}
              <button className={btn} onClick={() => toggle(e)}>{e.status === 'NEW' ? 'Mark handled' : 'Reopen'}</button>
              {isAdmin && (confirm === e.id
                ? <span className="inline-flex items-center gap-2"><span className="text-sm text-red-600">Delete permanently?</span><button className={btnDanger} disabled={busy} onClick={() => remove([e.id])}>{busy ? 'Deleting…' : 'Yes, delete'}</button><button className={btn} onClick={() => setConfirm(null)}>Cancel</button></span>
                : <button className={btnDanger} onClick={() => setConfirm(e.id)}>Delete</button>)}
            </div>
          </div>
        ))}
      </div>
      {data && <Pager total={data.total} offset={offset} limit={LIMIT} onChange={setOffset} />}
    </div>
  )
}
