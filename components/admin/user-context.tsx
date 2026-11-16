'use client'

import { createContext, useContext } from 'react'
import type { AuthUser } from '@/lib/types'

export const AdminUserContext = createContext<AuthUser | null>(null)
export const useAdminUser = () => useContext(AdminUserContext)
