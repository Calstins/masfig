import { PageShell } from './page-shell'
import { PageHeader } from './page-header'
import { JsonLd } from './seo/json-ld'
import { breadcrumbLd } from '@/lib/schema'

export const LEGAL_UPDATED = '16 November 2026'

export async function LegalPage({ title, path, intro, children }: { title: string; path: string; intro: string; children: React.ReactNode }) {
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: title, path }])} />
      <PageHeader crumbs={[{ name: 'Home', path: '/' }, { name: title }]} title={title}>{intro}</PageHeader>
      <div className="container-x section-pad">
        <article className="prose-legal mx-auto max-w-3xl space-y-8 text-ink-soft [&_a]:text-primary [&_a]:underline [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          <p className="text-sm">Last updated: {LEGAL_UPDATED}</p>
          {children}
        </article>
      </div>
    </PageShell>
  )
}
