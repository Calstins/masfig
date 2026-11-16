'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Eye, RotateCcw } from 'lucide-react'
import type { Theme } from '@/lib/types'
import { apiFetch } from '@/lib/api'
import { FormSection, Field, Input, SaveButton, SaveMessage, PageHeader } from '@/components/admin/form-components'

const defaultTheme: Theme = {
  background: '#09090b',
  foreground: '#ffffff',
  card: '#0f0f12',
  card_foreground: '#ffffff',
  popover: '#1a1a1f',
  popover_foreground: '#ffffff',
  primary: '#f59e0b',
  primary_foreground: '#09090b',
  secondary: '#18181c',
  secondary_foreground: '#ffffff',
  muted: '#27272d',
  muted_foreground: '#a0a0a5',
  accent: '#f59e0b',
  accent_foreground: '#09090b',
  destructive: '#ef4444',
  ring: '#f59e0b',
}

const fields: { key: keyof Theme; label: string; hint?: string }[] = [
  { key: 'background', label: 'Background', hint: 'Page background' },
  { key: 'foreground', label: 'Foreground', hint: 'Main text color' },
  { key: 'card', label: 'Card' },
  { key: 'card_foreground', label: 'Card Foreground' },
  { key: 'popover', label: 'Popover' },
  { key: 'popover_foreground', label: 'Popover Foreground' },
  { key: 'primary', label: 'Primary', hint: 'Buttons & accents (gold)' },
  { key: 'primary_foreground', label: 'Primary Foreground' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'secondary_foreground', label: 'Secondary Foreground' },
  { key: 'muted', label: 'Muted' },
  { key: 'muted_foreground', label: 'Muted Foreground' },
  { key: 'accent', label: 'Accent' },
  { key: 'accent_foreground', label: 'Accent Foreground' },
  { key: 'destructive', label: 'Destructive' },
  { key: 'ring', label: 'Ring' },
]

export default function AdminTheme() {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    apiFetch('/theme').then((r) => r.json()).then((data) => {
      setTheme({ ...defaultTheme, ...data })
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage('')
    const res = await apiFetch('/theme', { method: 'POST', body: JSON.stringify(theme) })
    setMessage(res.ok ? 'Theme saved' : 'Error saving theme')
    setSaving(false)
  }

  function updateField(key: keyof Theme, value: string) {
    setTheme({ ...theme, [key]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Theme Customization" description="Change the color scheme. The saved theme overrides the default palette globally." />
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => { setTheme(defaultTheme); setMessage('') }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {preview ? 'Hide Preview' : 'Preview Colors'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">Color Preview</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <div
                  className="h-14 rounded-lg border border-black/5 shadow-inner"
                  style={{ backgroundColor: theme[f.key] }}
                />
                <p className="text-[11px] text-gray-500 mt-1.5 font-mono">{f.label}</p>
                <p className="text-[10px] text-gray-400 font-mono">{theme[f.key]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <FormSection label="Color Palette" badge="Hex Values">
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className="flex gap-3 items-start">
              <input
                type="color"
                value={isValidHex(theme[f.key]) ? theme[f.key] : '#f59e0b'}
                onChange={(e) => updateField(f.key, e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 bg-white cursor-pointer flex-shrink-0 mt-1"
              />
              <div className="flex-1">
                <Field label={f.label} hint={f.hint}>
                  <Input
                    value={theme[f.key]}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    className="font-mono text-xs"
                    placeholder="#rrggbb"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="flex items-center gap-4 pt-2">
        <SaveButton saving={saving} />
        <SaveMessage message={message} />
      </div>
    </form>
  )
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}