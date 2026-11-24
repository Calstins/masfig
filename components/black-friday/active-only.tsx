'use client'

import { useCampaign } from './campaign-provider'

/** Renders its children only while the offer is live, so promotional wording disappears the moment the deadline passes. */
export function ActiveOnly({ children }: { children: React.ReactNode }) {
  return useCampaign().status === 'active' ? <>{children}</> : null
}
