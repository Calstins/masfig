'use client'

import { FAQ, type CampaignProduct } from './campaign-data'
import { useCampaign } from './campaign-provider'

export function CampaignFaq({ p }: { p: CampaignProduct }) {
  const ended = useCampaign().status === 'ended'
  return (
    <section className="bg-surface py-16 md:py-20" aria-labelledby="faq-heading">
      <div className="container-x max-w-3xl">
        <h2 id="faq-heading" className="text-3xl font-extrabold text-ink">Questions about this offer</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
          {FAQ.map((f) => (
            <details key={f.question} className="group p-5">
              <summary className="cursor-pointer list-none font-bold text-ink marker:hidden [&::-webkit-details-marker]:hidden">{f.question}</summary>
              <p className="mt-2 text-ink-soft">{f.answer(p, ended)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
