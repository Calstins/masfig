'use client'

import { useEffect } from 'react'
import { apiFetch } from '@/lib/api'

const THEME_VAR_MAP: Record<string, string> = {
  background: '--background', foreground: '--foreground', card: '--card', card_foreground: '--card-foreground',
  popover: '--popover', popover_foreground: '--popover-foreground', primary: '--primary', primary_foreground: '--primary-foreground',
  secondary: '--secondary', secondary_foreground: '--secondary-foreground', muted: '--muted', muted_foreground: '--muted-foreground',
  accent: '--accent', accent_foreground: '--accent-foreground', destructive: '--destructive', ring: '--ring',
}

function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6)
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Lets Admin > Theme tweak the colours. The design is light-only, so a dark saved theme
 * (such as the old imported one) is ignored instead of repainting the site.
 */
export function ThemeLoader() {
  useEffect(() => {
    apiFetch('/theme', { auth: false })
      .then((res) => (res.ok ? res.json() : null))
      .then((theme: Record<string, string> | null) => {
        if (!theme) return
        const bg = theme.background
        if (typeof bg !== 'string' || !/^#[0-9a-fA-F]{3,8}$/.test(bg) || luminance(bg) < 0.6) return
        const root = document.documentElement
        Object.entries(THEME_VAR_MAP).forEach(([key, cssVar]) => {
          const val = theme[key]
          if (typeof val === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(val)) root.style.setProperty(cssVar, val)
        })
      })
      .catch(() => {})
  }, [])
  return null
}
