import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.path ? <Link href={it.path} className="transition-colors hover:text-primary">{it.name}</Link> : <span className="font-medium text-ink" aria-current="page">{it.name}</span>}
            {i < items.length - 1 && <ChevronRight aria-hidden className="h-3.5 w-3.5 text-border" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
