import { Check } from 'lucide-react'
import type { CampaignProduct } from './campaign-data'
import { ActiveOnly } from './active-only'
import { Reveal } from '@/components/reveal'

export function ProductBenefits({ p, description, facts, children }: { p: CampaignProduct; description: string; facts: [string, string][]; children?: React.ReactNode }) {
  return (
    <section id="details" className="scroll-mt-24 bg-white py-16 md:py-24" aria-labelledby="benefits-heading">
      <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow">About the {p.name}</p>
          <h2 id="benefits-heading" className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{p.tagline}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{description}</p>
          {facts.length > 0 && (
            <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {facts.map(([k, v]) => (
                <div key={k} className="border-b border-border pb-2"><dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{k}</dt><dd className="font-semibold text-ink">{v}</dd></div>
              ))}
            </dl>
          )}
          <div className="mt-8">{children}</div>
        </div>
        <ul className="space-y-4">
          {p.benefits.map((b, i) => {
            const li = (
            <Reveal as="li" key={b.title} delay={i * 90} from="right" className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"><Check aria-hidden className="h-4 w-4" /></span>
              <div><h3 className="text-lg font-bold text-ink">{b.title}</h3><p className="mt-1 text-ink-soft">{b.text}</p></div>
            </Reveal>
            )
            return b.promo ? <ActiveOnly key={b.title}>{li}</ActiveOnly> : li
          })}
        </ul>
      </div>
    </section>
  )
}
