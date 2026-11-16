import 'server-only'
import http from 'node:http'
import https from 'node:https'
import defaultSettings from '@/data/settings.json'
import defaultHero from '@/data/hero.json'
import defaultEquipmentGrid from '@/data/equipment-grid.json'
import defaultStats from '@/data/stats.json'
import defaultShowcase from '@/data/equipment-showcase.json'
import defaultProjects from '@/data/projects.json'
import defaultDelivery from '@/data/delivery-process.json'
import defaultFooter from '@/data/footer.json'
import type {
  Catalog, SiteSettings, HeroData, EquipmentGridData, StatsData,
  EquipmentShowcaseData, ProjectsData, DeliveryProcessData, FooterData, HeroSlideData, TrackingConfig,
} from './types'
import { EMPTY_TRACKING } from './types'

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const ALLOW_FALLBACK = process.env.ALLOW_STATIC_FALLBACK === '1'

export interface SiteData {
  settings: SiteSettings
  hero: HeroData
  equipmentGrid: EquipmentGridData
  stats: StatsData
  showcase: EquipmentShowcaseData
  projects: ProjectsData
  delivery: DeliveryProcessData
  footer: FooterData
  tracking: TrackingConfig
  /** True when projects were saved in the admin (real content), false when the built-in sample is in use. */
  projectsSaved: boolean
}

const defaults: SiteData = {
  settings: defaultSettings as SiteSettings,
  hero: defaultHero as HeroData,
  equipmentGrid: defaultEquipmentGrid as EquipmentGridData,
  stats: defaultStats as StatsData,
  showcase: defaultShowcase as EquipmentShowcaseData,
  projects: defaultProjects as ProjectsData,
  delivery: defaultDelivery as DeliveryProcessData,
  footer: defaultFooter as FooterData,
  tracking: { ...EMPTY_TRACKING, gtmId: process.env.NEXT_PUBLIC_GTM_ID || '' },
  projectsSaved: false,
}

/**
 * Plain Node HTTP(S) request. Next.js patches global fetch and caches it across builds, which could
 * publish stale content after a rebuild; node:http is never cached.
 */
function getJsonOnce<T>(path: string): Promise<T> {
  const url = new URL(`${API}/api${path}`)
  const get = url.protocol === 'https:' ? https.get : http.get
  return new Promise<T>((resolve, reject) => {
    const req = get(url, { headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' }, timeout: 45000 }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => {
        if (!res.statusCode || res.statusCode >= 400) return reject(Object.assign(new Error(`API ${path} responded ${res.statusCode}`), { status: res.statusCode }))
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as T) } catch (e) { reject(e) }
      })
    })
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', reject)
  })
}

/** One request with retries: a cold database, a slow first response or a brief network hiccup should not fail a whole build. */
async function getJson<T>(path: string): Promise<T> {
  let last: unknown
  for (let attempt = 1; attempt <= 4; attempt++) {
    try { return await getJsonOnce<T>(path) } catch (e) {
      last = e
      const status = (e as { status?: number }).status
      if (status && status < 500 && status !== 429) break // a 4xx will not fix itself
      if (attempt < 4) await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
  throw last
}

/**
 * Results are kept on globalThis, so dev-server module reloads and parallel route workers in one process reuse one
 * request. A failed request is never kept: the next call tries again.
 */
const store = globalThis as typeof globalThis & { __masfigData?: Record<string, Promise<unknown>> }
function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  const cache = (store.__masfigData ??= {})
  cache[key] ??= load().catch((e) => { delete cache[key]; throw e })
  return cache[key] as Promise<T>
}

/**
 * Build-time data. If the API is unreachable the build FAILS (so a broken API can never publish an
 * empty or stale site), unless ALLOW_STATIC_FALLBACK=1 is set for local work.
 */
export function getSiteData(): Promise<SiteData> {
  return once('site:v2', async () => {
    try {
      const sections = await getJson<Array<{ slug: string; data: unknown }>>('/sections')
      const out: SiteData = { ...defaults }
      for (const { slug, data } of sections) {
        if (!data) continue
        switch (slug) {
          case 'settings': out.settings = data as SiteSettings; break
          case 'hero': out.hero = data as HeroData; break
          case 'equipment-grid': out.equipmentGrid = data as EquipmentGridData; break
          case 'stats': out.stats = data as StatsData; break
          case 'showcase': out.showcase = data as EquipmentShowcaseData; break
          case 'projects': out.projects = data as ProjectsData; out.projectsSaved = ((data as ProjectsData).items?.length ?? 0) > 0; break
          case 'delivery': out.delivery = data as DeliveryProcessData; break
          case 'footer': out.footer = data as FooterData; break
          case 'tracking': out.tracking = { ...EMPTY_TRACKING, ...(data as Partial<TrackingConfig>) }; break
        }
      }
      out.tracking = { ...EMPTY_TRACKING, ...(out.tracking ?? {}) }
      return out
    } catch (e) {
      if (ALLOW_FALLBACK) return defaults
      throw new Error(`Cannot build: MASFIG API unreachable at ${API}. Set ALLOW_STATIC_FALLBACK=1 only for local work. (${(e as Error).message})`)
    }
  })
}

const emptyCatalog: Catalog = { generatedAt: '', categories: [], products: [], posts: [] }
export function getCatalog(): Promise<Catalog> {
  return once('catalog:v2', () => getJson<Catalog>('/catalog').catch((e) => {
    if (ALLOW_FALLBACK) return emptyCatalog
    throw new Error(`Cannot build: catalog unavailable (${(e as Error).message})`)
  }))
}

/** Active hero slides for the home page carousel. An empty list means "use the plain hero". */
export function getHeroSlides(): Promise<HeroSlideData[]> {
  return once('slides:v2', () => getJson<HeroSlideData[]>('/hero-slides').catch((e) => {
    if (ALLOW_FALLBACK) return []
    throw new Error(`Cannot build: hero slides unavailable (${(e as Error).message})`)
  }))
}
