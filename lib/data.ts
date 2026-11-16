import { apiServerFetch } from './api'

export const VALID_SECTIONS = [
  'settings',
  'hero',
  'equipment-grid',
  'stats',
  'showcase',
  'projects',
  'delivery',
  'footer',
] as const

export type SectionSlug = (typeof VALID_SECTIONS)[number]

const sectionMap: Record<SectionSlug, string> = {
  settings: 'settings',
  hero: 'hero',
  'equipment-grid': 'equipment-grid',
  stats: 'stats',
  showcase: 'showcase',
  projects: 'projects',
  delivery: 'delivery',
  footer: 'footer',
}

export function isValidSection(section: string): section is SectionSlug {
  return VALID_SECTIONS.includes(section as SectionSlug)
}

export function getValidSections(): string[] {
  return [...VALID_SECTIONS]
}

export async function getSectionData(section: string): Promise<unknown> {
  if (!isValidSection(section)) {
    throw new Error(`Invalid section: ${section}`)
  }
  const res = await apiServerFetch(`/sections/${sectionMap[section]}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch section '${section}' (${res.status})`)
  }
  return res.json()
}

export async function getThemeData(): Promise<Record<string, string>> {
  try {
    const res = await apiServerFetch('/theme')
    if (!res.ok) {
      return {}
    }
    return res.json()
  } catch {
    return {}
  }
}
