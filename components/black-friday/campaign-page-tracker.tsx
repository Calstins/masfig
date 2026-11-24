'use client'

import { useEffect } from 'react'
import { track } from '@/lib/track'
import { CAMPAIGN } from './campaign-data'
import { useCampaign } from './campaign-provider'

let last = ''

/** One black_friday_page_view and one product_view per visit to a campaign page (guarded against React's double effect). */
export function CampaignPageTracker() {
  const { product } = useCampaign()
  useEffect(() => {
    const key = `${product.key}:${window.location.pathname}`
    if (last === key) return
    last = key
    const params = { campaign: CAMPAIGN.id, product: product.trackingId, product_name: product.name }
    track('black_friday_page_view', params)
    track('product_view', params)
  }, [product])
  return null
}
