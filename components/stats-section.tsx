'use client'

import { useEffect, useRef, useState } from 'react'
import type { StatsData } from '@/lib/types'

function AnimatedCounter({ targetValue, suffix }: { targetValue: number; suffix: string }) {
  const [count, setCount] = useState(targetValue)
  const counterRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (counterRef.current) {
      observer.observe(counterRef.current)
    }
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    let currentCount = 0
    const increment = targetValue / 60
    const interval = setInterval(() => {
      currentCount += increment
      if (currentCount >= targetValue) {
        setCount(targetValue)
        clearInterval(interval)
      } else {
        setCount(Math.floor(currentCount))
      }
    }, 30)
    return () => clearInterval(interval)
  }, [isVisible, targetValue])

  return (
    <div ref={counterRef} className="flex items-baseline gap-1">
      <span className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-primary via-primary to-orange-400 bg-clip-text">
        {count.toLocaleString()}
      </span>
      <span className="text-base md:text-lg text-muted-foreground">{suffix}</span>
    </div>
  )
}

export function StatsSection({ data }: { data: StatsData }) {
  return (
    <section className="relative py-10 md:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {data.items.map((stat, index) => (
            <div
              key={index}
              className="relative group p-6 md:p-8 rounded-2xl glass-effect border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl mb-4 opacity-80">{stat.icon}</div>
                <div className="mb-4">
                  <AnimatedCounter targetValue={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-orange-400 rounded-full group-hover:w-12 transition-all duration-500" />
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border border-primary/50 shadow-lg shadow-primary/20" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 md:mt-24 pt-12 border-t border-white/5 flex items-center justify-center gap-2">
          <div className="h-1 w-1 bg-primary rounded-full" />
          <p className="text-sm text-muted-foreground">
            {data.footerNote}
          </p>
          <div className="h-1 w-1 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  )
}
