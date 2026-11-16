import type { SiteData } from './server-data'
import type { DeliveryProcessData, EquipmentGridData, HeroData } from './types'

const NUMERIC_CLAIM = /\d|%|24\/7|gps|insur|guarantee|certified/i

/**
 * Until MASFIG supplies evidence, figures and guarantees are hidden from the public site.
 * Turn them back on in Admin > Settings > "Show unverified claims" once verified.
 */
export function withoutUnverifiedClaims(d: SiteData): { data: SiteData; showStats: boolean; showProjects: boolean } {
  const hero: HeroData = {
    ...d.hero,
    trustBadges: [],
    visual: { ...d.hero.visual, chipValue: '', chipLabel: '' },
    floatingCards: d.hero.floatingCards.filter((c) => !NUMERIC_CLAIM.test(`${c.value} ${c.subtext}`)),
  }
  const equipmentGrid: EquipmentGridData = { ...d.equipmentGrid, items: d.equipmentGrid.items.map((i) => ({ ...i, stats: [] })) }
  const delivery: DeliveryProcessData = {
    ...d.delivery,
    steps: d.delivery.steps.map((s) => ({ ...s, details: s.details.filter((x) => !NUMERIC_CLAIM.test(x)) })),
    features: d.delivery.features.filter((f) => !NUMERIC_CLAIM.test(`${f.title} ${f.description}`)),
  }
  return { data: { ...d, hero, equipmentGrid, delivery }, showStats: false, showProjects: d.projectsSaved }
}
