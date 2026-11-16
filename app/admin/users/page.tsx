'use client'

import { useCallback, useEffect, useState, FormEvent } from 'react'
import { FormSection, Field, Input, Select, SaveMessage, PageHeader } from '@/components/admin/form-components'
import { StatusBadge, btn, btnPrimary } from '@/components/admin/ui'
import { useAdminUser } from '@/components/admin/user-context'
import { api } from '@/lib/admin-api'

interface U { id: number; name: string; email: string; role: 'ADMIN' | 'EDITOR'; active: boolean; mustChangePassword: boolean }

export default function UsersPage() {
  const me = useAdminUser()
  const [users, setUsers] = useState<U[] | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'EDITOR' })
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [secret, setSecret] = useState<{ who: string; password: string } | null>(null)

  const load = useCallback(() => { api<U[]>('/admin/users').then(setUsers).catch((e) => setMsg({ text: e.message, type: 'error' })) }, [])
  useEffect(load, [load])

  if (me && me.role !== 'ADMIN') return <p className="text-gray-500">Only administrators can manage users.</p>

  async function create(e: FormEvent) {
    e.preventDefault(); setMsg(null)
    try {
      const r = await api<U & { temporaryPassword: string }>('/admin/users', { json: form })
      setSecret({ who: r.email, password: r.temporaryPassword }); setForm({ name: '', email: '', role: 'EDITOR' }); load()
    } catch (x) { setMsg({ text: (x as Error).message, type: 'error' }) }
  }
  async function patch(u: U, body: Partial<Pick<U, 'role' | 'active'>>) {
    setMsg(null)
    try { await api(`/admin/users/${u.id}`, { method: 'PATCH', json: body }); load() } catch (x) { setMsg({ text: (x as Error).message, type: 'error' }) }
  }
  async function reset(u: U) {
    if (!confirm(`Reset the password for ${u.email}? They will be signed out.`)) return
    try { const r = await api<{ temporaryPassword: string }>(`/admin/users/${u.id}/reset-password`, { method: 'POST', json: {} }); setSecret({ who: u.email, password: r.temporaryPassword }) }
    catch (x) { setMsg({ text: (x as Error).message, type: 'error' }) }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Admins can change everything. Editors can create and publish products, categories and blog posts, upload images and handle enquiries." />
      {secret && (
        <div className="rounded-lg border border-primary bg-brand-50 p-4 text-sm text-primary">
          <p className="font-semibold">Temporary password for {secret.who}</p>
          <p className="font-mono text-base my-2 select-all">{secret.password}</p>
          <p>Shown once only. Send it to the person privately; they must choose a new password at first sign-in.</p>
          <button className={`${btn} mt-2`} onClick={() => setSecret(null)}>I have copied it</button>
        </div>
      )}
      {msg && <SaveMessage message={msg.text} type={msg.type} />}
      <FormSection label="Team">
        <div className="divide-y divide-gray-50 -my-2">
          {!users ? <p className="text-gray-400 py-3">Loading…</p> : users.map((u) => (
            <div key={u.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-medium text-gray-800">{u.name} {u.id === me?.id && <span className="text-xs text-gray-400">(you)</span>}</p><p className="text-xs text-gray-400">{u.email}{u.mustChangePassword ? ' · must change password' : ''}</p></div>
              <div className="flex items-center gap-2">
                <StatusBadge status={u.active ? 'PUBLISHED' : 'DRAFT'} />
                <div className="w-28"><Select value={u.role} onChange={(e) => patch(u, { role: e.target.value as U['role'] })}><option value="ADMIN">Admin</option><option value="EDITOR">Editor</option></Select></div>
                <button className={btn} onClick={() => patch(u, { active: !u.active })}>{u.active ? 'Deactivate' : 'Activate'}</button>
                <button className={btn} onClick={() => reset(u)}>Reset password</button>
              </div>
            </div>
          ))}
        </div>
      </FormSection>
      <form onSubmit={create}>
        <FormSection label="Add a team member">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
            <Field label="Role"><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option></Select></Field>
          </div>
          <button className={btnPrimary}>Create user</button>
        </FormSection>
      </form>
    </div>
  )
}
