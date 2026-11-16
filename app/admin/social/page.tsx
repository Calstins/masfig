'use client'

import { useEffect, useState, FormEvent } from 'react'
import { FormSection, Field, Input, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { btn, btnDanger, btnPrimary } from '@/components/admin/ui'
import { ApiError, api } from '@/lib/admin-api'
import type { FacebookFeedPost } from '@/lib/types'

interface Cfg { pageId: string; pageUrl: string; pageName: string; hasToken: boolean }

export default function SocialPage() {
  const [cfg, setCfg] = useState<Cfg | null>(null)
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [preview, setPreview] = useState<FacebookFeedPost[] | null>(null)

  useEffect(() => { api<Cfg>('/admin/integrations/facebook').then(setCfg).catch((e) => setMsg({ text: e.message, type: 'error' })) }, [])
  const fail = (e: unknown) => setMsg({ text: e instanceof ApiError ? e.message : 'Failed', type: 'error' })

  async function save(e: FormEvent) {
    e.preventDefault(); if (!cfg) return; setBusy(true); setMsg(null)
    try {
      const r = await api<Cfg>('/admin/integrations/facebook', { method: 'PUT', json: { pageId: cfg.pageId, pageUrl: cfg.pageUrl, pageName: cfg.pageName, accessToken: token || undefined } })
      setCfg(r); setToken(''); setMsg({ text: 'Saved. The feed updates on the site within a few minutes.', type: 'success' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function test() {
    setBusy(true); setMsg(null); setPreview(null)
    try {
      const r = await api<{ ok: boolean; count: number; posts: FacebookFeedPost[] }>('/admin/integrations/facebook/test', { method: 'POST', json: {} })
      setPreview(r.posts)
      setMsg(r.ok ? { text: `Connected — ${r.count} recent post${r.count === 1 ? '' : 's'} found.`, type: 'success' } : { text: 'Facebook did not return posts. Check the Page ID and that the access token has not expired.', type: 'error' })
    } catch (err) { fail(err) } finally { setBusy(false) }
  }
  async function disconnect() {
    if (!confirm('Disconnect the Facebook page? The feed column will be hidden on the site.')) return
    setBusy(true)
    try { await api('/admin/integrations/facebook', { method: 'DELETE' }); setCfg({ pageId: '', pageUrl: '', pageName: '', hasToken: false }); setPreview(null); setMsg({ text: 'Disconnected.', type: 'success' }) } catch (err) { fail(err) } finally { setBusy(false) }
  }

  if (!cfg) return <div className="text-gray-400 animate-pulse">Loading…</div>
  return (
    <form onSubmit={save} className="space-y-6">
      <PageHeader title="Facebook feed" description="Shows the four latest posts from your Facebook Page on the home page. Video posts play in a video player." />
      <FormSection label="Page details">
        <Field label="Page name" hint="Shown above the feed."><Input value={cfg.pageName} onChange={(e) => setCfg({ ...cfg, pageName: e.target.value })} placeholder="MASFIG" /></Field>
        <Field label="Page URL"><Input value={cfg.pageUrl} onChange={(e) => setCfg({ ...cfg, pageUrl: e.target.value })} placeholder="https://facebook.com/masfig" required /></Field>
        <Field label="Page ID" hint="The numeric ID: Facebook Page → About → Page transparency → Page ID."><Input value={cfg.pageId} onChange={(e) => setCfg({ ...cfg, pageId: e.target.value })} className="font-mono text-xs" required /></Field>
        <Field label="Page access token" hint={cfg.hasToken ? 'A token is saved. Leave blank to keep it, or paste a new one to replace it.' : 'Generate a long-lived Page access token in the Meta developer console (needs the pages_read_engagement permission). It is stored on the server only and never shown on the website.'}>
          <Input type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder={cfg.hasToken ? '•••••••• saved' : ''} />
        </Field>
      </FormSection>
      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <div className="flex flex-wrap gap-3">
        <button className={btnPrimary} disabled={busy}>{busy ? 'Working…' : 'Save'}</button>
        {cfg.hasToken && <button type="button" className={btn} disabled={busy} onClick={test}>Test connection</button>}
        {cfg.hasToken && <button type="button" className={btnDanger} disabled={busy} onClick={disconnect}>Disconnect</button>}
      </div>
      {preview && preview.length > 0 && (
        <FormSection label="Latest posts found">
          <ul className="divide-y divide-gray-50 text-sm">{preview.map((p) => <li key={p.id} className="py-2"><span className="text-xs text-gray-400">{p.isVideo ? 'Video · ' : ''}{p.createdTime.slice(0, 10)}</span><p className="text-gray-700 line-clamp-2">{p.message || '(no text)'}</p></li>)}</ul>
        </FormSection>
      )}
    </form>
  )
}
