import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle, Phone, ArrowLeft, ShieldCheck, Clock, Users, Heart } from 'lucide-react'
import { getServices } from '@/lib/directus'
import type { DirectusService } from '@/lib/directus'

// ── Full static service data ──────────────────────────────────────────────────

const staticServices: DirectusService[] = [
  {
    id: '1', status: 'published', sort: 1,
    title: 'Personal Care', slug: 'personal-care', icon: 'heart', color: 'blue',
    description: 'Dignified support with bathing, dressing, grooming and daily routines — tailored to each individual.',
    long_description: 'Our personal care service provides compassionate, professional support with all aspects of daily living. Our fully trained, DBS-checked carers help with bathing, washing, dressing and grooming in a way that preserves your dignity and respects your personal preferences. Every visit is unhurried and person-centred — we work at your pace, following your routine.',
    features: ['Bathing & personal hygiene', 'Dressing & grooming assistance', 'Toileting & continence care', 'Skin care & pressure prevention', 'Morning & evening routines', 'Meal preparation & nutrition'],
  },
  {
    id: '2', status: 'published', sort: 2,
    title: 'Caring for Adults Over 65', slug: 'adults-over-65', icon: 'users', color: 'blue',
    description: 'Specialist support helping older adults live independently, safely and comfortably at home.',
    long_description: 'We understand the unique needs of older adults. Our specialist carers provide tailored support that promotes independence, safety and wellbeing — allowing you or your loved one to remain in the comfort of home for as long as possible. From help with daily tasks to companionship and health monitoring, we are there every step of the way.',
    features: ['Daily living support', 'Health monitoring & wellbeing checks', 'Companionship & social engagement', 'Falls prevention & safety', 'Medication reminders', 'Liaison with healthcare professionals'],
  },
  {
    id: '3', status: 'published', sort: 3,
    title: 'Caring for Adults Under 65', slug: 'adults-under-65', icon: 'user', color: 'blue',
    description: 'Tailored care for working-age adults promoting independence and active daily participation.',
    long_description: 'Support for adults under 65 requires a different approach — one that focuses on maximising independence, facilitating employment and community participation, and adapting to an active lifestyle. Our carers are trained to provide flexible, non-intrusive support that fits around your life, not the other way around.',
    features: ['Personalised care plans', 'Independence & autonomy support', 'Community integration & social inclusion', 'Flexible scheduling around work & commitments', 'Supported living transition', 'Goal-focused care reviews'],
  },
  {
    id: '4', status: 'published', sort: 4,
    title: 'Dementia Care', slug: 'dementia', icon: 'brain', color: 'blue',
    description: 'Specialist support focused on dignity, familiar routine and meaningful connection for clients and families.',
    long_description: "Living with dementia brings unique challenges for individuals and their families. Our specialist dementia carers are trained to provide calm, consistent support centred on familiar routines, meaningful engagement and preserving the person's identity and dignity. We work closely with families to ensure continuity of care at every stage of the journey.",
    features: ['Routine-based care & consistency', 'Memory & cognitive stimulation activities', 'Safe, familiar home environment', 'Family liaison & carer support', 'Medication management', 'Behavioural & emotional support'],
  },
  {
    id: '5', status: 'published', sort: 5,
    title: 'Mental Health Support', slug: 'mental-health', icon: 'heart-handshake', color: 'blue',
    description: 'Person-centred care for adults with mental health conditions, promoting wellbeing and stability.',
    long_description: 'Our mental health support service is delivered by carers who understand the complexities of living with a mental health condition. We focus on building trusting relationships, maintaining routines, and providing practical and emotional support that helps clients manage day-to-day life and work towards their personal goals.',
    features: ['Emotional & psychological support', 'Daily routine & structure support', 'Medication reminders & monitoring', 'Social inclusion & community activities', 'Crisis prevention planning', 'Liaison with mental health teams'],
  },
  {
    id: '6', status: 'published', sort: 6,
    title: 'Physical Disabilities Support', slug: 'physical-disabilities', icon: 'accessibility', color: 'blue',
    description: 'Expert support for adults with physical disabilities, enabling greater independence and quality of life.',
    long_description: 'We provide specialist care and support for adults living with physical disabilities, delivering assistance that enables greater independence and participation in daily life. Our carers are trained in moving and handling, assistive technology, and rehabilitation principles — working alongside occupational therapists and physiotherapists where needed.',
    features: ['Personal care & hygiene support', 'Moving, handling & transfers', 'Assistive technology & equipment support', 'Rehabilitation & physiotherapy support', 'Transport & community access', 'Home adaptation liaison'],
  },
  {
    id: '7', status: 'published', sort: 7,
    title: 'Sensory Impairments Support', slug: 'sensory-impairments', icon: 'eye', color: 'blue',
    description: 'Specialist care for clients with visual or hearing impairments to promote safe independent living.',
    long_description: 'Our sensory impairment support service is designed to help people with visual or hearing impairments live safely, independently and confidently at home and in the community. Our carers receive specialist training in communication methods including British Sign Language basics, guiding techniques, and the use of assistive technology.',
    features: ['Communication support (BSL, tactile, written)', 'Safe navigation & orientation support', 'Assistive technology setup & use', 'Independence & mobility promotion', 'Social engagement & community access', 'Liaison with sensory support services'],
  },
]

