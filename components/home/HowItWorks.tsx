import { Phone, ClipboardList, Heart } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const steps = [
  {
    num: '01', icon: Phone,
    title: 'Get in Touch',
    desc: 'Call or fill in our form. Our care coordinators will answer any questions — no obligation, no pressure.',
  },
  {
    num: '02', icon: ClipboardList,
    title: 'Free Home Assessment',
    desc: 'We visit at a time that suits you and listen carefully to understand exactly what support would help most.',
  },
  {
    num: '03', icon: Heart,
    title: 'Care Begins',
    desc: 'Your personalised care plan is put in place. We carefully match you with a carer who fits your needs.',
  },
]

export function HowItWorks() {
  return (
    <section className="section-padding" style={{ background: '#EFF6FF' }} aria-labelledby="how-it-works-heading">
      <div className="container-custom">
        <ScrollReveal animation="up">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full" style={{ background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
              How It Works
            </span>
            <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>
              Getting Started is Simple
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10 relative">
          <div className="hidden md:block absolute top-9 left-[calc(16.5%+1.5rem)] right-[calc(16.5%+1.5rem)] h-px"
            style={{ background: 'linear-gradient(90deg, #BFDBFE, #2563EB, #BFDBFE)' }} aria-hidden="true" />

          {steps.map((step, i) => (
            <ScrollReveal key={step.num} animation="up" delay={(i as 0 | 1 | 2)}>
              <div className="flex flex-col items-center text-center relative">
                <div className="relative mb-6 z-10">
                  <div className="w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center bg-white"
                    style={{ border: '1.5px solid #BFDBFE', boxShadow: '0 4px 16px rgba(37,99,235,0.12)' }}>
                    <span style={{ color: '#2563EB' }}><step.icon className="w-7 h-7" /></span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                    {step.num.replace('0', '')}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0F172A' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#64748B' }}>{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 font-bold py-4 px-8 rounded-2xl text-sm transition-all duration-200 group btn-assessment"
          >
            Book Your Free Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
