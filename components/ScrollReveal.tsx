'use client'
import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  animation?: 'up' | 'left' | 'right' | 'scale'
  delay?: 0 | 1 | 2 | 3 | 4
  threshold?: number
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'up',
  delay = 0,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const animClass = {
    up:    'animate-slide-up',
    left:  'animate-slide-left',
    right: 'animate-slide-right',
    scale: 'animate-scale',
  }[animation]

  const delayClass = delay > 0 ? `stagger-${delay}` : ''

  return (
    <div ref={ref} className={`animate-on-scroll ${animClass} ${delayClass} ${className}`}>
      {children}
    </div>
  )
}
