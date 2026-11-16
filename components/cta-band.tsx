import { MessageCircle, Phone } from 'lucide-react'
import type { FooterData, SiteSettings } from '@/lib/types'
import { telLink, whatsappLink } from '@/lib/site'
import { Reveal } from './reveal'

export function CtaBand({ footer, settings }: { footer: FooterData; settings: SiteSettings }) {
  return (
    <section className="bg-kitchen-red relative overflow-hidden py-16 text-white md:py-24">
      <Reveal className="container-x relative text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-4xl md:text-5xl">{footer.cta.heading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{footer.cta.description}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={whatsappLink(settings.whatsapp, 'Hello MASFIG, I would like a quote.')} target="_blank" rel="noopener noreferrer" className="btn bg-white px-8 py-4 text-base text-primary hover:-translate-y-0.5 hover:shadow-xl"><MessageCircle className="h-5 w-5" />{footer.contactLabels.whatsappTitle}</a>
          <a href={telLink(settings.phone1)} className="btn border border-white/60 px-8 py-4 text-base text-white hover:bg-white/10"><Phone className="h-5 w-5" />{settings.phone1}</a>
        </div>
      </Reveal>
    </section>
  )
}
