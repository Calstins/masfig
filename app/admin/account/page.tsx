'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FormSection, Field, Input, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { btnPrimary } from '@/components/admin/ui'
import { useAdminUser } from '@/components/admin/user-context'
import { api } from '@/lib/admin-api'
import { fetchMe } from '@/lib/auth'

export default function AccountPage() {
  const me = useAdminUser()
  const router = useRouter()
  const [f, setF] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault(); setMsg(null)
    if (f.newPassword !== f.confirm) { setMsg({ text: 'The new passwords do not match', type: 'error' }); return }
    setBusy(true)
    try {
      await api('/auth/change-password', { json: { currentPassword: f.currentPassword, newPassword: f.newPassword } })
      setMsg({ text: 'Password changed. Other devices were signed out.', type: 'success' })
      setF({ currentPassword: '', newPassword: '', confirm: '' })
      await fetchMe()
      if (me?.mustChangePassword) window.location.assign('/admin/')
      else router.refresh()
    } catch (x) { setMsg({ text: (x as Error).message, type: 'error' }) } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-xl">
      <PageHeader title="My account" description={me ? `${me.name} · ${me.email} · ${me.role === 'ADMIN' ? 'Admin' : 'Editor'}` : undefined} />
      {me?.mustChangePassword && <SaveMessage message="You must choose a new password before you can use the admin panel." type="error" />}
      <FormSection label="Change password">
        <Field label="Current password"><Input type="password" autoComplete="current-password" value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} required /></Field>
        <Field label="New password" hint="At least 10 characters."><Input type="password" autoComplete="new-password" minLength={10} value={f.newPassword} onChange={(e) => setF({ ...f, newPassword: e.target.value })} required /></Field>
        <Field label="Confirm new password"><Input type="password" autoComplete="new-password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} required /></Field>
        {msg && <SaveMessage message={msg.text} type={msg.type} />}
        <button className={btnPrimary} disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
      </FormSection>
    </form>
  )
}
