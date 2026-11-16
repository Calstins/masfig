'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  from?: 'up' | 'left' | 'right' | 'scale'
}

/** Fades/slides content in once as it scrolls into view. Without JS or with reduced motion, content is simply visible. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, from = 'up' }: Props) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible'); return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const dir = from === 'left' ? 'reveal-left' : from === 'right' ? 'reveal-right' : from === 'scale' ? 'reveal-scale' : ''
  return (
    <Tag ref={ref} className={`reveal ${dir} ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  )
}
