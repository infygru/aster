import { ShieldCheck, Heart, Clock, Users, Award, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

const features = [
  {
    icon: ShieldCheck,
    title: 'CQC Regulated',
    desc: 'Fully registered and inspected by the Care Quality Commission — our care consistently meets the highest national standards.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: Heart,
    title: 'Person-Centred Plans',
    desc: 'Every care plan is built around you — your preferences, routines and goals. Never generic, always deeply personal.',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    icon: Users,
    title: 'Expertly Matched Carers',
    desc: 'We take time to match every client with a compatible, DBS-checked and thoroughly trained carer you can trust.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: Clock,
    title: '24 / 7 On-Call Support',
    desc: 'Day or night, our coordination team is always reachable — for clients, families and carers alike.',
    color: '#0EA5E9',
    bg: '#F0F9FF',
  },
  {
    icon: Award,
    title: 'Locally Trusted',
    desc: 'Rooted in Slough and Windsor, we know our community and have built lasting relationships with hundreds of families.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: CheckCircle,
    title: 'Free Home Assessment',
    desc: 'Start with a no-obligation home visit. We listen carefully before we ever suggest a care plan.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
]

const stats = [
  { value: '500+', label: 'Families Supported' },
  { value: '5.0', label: 'Star Satisfaction', icon: Star },
  { value: '50+',  label: 'Trained Carers' },
  { value: '100%', label: 'DBS Checked' },
]

export function TrustSignals() {
  return (
    <section className="bg-stone-50 py-16 md:py-24" aria-labelledby="why-us-heading">
      <div className="container-custom">

        {/* ── Header ── */}
        <ScrollReveal animation="up">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">
              Why Choose Us
            </span>
            <h2
              id="why-us-heading"
              className="text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight mb-4"
            >
              Care built on trust,<br className="hidden sm:block" /> proven by results.
            </h2>
            <p className="text-stone-500 leading-relaxed text-sm md:text-base">
              Aster Homecare UK combines clinical excellence with genuine human warmth —
              a combination that makes a real difference to the families we serve.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Stats bar ── */}
        <ScrollReveal animation="up" delay={1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 md:mb-16">
            {stats.map((s) => (
              <div
                key={s.value}
                className="bg-white rounded-2xl px-4 py-5 text-center border border-stone-100 shadow-sm"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl md:text-3xl font-black text-stone-900">{s.value}</span>
                  {s.icon && <s.icon className="w-5 h-5 text-amber-400 fill-amber-400" aria-hidden="true" />}
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} animation="up" delay={(Math.min(i % 3, 4) as 0 | 1 | 2 | 3 | 4)}>
              <div className="group bg-white rounded-2xl p-6 md:p-7 border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: f.bg }}
                >
                  <span style={{ color: f.color }} aria-hidden="true">
                    <f.icon className="w-5 h-5" />
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 mb-2 leading-snug">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed flex-1">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── CQC trust footer ── */}
        <ScrollReveal animation="up" delay={2}>
          <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl px-6 py-5 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm leading-none">CQC Registered Provider</p>
                <p className="text-xs text-stone-400 mt-0.5">Regulated care you can trust</p>
              </div>
            </div>
            <Link
              href="/assessment"
              className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              Book Free Assessment
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
