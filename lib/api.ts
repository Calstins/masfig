const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'admin_token'

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}/api${cleanPath}`
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export interface ApiOptions extends RequestInit {
  auth?: boolean
}

/**
 * Client-side fetch wrapper that talks to the Laravel API.
 * Attaches the Bearer token automatically when `auth` is true.
 */
export async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
  const { auth = true, headers, ...rest } = options

  const token = getToken()

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  }

  if (!(finalHeaders['Content-Type']) && rest.body && typeof rest.body === 'string') {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (auth && token) {
    finalHeaders['Authorization'] = `Bearer ${token}`
  }

  return fetch(getApiUrl(path), { ...rest, headers: finalHeaders })
}

/**
 * Server-side fetch wrapper (used in server components / route handlers).
 * No token attached — used for public reads.
 */
export async function apiServerFetch(path: string): Promise<Response> {
  return fetch(getApiUrl(path), { cache: 'no-store' })
}
