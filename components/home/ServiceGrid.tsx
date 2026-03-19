import { type DirectusService } from '@/lib/directus'
import Link from 'next/link'
import { ArrowRight, Heart, Users, User, Brain, HeartHandshake, Accessibility, Eye, CheckCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

/* ── Icon map ─────────────────────────────────────── */
const iconMap: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  heart:             Heart,
  users:             Users,
  user:              User,
  brain:             Brain,
  'heart-handshake': HeartHandshake,
  accessibility:     Accessibility,
  eye:               Eye,
  pill:              Heart,
}

/* ── Fallback data ────────────────────────────────── */
const fallbackServices: DirectusService[] = [
  { id:'1', status:'published', sort:1, title:'Personal Care',          slug:'personal-care',          description:'Dignified support with bathing, dressing, grooming and daily routines — tailored to each individual.',                            icon:'heart',           color:'teal',    features:['Bathing & hygiene','Dressing & grooming','Meal preparation','Morning & evening routines'] },
  { id:'2', status:'published', sort:2, title:'Adults Over 65',         slug:'adults-over-65',         description:'Specialist support helping older adults live independently, safely and comfortably at home.',                                    icon:'users',           color:'sky',     features:['Daily living support','Health monitoring','Companionship','Social engagement'] },
  { id:'3', status:'published', sort:3, title:'Adults Under 65',        slug:'adults-under-65',        description:'Tailored care for working-age adults promoting independence and active daily participation.',                                     icon:'user',            color:'cyan',    features:['Personalised care plans','Independence support','Community integration','Flexible scheduling'] },
  { id:'4', status:'published', sort:4, title:'Dementia Care',          slug:'dementia',               description:'Specialist support focused on dignity, familiar routine and meaningful connection for clients and families.',                    icon:'brain',           color:'teal',    features:['Memory & cognitive support','Safe home environment','Routine-based care','Family liaison'] },
  { id:'5', status:'published', sort:5, title:'Mental Health',          slug:'mental-health',          description:'Person-centred care for adults with mental health conditions, promoting wellbeing and stability.',                              icon:'heart-handshake', color:'sky',     features:['Emotional support','Daily routine help','Medication support','Social inclusion'] },
  { id:'6', status:'published', sort:6, title:'Physical Disabilities',  slug:'physical-disabilities',  description:'Expert support for adults with physical disabilities, enabling greater independence and quality of life.',                       icon:'accessibility',   color:'cyan',    features:['Mobility support','Equipment assistance','Personal care','Rehabilitation support'] },
  { id:'7', status:'published', sort:7, title:'Sensory Impairments',    slug:'sensory-impairments',    description:'Specialist care for clients with visual or hearing impairments to promote safe independent living.',                            icon:'eye',             color:'emerald', features:['Communication support','Safe navigation','Assistive technology','Independence promotion'] },
]

/* ── Featured card (first service — blue gradient) ─ */
function FeaturedCard({ service, num }: { service: DirectusService; num: string }) {
  const Icon = iconMap[service.icon || 'heart'] || Heart
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative overflow-hidden rounded-3xl flex flex-col justify-between p-8 lg:p-10 transition-all duration-300 hover:scale-[1.01] h-full"
      style={{
        background: 'linear-gradient(150deg, #2563EB 0%, #1D4ED8 60%, #1E3A8A 100%)',
        boxShadow: '0 16px 48px rgba(37,99,235,0.30)',
        minHeight: 'clamp(260px, 40vw, 380px)',
      }}
      aria-label={`Learn about ${service.title}`}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div>
        <span className="text-blue-300 text-xs font-bold tracking-widest uppercase">{num}</span>
        <div className="mt-4 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-extrabold text-white leading-tight mb-3">{service.title}</h3>
        <p className="text-blue-100 text-sm leading-relaxed">{service.description}</p>
      </div>

      {service.features && service.features.length > 0 && (
        <ul className="mt-6 space-y-1.5">
          {service.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-blue-100">
              <CheckCircle className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
        Learn more
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}

/* ── Standard card ────────────────────────────────── */
function StandardCard({ service, num }: { service: DirectusService; num: string }) {
  const Icon = iconMap[service.icon || 'heart'] || Heart
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group bg-white rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      aria-label={`Learn about ${service.title}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#EFF6FF' }}>
          <span style={{ color: '#2563EB' }} aria-hidden="true"><Icon className="w-5 h-5" /></span>
        </div>
        <span className="text-xs font-black tracking-wider" style={{ color: '#CBD5E1' }}>{num}</span>
      </div>

      <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: '#0F172A' }}>{service.title}</h3>
      <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#64748B' }}>{service.description}</p>

      <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto transition-colors duration-200"
        style={{ color: '#2563EB' }}>
        Learn more
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </span>
    </Link>
  )
}

/* ── Main component ───────────────────────────────── */
export function ServiceGrid({ services }: { services?: DirectusService[] }) {
  const list = services && services.length > 0 ? services : fallbackServices
  const [featured, ...rest] = list

  return (
    <section className="section-padding" style={{ background: '#F8FAFC' }} aria-labelledby="services-heading">
      <div className="container-custom">

        {/* Section header — 2-column editorial */}
        <ScrollReveal animation="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
                style={{ background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                What We Offer
              </span>
              <h2 id="services-heading" className="text-3xl md:text-4xl font-extrabold leading-tight" style={{ color: '#0F172A' }}>
                Our Care Services
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed md:text-right" style={{ color: '#64748B' }}>
              Every package is built around you — promoting independence while ensuring safety and dignity at home.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Bento grid ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Featured — full left column on desktop */}
          <div className="lg:row-span-2">
            <ScrollReveal animation="left">
              <FeaturedCard service={featured} num="01" />
            </ScrollReveal>
          </div>

          {/* Services 2 & 3 — top-right 2 cols */}
          {rest.slice(0, 2).map((service, i) => (
            <ScrollReveal key={service.id} animation="up" delay={((i + 1) as 0 | 1 | 2 | 3 | 4)}>
              <StandardCard service={service} num={String(i + 2).padStart(2, '0')} />
            </ScrollReveal>
          ))}

          {/* Services 4 & 5 — bottom-right 2 cols */}
          {rest.slice(2, 4).map((service, i) => (
            <ScrollReveal key={service.id} animation="up" delay={((i + 1) as 0 | 1 | 2 | 3 | 4)}>
              <StandardCard service={service} num={String(i + 4).padStart(2, '0')} />
            </ScrollReveal>
          ))}
        </div>

        {/* ── Remaining services (5+) as compact icon-list row ── */}
        {rest.length > 4 && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rest.slice(4).map((service, i) => {
              const Icon = iconMap[service.icon || 'heart'] || Heart
              return (
                <ScrollReveal key={service.id} animation="up" delay={(Math.min(i, 4) as 0 | 1 | 2 | 3 | 4)}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ border: '1px solid #E2E8F0' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: '#EFF6FF' }}>
                      <span style={{ color: '#2563EB' }} aria-hidden="true"><Icon className="w-4 h-4" /></span>
                    </div>
                    <span className="text-sm font-semibold leading-tight flex-1" style={{ color: '#0F172A' }}>
                      {service.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                      style={{ color: '#2563EB' }} />
                  </Link>
                </ScrollReveal>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-white transition-all duration-200 hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
