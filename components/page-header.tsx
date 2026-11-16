import { Breadcrumbs } from '@/components/seo/breadcrumbs'

/** Light page banner with the kitchen line-art pattern behind the title. */
export function PageHeader({ crumbs, title, children }: { crumbs: { name: string; path?: string }[]; title: string; children?: React.ReactNode }) {
  return (
    <header className="bg-kitchen-soft border-b border-border bg-surface">
      <div className="container-x py-10 md:py-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="max-w-4xl text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-3xl text-lg text-ink-soft">{children}</div>}
      </div>
    </header>
  )
}