async function getAllServices(): Promise<DirectusService[]> {
  try {
    const fetched = await getServices()
    return fetched.length > 0 ? fetched : staticServices
  } catch {
    return staticServices
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const all = await getAllServices()
  const service = all.find((s) => s.slug === slug)
  if (!service) return { title: 'Service Not Found' }
  return {
    title: `${service.title} | Aster Homecare UK`,
    description: service.description,
  }
}

export async function generateStaticParams() {
  return staticServices.map((s) => ({ slug: s.slug }))
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const all = await getAllServices()
  const service = all.find((s) => s.slug === slug)
  if (!service) notFound()

  const related = all.filter((s) => s.slug !== service.slug).slice(0, 3)
  const longDesc = service.long_description || service.description

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: '#0F172A' }} aria-labelledby="service-hero-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.6) 0%, transparent 65%)' }} />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.4) 0%, transparent 65%)' }} />
        </div>

        <div className="relative container-custom py-20 md:py-28">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
            style={{ color: '#94A3B8' }}>
            <ArrowLeft className="w-4 h-4" />
            All Services
          </Link>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.30)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">CQC Regulated Service</span>
            </div>

            <h1 id="service-hero-heading"
              className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-5"
              style={{ letterSpacing: '-0.02em' }}>
              {service.title}
            </h1>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#94A3B8' }}>{longDesc}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/assessment"
                className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-2xl text-white text-sm transition-all hover:scale-[1.02] btn-assessment">
                Book Free Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+441753000000"
                className="inline-flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-2xl text-sm transition-all"
                style={{ border: '1.5px solid rgba(255,255,255,0.18)', color: '#E2E8F0', background: 'rgba(255,255,255,0.04)' }}>
                <Phone className="w-4 h-4" />
                01753 000000
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="section-padding bg-white" aria-labelledby="features-heading">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
                style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                What&apos;s Included
              </span>
              <h2 id="features-heading" className="text-3xl font-extrabold mb-8" style={{ color: '#0F172A' }}>
                Everything covered in this service
              </h2>
              <ul className="space-y-4" role="list">
                {(service.features || []).map((f) => (
                  <li key={f} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#EFF6FF' }}>
                      <span style={{ color: '#2563EB' }} aria-hidden="true"><CheckCircle className="w-4 h-4" /></span>
                    </div>
                    <p className="font-semibold text-sm pt-1.5" style={{ color: '#0F172A' }}>{f}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-8 lg:p-10"
              style={{ background: 'linear-gradient(160deg, #2563EB 0%, #1E3A8A 100%)' }}>
              <h3 className="text-xl font-bold text-white mb-2">Why choose Aster Homecare?</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                CQC-registered and locally trusted across Slough, Windsor and Berkshire.
              </p>
              {[
                { icon: ShieldCheck, label: 'CQC Regulated',      sub: 'Inspected to the highest national standards' },
                { icon: Users,       label: 'DBS Checked Carers', sub: 'Fully vetted, trained and insured staff' },
                { icon: Clock,       label: '24/7 On-Call Support', sub: 'Always reachable for families & carers' },
                { icon: Heart,       label: 'Person-Centred',     sub: 'Every plan built around your individual needs' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-4 mb-6 last:mb-0">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{label}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
              <div className="mt-8 pt-6 border-t border-blue-800/40">
                <Link href="/assessment"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:bg-white/20"
                  style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}>
                  Get a Free Assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Getting Started ── */}
      <section className="section-padding" style={{ background: '#EFF6FF' }} aria-labelledby="process-heading">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full"
              style={{ background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
              Getting Started
            </span>
            <h2 id="process-heading" className="text-3xl font-extrabold" style={{ color: '#0F172A' }}>
              How to begin your care
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Call or enquire',  desc: 'Get in touch by phone or our online form — no commitment needed.' },
              { num: '02', title: 'Free home visit',  desc: 'We come to you and listen carefully to understand exactly what support would help.' },
              { num: '03', title: 'Care begins',      desc: 'Your matched carer starts, with a detailed care plan in place from day one.' },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 text-center"
                style={{ border: '1px solid #BFDBFE', boxShadow: '0 2px 12px rgba(37,99,235,0.07)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}>
                  {step.num}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#0F172A' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Services ── */}
      {related.length > 0 && (
        <section className="section-padding bg-white" aria-labelledby="related-heading">
          <div className="container-custom">
            <h2 id="related-heading" className="text-2xl font-bold mb-8" style={{ color: '#0F172A' }}>
              Other services you may need
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((s) => (
                <Link key={s.id} href={`/services/${s.slug}`}
                  className="group bg-white rounded-2xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  style={{ border: '1px solid #E2E8F0' }}
                  aria-label={`Learn about ${s.title}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                    style={{ background: '#EFF6FF' }} aria-hidden="true">
                    <span style={{ color: '#2563EB' }}><Heart className="w-5 h-5" /></span>
                  </div>
                  <h3 className="font-bold text-sm mb-2 leading-snug" style={{ color: '#0F172A' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: '#64748B' }}>{s.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: '#2563EB' }}>
                    Learn more
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)', padding: '5rem 0' }}
        aria-labelledby="service-cta-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>
        <div className="relative container-custom text-center">
          <h2 id="service-cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to arrange {service.title.toLowerCase()}?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto" style={{ opacity: 0.9 }}>
            Book a free, no-obligation care assessment. Our team will create the perfect plan for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/assessment"
              className="group inline-flex items-center justify-center gap-2 bg-white font-bold py-3.5 px-8 rounded-2xl transition-all hover:scale-[1.02]"
              style={{ color: '#1D4ED8' }}>
              Request Free Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="tel:+441753000000"
              className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-2xl transition-all hover:bg-white/10 text-white"
              style={{ border: '2px solid rgba(255,255,255,0.4)' }}>
              <Phone className="w-4 h-4" />
              01753 000000
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
