'use client'

import { useCallback, useEffect, useState } from 'react'
import { PageHeader, Select, SaveMessage } from '@/components/admin/form-components'
import { Pager, StatusBadge, btn } from '@/components/admin/ui'
import { api } from '@/lib/admin-api'
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

  const load = useCallback(() => {
    const p = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) }); if (status) p.set('status', status)
    api<{ items: Enquiry[]; total: number }>(`/admin/enquiries?${p}`).then(setData).catch((e) => { setErr(e.message); setData({ items: [], total: 0 }) })
  }, [status, offset])
  useEffect(load, [load])

  async function toggle(e: Enquiry) {
    try { await api(`/admin/enquiries/${e.id}/handled`, { method: 'POST', json: { handled: e.status === 'NEW' } }); load() } catch (x) { setErr((x as Error).message) }
  }

  return (
    <div>
      <PageHeader title="Enquiries" description="Quote requests from the website. Reply quickly — by phone or WhatsApp — then mark as handled." />
      <div className="w-48 mb-4"><Select value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0) }}><option value="NEW">New</option><option value="HANDLED">Handled</option><option value="">All</option></Select></div>
      {err && <SaveMessage message={err} type="error" />}
      <div className="space-y-3">
        {!data ? <p className="text-gray-400">Loading…</p> : data.items.length === 0 ? <p className="text-gray-500 text-sm">Nothing here.</p> : data.items.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
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
            </div>
          </div>
        ))}
      </div>
      {data && <Pager total={data.total} offset={offset} limit={LIMIT} onChange={setOffset} />}
    </div>
  )
}
