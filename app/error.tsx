'use client'

import Link from 'next/link'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="bg-kitchen-soft bg-surface">
      <div className="container-x grid min-h-screen items-center gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">Something went wrong</p>
          <h1 className="mt-4 text-4xl font-extrabold text-ink md:text-6xl">The pot boiled over</h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">We hit an unexpected problem loading this page. Please try again, or call us and we will help directly.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => reset()} className="btn btn-primary">Try again</button>
            <Link href="/" className="btn btn-outline">Back to home</Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bg/error-kitchen.svg" alt="" className="float-slow mx-auto w-full max-w-lg" />
      </div>
    </section>
  )
}
