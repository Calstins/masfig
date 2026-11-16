'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, Trash2, Copy, Check } from 'lucide-react'
import type { MediaItem } from '@/lib/types'
import { apiFetch } from '@/lib/api'
import { PageHeader } from '@/components/admin/form-components'

const MAX_BYTES = 4 * 1024 * 1024

/** Shrinks photos larger than 4 MB in the browser (the server hard-limits uploads to 4 MB). GIFs are sent as-is. */
async function shrink(file: File): Promise<File> {
  if (file.size <= MAX_BYTES || file.type === 'image/gif' || !file.type.startsWith('image/')) return file
  try {
    const bmp = await createImageBitmap(file)
    for (const scale of [1, 0.75, 0.55, 0.4]) {
      const longest = Math.min(2400, Math.max(bmp.width, bmp.height)) * scale
      const ratio = Math.min(1, longest / Math.max(bmp.width, bmp.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(bmp.width * ratio); canvas.height = Math.round(bmp.height * ratio)
      canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.85))
      if (blob && blob.size <= MAX_BYTES) return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
    }
  } catch { /* fall through and let the server reject it */ }
  return file
}

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    apiFetch('/media').then(async (res) => {
      if (!res.ok || cancelled) return
      const items = await res.json() as MediaItem[]
      if (!cancelled) setItems(items)
    })
    return () => { cancelled = true }
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || [])
    if (picked.length === 0) return
    setUploading(true); setMessage('')
    const files = await Promise.all(picked.map(shrink))
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const res = await apiFetch('/media', { method: 'POST', auth: true, body: form })
    if (res.ok) {
      const result = await res.json()
      if (result.media) {
        setItems((prev) => [...result.media, ...prev])
        const failed = result.errors?.length || 0
        setMessage(failed > 0
          ? `Uploaded ${result.media.length} file(s), ${failed} failed (unsupported type or too large)`
          : `Uploaded ${result.media.length} file(s)`)
      } else {
        setItems((prev) => [result, ...prev])
        setMessage(`Uploaded ${result.filename}`)
      }
    } else if (res.status === 422) {
      setMessage('Upload rejected — allowed: jpg, jpeg, png, gif, webp (max 4 MB each after automatic shrinking, up to 10 files)')
    } else {
      setMessage('Upload failed — please try again')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(id: number) {
    setDeleting(id); setMessage('')
    const res = await apiFetch(`/media/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m.id !== id))
      setMessage('File deleted')
    } else if (res.status === 409) {
      setMessage('This image is used by a product, category, post or the site settings. Remove it from there first.')
    } else if (res.status === 403) {
      setMessage('You can only delete images you uploaded yourself.')
    } else {
      setMessage('Delete failed')
    }
    setDeleting(null)
  }

  async function copyUrl(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      setMessage('Copy failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Media Library" description="Upload images to use across the site. Photos are converted to web-friendly sizes automatically." />
        <div className="flex-shrink-0">
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-semibold text-sm shadow-sm shadow-amber-200/50 hover:shadow-md transition-all duration-200 cursor-pointer">
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Images
              </>
            )}
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-lg text-sm bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {message}
        </div>
      )}

      {items.length === 0 && !uploading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 mx-auto mb-4 flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">No media yet. Upload your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-700 truncate" title={item.filename}>{item.filename}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatBytes(item.size)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => copyUrl(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-[11px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-red-100 text-red-500 text-[11px] font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}