'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { naira, type ActivityEntry, type CampaignProduct } from './campaign-data'
import { useCampaign } from './campaign-provider'

interface Item { text: string; place?: string; demo: boolean }

const FIRST_DELAY = 9_000
const VISIBLE_MS = 6_000
const GAP_MS = 30_000
const MAX_PER_SESSION = 4
const KEY = 'bf_activity'

function build(p: CampaignProduct): Item[] {
  if (p.verifiedActivity.length) return p.verifiedActivity.map((v) => ({ text: v.text, place: v.place, demo: false }))
  return p.demoActivity.map((a: ActivityEntry) => ({
    text: `${a.quantity} ${a.quantity === 1 ? p.name : p.plural} — ${naira(a.quantity * p.promoPrice)}`,
    place: a.place,
    demo: true,
  }))
}

/**
 * Slide-in "recent activity" card. Entries come from the campaign config; unless they are marked verified they are labelled
 * "Sample activity" so no demonstration order is ever presented as a real one. Appears at most MAX_PER_SESSION times per
 * visit, never repeats an entry until all have been shown, and stops for the visit once dismissed.
 */
export function PurchaseActivityToast() {
  const { product, status } = useCampaign()
  const items = useRef<Item[]>(build(product))
  const [current, setCurrent] = useState<Item | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (status !== 'active' || !items.current.length) return
    let state = { shown: 0, closed: false, order: [] as number[] }
    try { state = { ...state, ...JSON.parse(sessionStorage.getItem(KEY + product.key) || '{}') } } catch { /* storage unavailable */ }
    if (state.closed || state.shown >= MAX_PER_SESSION) return
    let t2: ReturnType<typeof setTimeout> | undefined, t3: ReturnType<typeof setTimeout> | undefined
    let dead = false

    const save = () => { try { sessionStorage.setItem(KEY + product.key, JSON.stringify(state)) } catch { /* ignore */ } }
    const next = () => {
      if (dead || state.shown >= MAX_PER_SESSION) return
      if (!state.order.length) state.order = items.current.map((_, i) => i)
      const idx = state.order.shift() as number
      state.shown += 1
      save()
      setCurrent(items.current[idx])
      setShow(true)
      t2 = setTimeout(() => { setShow(false); t3 = setTimeout(next, GAP_MS) }, VISIBLE_MS)
    }
    const t1 = setTimeout(next, FIRST_DELAY)
    return () => { dead = true; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [product.key, status])

  function close() {
    setShow(false)
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY + product.key) || '{}')
      sessionStorage.setItem(KEY + product.key, JSON.stringify({ ...s, closed: true }))
    } catch { /* ignore */ }
  }

  if (!current) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-24 left-3 z-30 w-[min(20rem,calc(100vw-1.5rem))] transition-all duration-500 motion-reduce:transition-none md:bottom-6 md:left-6 ${show ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0 motion-reduce:translate-x-0'}`}
    >
      <div className={`pointer-events-auto rounded-2xl border border-black/10 bg-white p-4 pr-10 shadow-2xl ${show ? '' : 'invisible'}`}>
        <button type="button" onClick={close} aria-label="Dismiss activity notification" className="absolute right-2 top-2 rounded-full p-1.5 text-ink-soft hover:bg-surface"><X aria-hidden className="h-4 w-4" /></button>
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{current.demo ? 'Sample activity · illustrative only' : 'Recent order activity'}</p>
        <p className="mt-1 text-sm font-bold text-ink">{current.text}</p>
        {current.place && <p className="text-xs text-ink-soft">{current.place}</p>}
        {current.demo && <p className="mt-1 text-[11px] text-ink-soft">Not a real order. Shown to illustrate bulk quantities.</p>}
      </div>
    </div>
  )
}
