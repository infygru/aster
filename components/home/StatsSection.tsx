'use client'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 500, suffix: '+', label: 'Families Supported',  sub: 'Across our care areas' },
  { value: 50,  suffix: '+', label: 'Dedicated Carers',    sub: 'DBS checked & trained' },
  { value: 7,   suffix: '',  label: 'Care Specialisms',    sub: 'Tailored to every need' },
  { value: 100, suffix: '%', label: 'Person-Centred',      sub: 'Every plan tailored' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const step = target / (1800 / 16)
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setCount(Math.floor(cur))
          if (cur >= target) clearInterval(t)
        }, 16)
      }
    }, { threshold: 0.5 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export function StatsSection() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: '#0F172A' }}
      aria-labelledby="stats-heading"
    >
      {/* Teal glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.6), transparent)' }} />
      </div>

      <div className="relative container-custom">
        <div className="text-center mb-14">
          <h2 id="stats-heading" className="text-3xl md:text-4xl font-bold text-white">
            Trusted Across Our Care Areas
          </h2>
          <p className="mt-3 text-sm font-medium" style={{ color: '#94A3B8' }}>Real numbers. Real care. Real difference.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label}
              className="text-center p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300"
              style={{ background: '#1E293B', border: '1px solid #334155' }}>
              <div className="text-4xl md:text-5xl font-black mb-2"
                style={{ color: '#FCD34D' }}>
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <p className="font-bold text-sm text-white">{s.label}</p>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
