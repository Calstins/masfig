'use client'

import { apiFetch } from './api'

export class ApiError extends Error {
  constructor(public status: number, message: string, public body: Record<string, unknown> = {}) {
    super(message)
  }
  get missing(): string[] { return Array.isArray(this.body.missing) ? (this.body.missing as string[]) : [] }
  get code(): string | undefined { return typeof this.body.code === 'string' ? this.body.code : undefined }
}

function describe(status: number, body: Record<string, unknown>): string {
  const details = Array.isArray(body.details) ? (body.details as { path: string; message: string }[]) : []
  if (details.length) return details.map((d) => (d.path ? `${d.path}: ${d.message}` : d.message)).join('; ')
  return typeof body.error === 'string' ? body.error : `Request failed (${status})`
}

export async function api<T = unknown>(path: string, init: { method?: string; json?: unknown } = {}): Promise<T> {
  const res = await apiFetch(path, {
    method: init.method ?? (init.json !== undefined ? 'POST' : 'GET'),
    body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
  })
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) throw new ApiError(res.status, describe(res.status, body), body)
  return body as T
}

export function rebuildNote(r: unknown): string {
  const v = (r as { rebuild?: string } | null)?.rebuild
  if (v === 'triggered') return ' Site rebuild started — changes go live in a few minutes.'
  if (v === 'failed') return ' Saved, but the site rebuild could not be started. Ask an admin to press "Rebuild site".'
  return ''
}
