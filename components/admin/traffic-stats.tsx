'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/admin-api'

interface Totals { pageviews: number; visitors: number; whatsapp: number; calls: number; emails: number; productViews: number; quotes: number }
interface Row { label: string; count: number; visitors?: number }
interface Day { date: string; pageviews: number; visitors: number; whatsapp: number; calls: number; quotes: number }
interface Stats { days: number; totals: Totals; previous: Totals; daily: Day[]; topPages: Row[]; topProducts: Row[]; whatsappBy: Row[]; callsBy: Row[]; sources: Row[]; devices: Row[] }

const RANGES = [{ d: 1, t: 'Last 24 hours' }, { d: 7, t: '7 days' }, { d: 30, t: '30 days' }, { d: 90, t: '90 days' }]
const METRICS: { key: keyof Omit<Day, 'date'>; t: string }[] = [
  { key: 'pageviews', t: 'Page views' }, { key: 'visitors', t: 'Visitors' }, { key: 'whatsapp', t: 'WhatsApp clicks' }, { key: 'calls', t: 'Phone calls' }, { key: 'quotes', t: 'Quote requests' },
]
const WHERE: Record<string, string> = { navbar: 'Menu bar button', sticky: 'Floating button', footer: 'Footer', header: 'Header', product: 'Product page button', page: 'Links inside pages' }
const nice = (l: string) => WHERE[l] ?? l
const SOURCE = (l: string) => (l === 'direct' ? 'Direct (typed address or bookmark)' : l)
const n = (v: number) => v.toLocaleString('en-NG')

function change(now: number, before: number) {
  if (!before && !now) return null
  if (!before) return { text: 'new', up: true }
  const p = Math.round(((now - before) / before) * 100)
  return { text: `${p > 0 ? '+' : ''}${p}%`, up: p >= 0 }
}

function Tile({ label, value, prev, hint }: { label: string; value: number; prev: number; hint?: string }) {
  const c = change(value, prev)
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4" title={hint}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{n(value)}</p>
      <p className="mt-1 text-xs text-gray-400">{c ? <><span className={c.up ? 'text-emerald-600' : 'text-red-500'}>{c.text}</span> vs before</> : 'no change'}</p>
    </div>
  )
}

