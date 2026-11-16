import * as Lucide from 'lucide-react'
import type { DeliveryProcessData } from '@/lib/types'
import { Reveal } from './reveal'

function Icon({ name, className }: { name: string; className?: string }) {
  const C = ((Lucide as unknown as Record<string, Lucide.LucideIcon>)[name] ?? Lucide.Package)
  return <C className={className} />
}

export function DeliveryProcess({ data }: { data: DeliveryProcessData }) {
  return (
    <section id="delivery" className="section-pad relative overflow-hidden">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{data.header.badge}</p>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">{data.header.title}</h2>
          <p className="mt-4 text-lg text-ink-soft">{data.header.description}</p>
        </Reveal>
        <ol className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
          {data.steps.map((s, i) => (
            <li key={i}>
              <Reveal delay={i * 110} className="relative h-full rounded-3xl border border-border bg-white p-7">
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30"><Icon name={s.icon} className="h-7 w-7" /></span>
                <span className="absolute right-6 top-5 font-[family-name:var(--font-display)] text-5xl font-extrabold text-primary/10">0{i + 1}</span>
                <h3 className="mt-6 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-ink-soft">{s.description}</p>
                {s.details.length > 0 && <ul className="mt-4 space-y-2 text-sm text-ink-soft">{s.details.map((d) => <li key={d} className="flex gap-2"><Lucide.Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{d}</li>)}</ul>}
              </Reveal>
            </li>
          ))}
        </ol>
        {data.features.length > 0 && (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.features.map((f, i) => (
              <li key={i}><Reveal delay={i * 80} className="flex gap-4 rounded-2xl bg-surface p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary"><Icon name={f.icon} className="h-5 w-5" /></span>
                <div><h3 className="font-bold text-ink">{f.title}</h3><p className="mt-1 text-sm text-ink-soft">{f.description}</p></div>
              </Reveal></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
