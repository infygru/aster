import { ShieldCheck, Heart, Clock, Users, Award, CheckCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

const features = [
  {
    num: '01',
    icon: ShieldCheck,
    title: 'CQC Regulated',
    desc: 'Fully registered and inspected by the Care Quality Commission — our care consistently meets the highest national standards.',
  },
  {
    num: '02',
    icon: Heart,
    title: 'Person-Centred Care Plans',
    desc: 'Every plan is built around you — your preferences, routines and goals. Never generic, always personal.',
  },
  {
    num: '03',
    icon: Users,
    title: 'Expertly Matched Carers',
    desc: 'We take time to match every client with a compatible, DBS-checked and thoroughly trained carer.',
  },
  {
    num: '04',
    icon: Clock,
    title: '24 / 7 On-Call Support',
    desc: 'Day or night, our coordination team is always reachable — for clients, families and carers alike.',
  },
  {
    num: '05',
    icon: Award,
    title: 'Locally Trusted',
    desc: 'Rooted in Slough and Windsor, we know our community and have built lasting trust with hundreds of families.',
  },
  {
    num: '06',
    icon: CheckCircle,
    title: 'Free Home Assessment',
    desc: 'Start with a no-obligation visit. We listen carefully before we ever suggest a care plan.',
  },
]

const stats = [
  { value: '500+', sub: 'Families supported' },
  { value: '5.0★', sub: 'Client satisfaction' },
  { value: '50+',  sub: 'Trained carers' },
]

export function TrustSignals() {
  return (
    <section className="overflow-hidden bg-white" aria-labelledby="why-us-heading">
      <div className="container-custom">
        <div className="grid lg:grid-cols-5 gap-0">

          {/* ── LEFT: Social proof panel ── */}
          <ScrollReveal animation="left">
            <div
              className="lg:col-span-2 rounded-none lg:rounded-3xl flex flex-col justify-between p-10 lg:p-12 my-0 lg:my-16"
              style={{ background: 'linear-gradient(160deg, #2563EB 0%, #1E3A8A 100%)' }}
            >
              <div>
                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Why Choose Us</span>
                <h2
                  id="why-us-heading"
                  className="mt-4 text-3xl lg:text-4xl font-extrabold text-white leading-tight"
                >
                  Built on trust,<br />proven by results.
                </h2>
                <p className="mt-4 text-blue-100 text-sm leading-relaxed">
                  Aster Homecare UK combines clinical excellence with genuine human warmth — a combination that makes a real difference to the families we serve.
                </p>
              </div>

              {/* Stats */}
              <div className="mt-10 space-y-5">
                {stats.map((s, i) => (
                  <div key={s.value} className="flex items-end gap-3">
                    <span className="text-4xl font-black text-white leading-none">{s.value}</span>
                    <span className="text-blue-200 text-sm mb-1">{s.sub}</span>
                    {i < stats.length - 1 && (
                      <div className="flex-1 border-b border-blue-800/30 mb-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* CQC strip */}
              <div className="mt-10 flex items-center gap-3 pt-8 border-t border-blue-800/30">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">CQC Registered Provider</p>
                  <p className="text-blue-200 text-xs mt-0.5">Regulated care you can trust</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── RIGHT: Numbered feature list ── */}
          <div className="lg:col-span-3 py-16 lg:py-24 lg:pl-14">
            <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {features.map((f, i) => (
                <ScrollReveal key={f.num} animation="right" delay={(Math.min(i, 4) as 0 | 1 | 2 | 3 | 4)}>
                  <div className="group flex items-start gap-5 py-6 transition-all duration-200 hover:pl-1">
                    {/* Number + icon */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1.5 w-10">
                      <span className="text-[10px] font-black tracking-wider" style={{ color: '#2563EB' }}>{f.num}</span>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: '#EFF6FF' }}>
                        <f.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: '#2563EB' }} aria-hidden="true" />
                      </div>
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1.5 leading-snug" style={{ color: '#0F172A' }}>
                        {f.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
