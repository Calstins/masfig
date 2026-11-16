'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Input, Textarea } from './form-components'
import { btn } from './ui'

export type FaqDraft = { question: string; answer: string }

export function FaqEditor({ faqs, onChange }: { faqs: FaqDraft[]; onChange: (f: FaqDraft[]) => void }) {
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-lg border border-gray-100 p-3 space-y-2 bg-gray-50/50">
          <Input value={f.question} placeholder="Question" onChange={(e) => onChange(faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} />
          <Textarea value={f.answer} rows={3} placeholder="Answer (must be true and specific to this item)" onChange={(e) => onChange(faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} />
          <button type="button" className="text-xs text-red-500 inline-flex items-center gap-1" onClick={() => onChange(faqs.filter((_, j) => j !== i))}><Trash2 className="w-3 h-3" /> Remove</button>
        </div>
      ))}
      <button type="button" className={btn} onClick={() => onChange([...faqs, { question: '', answer: '' }])}><Plus className="w-4 h-4" /> Add FAQ</button>
    </div>
  )
}

export function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const n = value.length
  const ok = n >= min && n <= max
  return <span className={`text-xs ${ok ? 'text-emerald-600' : 'text-primary'}`}>{n} characters (aim for {min}–{max})</span>
}
