import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StickyContact } from '@/components/sticky-contact'
import { ScrollProgress } from '@/components/scroll-progress'
import { getSiteData } from '@/lib/server-data'

export async function PageShell({ children }: { children: React.ReactNode }) {
  const { settings, footer } = await getSiteData()
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar settings={settings} />
      <main className="pt-[4.5rem]">{children}</main>
      <Footer data={footer} settings={settings} />
      <StickyContact phone={settings.phone1} whatsapp={settings.whatsapp} />
    </div>
  )
}
