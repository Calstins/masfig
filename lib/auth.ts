'use client'

import { apiFetch, clearToken, getToken, setToken } from './api'
import type { AuthUser } from './types'

export { getToken, setToken, clearToken }

let cached: AuthUser | null = null
export const getCachedUser = () => cached

/** Log in. Returns the user on success, null on failure. Throws a readable Error on throttling. */
export async function login(email: string, password: string): Promise<AuthUser | null> {
  const res = await apiFetch('/auth/login', {
    method: 'POST', auth: false, headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (res.status === 429) throw new Error('Too many attempts. Wait a minute and try again.')
  if (!res.ok) return null
  const data = await res.json()
  setToken(data.token)
  cached = (data.user as AuthUser) ?? null
  return cached
}

/** Verify the stored token with the API and return the current user (role comes from the server, not the browser). */
export async function fetchMe(): Promise<AuthUser | null> {
  if (!getToken()) return null
  const res = await apiFetch('/auth/me')
  if (!res.ok) { cached = null; return null }
  cached = (await res.json()) as AuthUser
  return cached
}

export async function isAuthenticated(): Promise<boolean> {
  return (await fetchMe()) !== null
}

export async function logout(): Promise<void> {
  try { await apiFetch('/auth/logout', { method: 'POST' }) } catch { /* clear local token regardless */ }
  clearToken()
  cached = null
}
