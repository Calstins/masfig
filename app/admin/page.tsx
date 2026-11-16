import Link from 'next/link'
import { Settings, Image, Grid3X3, BarChart3, Package, FolderOpen, Truck, Footprints, Palette, Images as ImagesIcon } from 'lucide-react'

const sections = [
  { label: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Site name, contact info, copyright', color: 'from-violet-500 to-purple-500' },
  { label: 'Hero', href: '/admin/hero', icon: Image, desc: 'Headline, badge, CTAs, trust badges', color: 'from-blue-500 to-cyan-500' },
  { label: 'Equipment Grid', href: '/admin/equipment-grid', icon: Grid3X3, desc: 'Category cards with stats & features', color: 'from-emerald-500 to-teal-500' },
  { label: 'Stats', href: '/admin/stats', icon: BarChart3, desc: 'Animated counter numbers', color: 'from-rose-500 to-pink-500' },
  { label: 'Showcase', href: '/admin/showcase', icon: Package, desc: 'Product catalog with specs', color: 'from-primary to-primary' },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen, desc: 'Case studies & testimonials', color: 'from-indigo-500 to-blue-500' },
  { label: 'Delivery', href: '/admin/delivery', icon: Truck, desc: 'Delivery steps & service features', color: 'from-cyan-500 to-teal-500' },
  { label: 'Footer', href: '/admin/footer', icon: Footprints, desc: 'CTA, quick links, services', color: 'from-gray-600 to-gray-500' },
  { label: 'Theme', href: '/admin/theme', icon: Palette, desc: 'Global color scheme (CSS variables)', color: 'from-pink-500 to-rose-500' },
  { label: 'Media Library', href: '/admin/media', icon: ImagesIcon, desc: 'Upload & manage images', color: 'from-primary to-primary' },
]

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage every section of your MASFIG LTD website from one place.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Sections', value: '8', sub: 'editable' },
          { label: 'Admin Tools', value: '2', sub: 'theme + media' },
          { label: 'Storage', value: 'PostgreSQL', sub: 'Neon database' },
          { label: 'Auth', value: 'Secure', sub: 'Signed-in sessions' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Section Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group block bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{s.label}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{s.desc}</p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-primary transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className="mt-10 p-4 bg-brand-50 border border-primary rounded-xl">
        <p className="text-sm text-primary">
          <span className="font-semibold">Tip:</span> Changes are saved straight away. The public site rebuilds automatically after you publish, and updates appear within a few minutes.
        </p>
      </div>
    </div>
  )
}