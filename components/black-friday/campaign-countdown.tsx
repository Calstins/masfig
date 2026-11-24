'use client'

import { useEffect, useState } from 'react'
import { CAMPAIGN } from './campaign-data'
import { useCampaign } from './campaign-provider'

const pad = (n: number) => String(n).padStart(2, '0')

/** Counts down to the real deadline (Africa/Lagos, 30 Nov 2026 23:59:59). Shows dashes until the browser clock is read, so server and client HTML match. */
export function CampaignCountdown({ compact = false }: { compact?: boolean }) {
  const { status } = useCampaign()
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [])

  if (status === 'ended') {
    return <p role="status" className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest text-white">Black Friday offer ended</p>
  }
  const target = Date.parse(status === 'upcoming' ? CAMPAIGN.startsAt : CAMPAIGN.endsAt)
  const left = now === null ? null : Math.max(0, target - now)
  const s = left === null ? null : Math.floor(left / 1000)
  const parts = [
    ['Days', s === null ? '--' : pad(Math.floor(s / 86400))],
    ['Hours', s === null ? '--' : pad(Math.floor((s % 86400) / 3600))],
    ['Mins', s === null ? '--' : pad(Math.floor((s % 3600) / 60))],
    ['Secs', s === null ? '--' : pad(s % 60)],
  ]
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{status === 'upcoming' ? 'Offer starts in' : 'Offer ends in'}</p>
      <div className="flex gap-2" role="timer" aria-label={s === null ? 'Countdown' : `${Math.floor(s / 86400)} days ${Math.floor((s % 86400) / 3600)} hours remaining`}>
        {parts.map(([label, v]) => (
          <div key={label} className={`flex-1 rounded-xl bg-white/10 text-center ring-1 ring-white/15 ${compact ? 'px-2 py-2' : 'px-3 py-3'}`}>
            <div className={`font-display font-extrabold tabular-nums text-white ${compact ? 'text-xl' : 'text-3xl'}`}>{v}</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
