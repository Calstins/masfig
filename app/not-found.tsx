import Link from 'next/link'
import { PageShell } from '@/components/page-shell'

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } }

export default function NotFound() {
  return (
    <PageShell>
      <section className="bg-kitchen-soft bg-surface">
        <div className="container-x grid min-h-[70vh] items-center gap-10 py-16 md:grid-cols-2">
          <div>
            <p className="eyebrow">Error 404</p>
            <h1 className="mt-4 text-4xl font-extrabold text-ink md:text-6xl">This page is off the menu</h1>
            <p className="mt-5 max-w-md text-lg text-ink-soft">The page you are looking for has moved or never existed. Let us get you back to the kitchen.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">Back to home</Link>
              <Link href="/products/" className="btn btn-outline">Browse products</Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bg/error-kitchen.svg" alt="" className="float-slow mx-auto w-full max-w-lg" />
        </div>
      </section>
    </PageShell>
  )
}
