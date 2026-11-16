'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Wind, Flame, Droplets, Zap, Settings, ArrowRight } from 'lucide-react'
import type { EquipmentShowcaseData } from '@/lib/types'

const categoryIcons: Record<string, React.ElementType> = {
  bakery: Flame,
  commercial: Wind,
  processing: Droplets,
  packaging: Zap,
  catering: Settings,
}

export function EquipmentShowcase({ data }: { data: EquipmentShowcaseData }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered =
    selectedCategory === 'all' ? data.items : data.items.filter((e) => e.category === selectedCategory)

  return (
    <section className="relative py-10 md:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block mb-4 px-4 py-2 rounded-full glass-effect border border-primary/20">
            <p className="text-sm font-medium text-primary">{data.header.badge}</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-4">
            {data.header.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.header.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12 md:mb-16">
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 md:px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary to-orange-400 text-background border-primary'
                  : 'glass-effect border-white/5 text-white hover:border-primary/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((item) => {
            const Icon = categoryIcons[item.category] || Settings
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative overflow-hidden rounded-2xl glass-effect border border-white/5 hover:border-primary/30 transition-all duration-500 card-hover cursor-pointer"
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-orange-400 text-background text-xs font-bold">
                  {item.badge}
                </div>
                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-white/20 group-hover:border-primary/50 transition-all duration-500">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                      <p className="text-sm font-semibold text-white">{item.capacity}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-xs text-muted-foreground mb-1">Power</p>
                      <p className="text-sm font-semibold text-white">{item.power}</p>
                    </div>
                  </div>
                  <div
                    className={`space-y-2 mb-6 overflow-hidden transition-all duration-500 ${
                      hoveredId === item.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-xs font-semibold text-primary">SPECIFICATIONS:</p>
                    {item.specs.map((spec, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {spec}
                      </p>
                    ))}
                    <p className="text-xs font-semibold text-primary mt-3">KEY FEATURES:</p>
                    {item.features.slice(0, 2).map((feature, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </p>
                    ))}
                  </div>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/20 to-orange-400/20 border border-primary/30 hover:border-primary/50 text-primary font-semibold text-sm transition-all duration-300 group/btn">
                    {data.detailsLabel}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 md:mt-24 text-center">
          <p className="text-muted-foreground mb-6">
            {data.bottomCta.description}
          </p>
          <a
            href={data.bottomCta.buttonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-orange-400 text-background font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            {data.bottomCta.buttonText}
          </a>
        </div>
      </div>
    </section>
  )
}
