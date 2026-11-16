'use client'
import { create } from 'zustand'
import { api } from '@/lib/admin-api'

export interface CategoryOption { id: number; name: string }

interface AdminStore {
  /** Category list shared by the Categories, Products and Posts screens. null = not loaded yet. */
  categories: CategoryOption[] | null
  /** Loads once, then serves the stored list instantly while quietly refreshing it. */
  loadCategories: (force?: boolean) => Promise<void>
  /** Call after any category create / edit / delete / publish so every screen sees fresh data. */
  invalidateCategories: () => void
  reset: () => void
}

let inflight: Promise<void> | null = null

export const useAdminStore = create<AdminStore>((set, get) => ({
  categories: null,
  loadCategories: (force = false) => {
    if (inflight) return inflight
    if (get().categories && !force) { // stale-while-revalidate: show what we have, refresh in the background
      inflight = api<CategoryOption[]>('/admin/categories').then((c) => set({ categories: c })).catch(() => {}).finally(() => { inflight = null })
      return inflight
    }
    inflight = api<CategoryOption[]>('/admin/categories').then((c) => set({ categories: c })).catch(() => { if (!get().categories) set({ categories: [] }) }).finally(() => { inflight = null })
    return inflight
  },
  invalidateCategories: () => { void get().loadCategories(true) },
  reset: () => set({ categories: null }),
}))
