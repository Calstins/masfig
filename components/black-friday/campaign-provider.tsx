'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { campaignStatus, type CampaignProduct, type CampaignStatus } from './campaign-data'

interface Ctx { product: CampaignProduct; whatsapp: string; status: CampaignStatus; qty: number; setQty: (n: number) => void }
const C = createContext<Ctx | null>(null)

export function useCampaign(): Ctx {
  const v = useContext(C)
  if (!v) throw new Error('useCampaign must be used inside CampaignProvider')
  return v
}

/**
 * Shares the live campaign status and the chosen quantity with every CTA on the page. The status starts as "active" so the
 * server HTML matches the first client render, then the real clock takes over (and re-checks every second, so an offer that
 * expires while the page is open switches to the "ended" state without a reload).
 */
export function CampaignProvider({ product, whatsapp, children }: { product: CampaignProduct; whatsapp: string; children: ReactNode }) {
  const [status, setStatus] = useState<CampaignStatus>('active')
  const [qty, setQty] = useState<number>(product.minQty)
  useEffect(() => {
    const tick = () => setStatus(campaignStatus(Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const value = useMemo(() => ({ product, whatsapp, status, qty, setQty }), [product, whatsapp, status, qty])
  return <C.Provider value={value}>{children}</C.Provider>
}