function Table({ title, rows, fmt = (l: string) => l, empty = 'Nothing yet.', col = 'Count' }: { title: string; rows: Row[]; fmt?: (l: string) => string; empty?: string; col?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-gray-800">{title}</p><p className="text-xs text-gray-400">{col}</p></div>
      {rows.length === 0 ? <p className="text-sm text-gray-400">{empty}</p> : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex items-center justify-between gap-3"><span className="truncate text-gray-700" title={r.label}>{fmt(r.label)}</span><span className="shrink-0 font-medium text-gray-800">{n(r.count)}</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.max(3, (r.count / max) * 100)}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function TrafficStats() {
  const [days, setDays] = useState(30)
  const [metric, setMetric] = useState<keyof Omit<Day, 'date'>>('pageviews')
  const [data, setData] = useState<Stats | null>(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true); setErr('')
    api<Stats>(`/admin/analytics?days=${days}`).then(setData).catch((e) => setErr(e.message || 'Could not load statistics')).finally(() => setLoading(false))
  }, [days])
  useEffect(load, [load])

  const chart = useMemo(() => {
    const series = data?.daily ?? []
    const max = Math.max(1, ...series.map((d) => d[metric]))
    return { series, max }
  }, [data, metric])

  const t = data?.totals
  const p = data?.previous
  const empty = t && t.pageviews + t.whatsapp + t.calls + t.quotes + t.productViews === 0

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Website statistics</h2>
          <p className="text-sm text-gray-500">MASFIG&apos;s own counts, from the site itself. No cookies, no personal details stored.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 bg-white text-sm">
            {RANGES.map((r) => <button key={r.d} type="button" onClick={() => setDays(r.d)} className={`px-3 py-1.5 ${days === r.d ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{r.t}</button>)}
          </div>
          <button type="button" onClick={load} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50" disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
        </div>
      </div>

      {err && <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{err}</p>}
      {!data && !err && <div className="h-40 animate-pulse rounded-xl bg-gray-100" />}

      {data && t && p && (
        <>
          {empty && <p className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-700">No visits recorded in this period yet. Counting starts after the updated site is live, and visits from a browser where you are signed in to this admin are not counted.</p>}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Tile label="Page views" value={t.pageviews} prev={p.pageviews} hint="Every page opened" />
            <Tile label="Visitors" value={t.visitors} prev={p.visitors} hint="Different people per day. Someone who returns on another day counts again." />
            <Tile label="WhatsApp clicks" value={t.whatsapp} prev={p.whatsapp} />
            <Tile label="Phone calls" value={t.calls} prev={p.calls} hint="Taps on a phone number" />
            <Tile label="Quote requests" value={t.quotes} prev={p.quotes} hint="Enquiries received through the quote form" />
            <Tile label="Product views" value={t.productViews} prev={p.productViews} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4"><p className="text-xs text-gray-400">Quote requests per 100 visitors</p><p className="mt-1 text-xl font-bold text-gray-800">{t.visitors ? ((t.quotes / t.visitors) * 100).toFixed(1) : '0.0'}</p></div>
            <div className="rounded-xl border border-gray-100 bg-white p-4"><p className="text-xs text-gray-400">People who made contact (WhatsApp + calls + quotes) per 100 visitors</p><p className="mt-1 text-xl font-bold text-gray-800">{t.visitors ? (((t.whatsapp + t.calls + t.quotes) / t.visitors) * 100).toFixed(1) : '0.0'}</p></div>
            <div className="rounded-xl border border-gray-100 bg-white p-4"><p className="text-xs text-gray-400">Email link clicks</p><p className="mt-1 text-xl font-bold text-gray-800">{n(t.emails)}</p></div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {METRICS.map((m) => <button key={m.key} type="button" onClick={() => setMetric(m.key)} className={`rounded-full border px-3 py-1 text-xs font-medium ${metric === m.key ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{m.t}</button>)}
            </div>
            <div className="flex h-44 items-end gap-[2px]" role="img" aria-label={`Daily ${METRICS.find((m) => m.key === metric)?.t}`}>
              {chart.series.map((d) => (
                <div key={d.date} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end" title={`${d.date}: ${n(d[metric])}`}>
                  <div className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary" style={{ height: d[metric] ? `${Math.max(3, (d[metric] / chart.max) * 100)}%` : '2px', opacity: d[metric] ? 1 : 0.25 }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400"><span>{chart.series[0]?.date}</span><span>Highest day: {n(chart.max === 1 && !chart.series.some((d) => d[metric]) ? 0 : chart.max)}</span><span>{chart.series[chart.series.length - 1]?.date}</span></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Table title="Most visited pages" rows={data.topPages} col="Views" />
            <Table title="Most viewed products" rows={data.topProducts} col="Views" empty="No product views yet." />
            <Table title="WhatsApp clicks came from" rows={data.whatsappBy} fmt={nice} empty="No WhatsApp clicks yet." col="Clicks" />
            <Table title="Phone calls came from" rows={data.callsBy} fmt={nice} empty="No call taps yet." col="Taps" />
            <Table title="Where visitors come from" rows={data.sources} fmt={SOURCE} col="Page views" />
            <Table title="Devices" rows={data.devices} fmt={(l) => l[0].toUpperCase() + l.slice(1)} col="Page views" />
          </div>

          <p className="text-xs text-gray-400">Not counted: visits from a browser signed in to this admin, visitors who send &quot;Do Not Track&quot;, and known bots. Quote requests are the enquiries you actually received, so they are always exact. Figures update the moment you press Refresh.</p>
        </>
      )}
    </section>
  )
}
