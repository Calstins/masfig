import Link from 'next/link'
import * as Lucide from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import type { EquipmentGridData } from '@/lib/types'
import { slugify } from '@/lib/slug'
import { Reveal } from './reveal'

function Icon({ name }: { name: string }) {
  const C = ((Lucide as unknown as Record<string, Lucide.LucideIcon>)[name] ?? Lucide.Package)
  return <C className="h-6 w-6" />
}

export function EquipmentGrid({ data, categorySlugs }: { data: EquipmentGridData; categorySlugs: string[] }) {
  return (
    <section id="equipment" className="section-pad">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{data.header.badge}</p>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">{data.header.title} <span className="text-primary">{data.header.titleGradient}</span></h2>
          <p className="mt-4 text-lg text-ink-soft">{data.header.description}</p>
        </Reveal>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((it, i) => {
            const slug = slugify(it.title)
            const href = categorySlugs.includes(slug) ? `/products/${slug}/` : '/products/'
            return (
              <li key={it.id}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <Link href={href} className="card-hover group flex h-full flex-col rounded-3xl border border-border bg-white p-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white"><Icon name={it.icon} /></span>
                    <h3 className="mt-6 text-xl font-bold text-ink">{it.title}</h3>
                    <p className="mt-2 flex-1 text-ink-soft">{it.description}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">View range <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
