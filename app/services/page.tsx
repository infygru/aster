import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle, ArrowRight, Phone,
  Heart, Users, User, Brain, HeartHandshake, Accessibility, Eye,
  MapPin, Clock, ShieldCheck,
} from 'lucide-react'
import { getServices, type DirectusService } from '@/lib/directus'

export const metadata: Metadata = {
  title: 'Our Services | Aster Homecare UK',
  description:
    "Explore Aster Homecare UK's specialist home care services in Slough and Berkshire: personal care, dementia care, mental health support, and more.",
}

const defaultServices: DirectusService[] = [
  {
    id: '1', status: 'published', sort: 1,
    title: 'Personal Care',
    slug: 'personal-care',
    description: 'Dignified, compassionate assistance with daily living activities — tailored entirely to the individual.',
    icon: 'heart', color: 'blue',
    features: ['Bathing & personal hygiene', 'Dressing & grooming', 'Continence care', 'Morning & evening routines'],
  },
  {
    id: '2', status: 'published', sort: 2,
    title: 'Caring for Adults Over 65',
    slug: 'adults-over-65',
    description: 'Specialist support helping older adults remain independent, safe, and connected at home.',
    icon: 'users', color: 'gold',
    features: ['Daily living support', 'Social engagement', 'Mobility assistance', 'Health monitoring'],
  },
  {
    id: '3', status: 'published', sort: 3,
    title: 'Caring for Adults Under 65',
    slug: 'adults-under-65',
    description: 'Person-centred care enabling younger adults with complex needs to lead fulfilling, independent lives.',
    icon: 'user', color: 'blue',
    features: ['Personalised care plans', 'Community integration', 'Skill development', 'Physical support'],
  },
  {
    id: '4', status: 'published', sort: 4,
    title: 'Dementia Care',
    slug: 'dementia',
    description: 'Specialist dementia support delivered with patience, understanding, and evidence-based techniques.',
    icon: 'brain', color: 'teal',
    features: ['Cognitive stimulation', 'Safe home routines', 'Family guidance', 'Behavioural support'],
  },
  {
    id: '5', status: 'published', sort: 5,
    title: 'Mental Health Support',
    slug: 'mental-health',
    description: 'Empathetic support for people living with mental health conditions, promoting stability and well-being.',
    icon: 'heart-handshake', color: 'blue',
    features: ['Emotional support', 'Daily structure', 'Social reintegration', 'Crisis planning'],
  },
  {
    id: '6', status: 'published', sort: 6,
    title: 'Physical Disabilities',
    slug: 'physical-disabilities',
    description: 'Enabling people with physical disabilities to live with maximum independence and quality of life.',
    icon: 'accessibility', color: 'gold',
    features: ['Mobility support', 'Assisted living', 'Equipment use', 'Carer coordination'],
  },
  {
    id: '7', status: 'published', sort: 7,
    title: 'Sensory Impairments',
    slug: 'sensory-impairments',
    description: 'Specialist care for individuals living with sight, hearing, or dual sensory impairments.',
    icon: 'eye', color: 'teal',
    features: ['Communication support', 'Orientation assistance', 'Adaptive strategies', 'Technology guidance'],
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  users: Users,
  user: User,
  brain: Brain,
  'heart-handshake': HeartHandshake,
  accessibility: Accessibility,
  eye: Eye,
}

const colorMap: Record<string, { bg: string; icon: string; pill: string }> = {
  blue:  { bg: '#EFF6FF', icon: '#2563EB', pill: '#DBEAFE' },
  gold:  { bg: '#FFFBEB', icon: '#D97706', pill: '#FEF3C7' },
  teal:  { bg: '#F0FDFA', icon: '#0D9488', pill: '#CCFBF1' },
}

const whyChooseUs = [
  { icon: ShieldCheck, text: 'CQC Registered & Regulated Provider' },
  { icon: CheckCircle, text: 'Fully DBS-checked carers' },
  { icon: CheckCircle, text: 'Personalised, written care plans' },
  { icon: Clock,       text: '24/7 on-call management support' },
  { icon: CheckCircle, text: 'Regular quality review assessments' },
  { icon: CheckCircle, text: 'GDPR-compliant data handling' },
  { icon: CheckCircle, text: 'Continuously trained, skilled staff' },
  { icon: MapPin,      text: 'Local expertise across Berkshire' },
]

const serviceAreas = [
  'Slough', 'Windsor', 'Maidenhead', 'Bracknell',
  'Reading', 'Wokingham', 'Uxbridge', 'Berkshire',
]

export default async function ServicesPage() {
  const fetched = await getServices()
  const services: DirectusService[] = fetched.length > 0 ? fetched : defaultServices

  return (
    <div className="min-h-screen">

      {/* 1. Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}
        aria-labelledby="services-hero-heading"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }} />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #D97706, transparent)' }} />
        </div>

        <div className="relative container-custom py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4">
              Our Services
            </p>
            <h1
              id="services-hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance mb-6 leading-tight"
            >
              Home Care Tailored<br />to You
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-10 max-w-2xl">
              From personal care to specialist dementia support, our CQC-registered carers deliver compassionate, professional care — helping you or your loved one live independently and comfortably at home.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm btn-assessment"
              >
                Free Assessment
              </Link>
              <a
                href="tel:+441753000000"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services grid */}
      <section className="section-padding bg-slate-50" aria-labelledby="services-grid-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h2 id="services-grid-heading" className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              Specialist Home Care Services
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Every care package is individually tailored — promoting independence while ensuring safety and dignity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon || 'heart'] || Heart
              const c = colorMap[service.color || 'blue'] || colorMap.blue
              return (
                <article
                  key={service.id}
                  className="group bg-white rounded-2xl border border-slate-200 p-7 flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  aria-labelledby={`service-${service.id}-title`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: c.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: c.icon }} aria-hidden="true" />
                  </div>

                  <h3
                    id={`service-${service.id}-title`}
                    className="text-lg font-bold text-slate-900 mb-2 leading-snug"
                  >
                    {service.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-1.5 mb-5" role="list">
                      {service.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
                          <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: c.icon }} aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto transition-colors duration-200"
                    style={{ color: c.icon }}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="section-padding bg-white" aria-labelledby="why-choose-heading">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Aster Homecare</p>
              <h2 id="why-choose-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
                Why Families Choose Us
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                We're not just a care agency — we're your partner in maintaining independence, comfort, and quality of life at home.
              </p>
              <Link href="/assessment" className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl text-sm btn-assessment">
                Get Your Free Assessment
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {whyChooseUs.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <Icon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-slate-700 font-medium text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. How We Work */}
      <section className="section-padding bg-slate-50" aria-labelledby="how-we-work-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Process</p>
            <h2 id="how-we-work-heading" className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              How We Start Your Care
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Simple, transparent, and centred entirely around you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Free Home Assessment',
                description: 'Our care coordinator visits you at home — free of charge — to understand your unique needs, preferences, and daily routines.',
              },
              {
                step: '02',
                title: 'Your Personalised Care Plan',
                description: 'We develop a detailed care plan together with you and your family, ensuring every aspect of your wellbeing and independence is covered.',
              },
              {
                step: '03',
                title: 'Care Begins',
                description: 'Your matched carer starts supporting you, with regular quality reviews ensuring your care evolves with your changing needs.',
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-7 left-full w-6 h-0.5 bg-blue-200 z-10" aria-hidden="true" />
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white font-bold text-lg"
                    style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Service Areas */}
      <section className="section-padding bg-white" aria-labelledby="service-areas-heading">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Where We Work</p>
            <h2 id="service-areas-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
              Areas We Serve
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
              We provide home care across Slough, Berkshire, and surrounding areas. Contact us to confirm coverage in your specific location.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="bg-blue-50 text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-full border border-blue-100"
                >
                  <MapPin className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5 opacity-60" aria-hidden="true" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section
        className="text-white py-20"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}
        aria-labelledby="services-cta-heading"
      >
        <div className="container-custom text-center">
          <h2 id="services-cta-heading" className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Start Your Care Journey Today
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Contact us for a free, no-obligation home care assessment. Our team is ready to help you find the right care solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl text-base btn-assessment"
              aria-label="Request a free care assessment"
            >
              Request Free Assessment
            </Link>
            <a
              href="tel:+441753000000"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border border-white/30 transition-colors text-base"
              aria-label="Call Aster Homecare UK"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call 01753 000000
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
