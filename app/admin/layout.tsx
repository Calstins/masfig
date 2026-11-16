'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Settings,
  Image,
  Grid3X3,
  BarChart3,
  Package,
  FolderOpen,
  Truck,
  Footprints,
  Palette,
  Images as ImagesIcon,
  Tags,
  Newspaper,
  GalleryHorizontal,
  Share2,
  Activity,
  Inbox,
  Users as UsersIcon,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { fetchMe, logout } from '@/lib/auth'
import type { AuthUser } from '@/lib/types'
import { AdminUserContext } from '@/components/admin/user-context'

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard; adminOnly?: boolean }
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Categories', href: '/admin/categories', icon: Tags },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Blog', href: '/admin/posts', icon: Newspaper },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { label: 'Media Library', href: '/admin/media', icon: ImagesIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
  { label: 'Hero slides', href: '/admin/hero-slides', icon: GalleryHorizontal, adminOnly: true },
  { label: 'Tracking', href: '/admin/tracking', icon: Activity, adminOnly: true },
  { label: 'Facebook feed', href: '/admin/social', icon: Share2, adminOnly: true },
  { label: 'Hero text (fallback)', href: '/admin/hero', icon: Image, adminOnly: true },
  { label: 'Equipment Grid', href: '/admin/equipment-grid', icon: Grid3X3, adminOnly: true },
  { label: 'Stats', href: '/admin/stats', icon: BarChart3, adminOnly: true },
  { label: 'Equipment Showcase', href: '/admin/showcase', icon: Package, adminOnly: true },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen, adminOnly: true },
  { label: 'Delivery Process', href: '/admin/delivery', icon: Truck, adminOnly: true },
  { label: 'Footer', href: '/admin/footer', icon: Footprints, adminOnly: true },
  { label: 'Theme', href: '/admin/theme', icon: Palette, adminOnly: true },
  { label: 'Users', href: '/admin/users', icon: UsersIcon, adminOnly: true },
  { label: 'My account', href: '/admin/account', icon: UserCog },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isLoginPage = pathname?.startsWith('/admin/login')

  useEffect(() => {
    if (isLoginPage) return
    let cancelled = false
    fetchMe().then((u) => {
      if (cancelled) return
      setUser(u)
      setChecking(false)
      if (!u) router.push('/admin/login')
      else if (u.mustChangePassword && !pathname?.startsWith('/admin/account')) router.push('/admin/account')
    })
    return () => { cancelled = true }
  }, [pathname, router, isLoginPage])

  if (isLoginPage) {
    return <div className="text-gray-900 bg-gray-50 min-h-screen">{children}</div>
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Verifying session...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Redirecting to login...</span>
        </div>
      </div>
    )
  }

  async function handleLogout() {
    await logout()
    router.push('/admin/login')
  }

  return (
    <div className="h-dvh overflow-hidden flex bg-gray-50 text-gray-900">
      {/* Sidebar: fixed in place, only its menu list scrolls if it is taller than the screen */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } h-dvh shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                M
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm block leading-tight">MASFIG</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Admin Panel</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors ml-auto"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.filter((i) => !i.adminOnly || user.role === 'ADMIN').map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname === item.href + '/'
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-brand-50 text-primary font-semibold shadow-sm border border-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title={sidebarOpen ? undefined : item.label}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          {sidebarOpen && <p className="px-3 pb-2 text-xs text-gray-400 truncate" title={user.email}>{user.name} · {user.role === 'ADMIN' ? 'Admin' : 'Editor'}</p>}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 w-full transition-all duration-200"
            title={sidebarOpen ? undefined : 'Logout'}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-dvh overflow-y-auto overscroll-contain">
        <div className="max-w-5xl mx-auto px-8 py-10"><AdminUserContext.Provider value={user}>{children}</AdminUserContext.Provider></div>
      </main>
    </div>
  )
}
