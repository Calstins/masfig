'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/admin-api'
import type { MediaItem } from '@/lib/types'

export function StatusBadge({ status }: { status: 'DRAFT' | 'PUBLISHED' | 'NEW' | 'HANDLED' | string }) {
  const on = status === 'PUBLISHED' || status === 'HANDLED'
  return <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${on ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{status}</span>
}

export const btn = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50'
export const btnPrimary = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary disabled:opacity-50'
export const btnDanger = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-100 bg-white hover:bg-red-50 disabled:opacity-50'

export function MissingList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <div className="rounded-lg border border-primary bg-brand-50 px-4 py-3 text-sm text-primary">
      <p className="font-medium mb-1">Needed before this can be published:</p>
      <ul className="list-disc pl-5">{items.map((m) => <li key={m}>{m}</li>)}</ul>
    </div>
  )
}

/** Pick an uploaded image from the media library. */
export function MediaPicker({ value, onPick, onClose }: { value?: number | null; onPick: (m: MediaItem) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  useEffect(() => { api<MediaItem[]>('/media').then(setItems).catch(() => setItems([])) }, [])
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-gray-800">Choose an image</h3><button className={btn} onClick={onClose}>Close</button></div>
        {items === null ? <p className="text-gray-400">Loading…</p> : items.length === 0 ? <p className="text-gray-500 text-sm">No images yet. Upload some in the Media Library first.</p> : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {items.map((m) => (
              <button key={m.id} type="button" onClick={() => onPick(m)} className={`rounded-lg border overflow-hidden text-left ${value === m.id ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-300'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.filename} className="w-full aspect-square object-cover" />
                <span className="block text-[10px] text-gray-500 px-2 py-1 truncate">{m.filename}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Pager({ total, offset, limit, onChange }: { total: number; offset: number; limit: number; onChange: (o: number) => void }) {
  if (total <= limit) return null
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500 mt-4">
      <button className={btn} disabled={offset === 0} onClick={() => onChange(Math.max(0, offset - limit))}>Previous</button>
      <span>{offset + 1}–{Math.min(total, offset + limit)} of {total}</span>
      <button className={btn} disabled={offset + limit >= total} onClick={() => onChange(offset + limit)}>Next</button>
    </div>
  )
}
