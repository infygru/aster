import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Shield, TrendingUp, Clock, MapPin, Briefcase, CheckCircle } from 'lucide-react'
import { CareersForm } from '@/components/CareersForm'
import { getJobOpenings } from '@/lib/directus'
import type { DirectusJobOpening } from '@/lib/directus'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    "Join the Aster Homecare UK team. We're looking for compassionate, dedicated care workers in Slough and Berkshire. Apply online today.",
}

const benefits = [
  {
    icon: Heart,
    title: 'Meaningful Work',
    desc: "Make a real difference in people's lives every single day.",
  },
  {
    icon: Shield,
    title: 'Full Training',
    desc: 'Comprehensive induction, ongoing professional development, and NVQ support.',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    desc: 'Clear progression pathways from care worker to senior coordinator.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    desc: 'Full-time, part-time, and flexible rota options to suit your life.',
  },
]

const requirements = [
  'Right to work in the United Kingdom',
  'Enhanced DBS check (we can assist with this)',
  'Compassionate and reliable nature',
  'Good verbal and written communication skills',
  'Driving licence (preferred but not always essential)',
  'Ability to work independently and as part of a team',
]

function JobCard({ job }: { job: DirectusJobOpening }) {
  const typeLabel =
    job.type === 'full-time'
      ? 'Full Time'
      : job.type === 'part-time'
      ? 'Part Time'
      : 'Flexible'

  return (
    <article className="bg-white rounded-2xl shadow-card border border-amber-100 p-7 card-hover flex flex-col">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-brand-teal/10 text-brand-teal text-xs font-semibold px-3 py-1 rounded-full">
          {typeLabel}
        </span>
        {job.department && (
          <span className="bg-blue-50 text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
            {job.department}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-brand-blue font-serif mb-2">{job.title}</h3>

      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4" aria-hidden="true" />
        <span>{job.location || 'Slough, Berkshire'}</span>
      </div>

      {job.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {job.description}
        </p>
      )}

      {job.salary_range && (
        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
          {job.salary_range}
        </p>
      )}

      <Link
        href="#apply"
        className="inline-flex items-center justify-center bg-brand-teal hover:bg-brand-teal-light text-white font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm mt-auto"
        aria-label={`Apply for ${job.title} position`}
      >
        Apply Now
      </Link>
    </article>
  )
}

export default async function CareersPage() {
  const jobs = await getJobOpenings()

  return (
    <div className="min-h-screen">
      {/* 1. Hero */}
      <section
        className="relative overflow-hidden hero-gradient text-white"
        aria-labelledby="careers-hero-heading"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container-custom py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4">
              Join Our Team
            </p>
            <h1
              id="careers-hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-balance mb-6 leading-tight"
            >
              Build a Career in Care
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
              We&apos;re looking for caring, dedicated individuals who want to make
              a real difference. No prior experience is essential — just
              compassion and a genuine desire to help others.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Benefits */}
      <section className="section-padding bg-brand-cream" aria-labelledby="benefits-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Why Work With Us
            </p>
            <h2
              id="benefits-heading"
              className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
            >
              Rewarding Work, Great Benefits
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="bg-white rounded-2xl shadow-card border border-amber-100 p-7 text-center card-hover"
                >
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-brand-teal" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue font-serif mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Job Openings */}
      <section className="section-padding bg-brand-warm" aria-labelledby="jobs-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Current Vacancies
            </p>
            <h2
              id="jobs-heading"
              className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
            >
              Open Positions
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center bg-white rounded-2xl border border-amber-100 shadow-card p-10">
              <Briefcase className="w-12 h-12 text-brand-teal mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-brand-blue font-serif mb-3">
                No Current Vacancies
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                We don&apos;t have any open positions right now, but we&apos;re always
                interested in hearing from passionate care professionals.
                Send us your CV and we&apos;ll be in touch when something
                suitable arises.
              </p>
              <Link
                href="#apply"
                className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-light text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Send Your CV Anyway
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Requirements */}
      <section className="section-padding bg-brand-cream" aria-labelledby="requirements-heading">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
                What We Look For
              </p>
              <h2
                id="requirements-heading"
                className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
              >
                Requirements
              </h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                We welcome applications from all backgrounds. What matters most
                is your compassion and commitment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {requirements.map((req) => (
                <div
                  key={req}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 border border-amber-100 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Application form */}
      <section id="apply" className="section-padding bg-brand-warm" aria-labelledby="apply-heading">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
                Apply Now
              </p>
              <h2
                id="apply-heading"
                className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
              >
                Submit Your Application
              </h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Fill in the form below and our recruitment team will be in
                touch within 2 working days.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-amber-100 p-8">
              <CareersForm />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="bg-brand-navy text-white py-16" aria-labelledby="careers-cta-heading">
        <div className="container-custom text-center">
          <h2
            id="careers-cta-heading"
            className="text-3xl md:text-4xl font-bold font-serif mb-4 text-balance"
          >
            Join Our Team
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Be part of something meaningful. Help us deliver outstanding care
            to the people who need it most.
          </p>
          <Link
            href="#apply"
            className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-light text-white font-semibold py-4 px-10 rounded-xl transition-colors shadow-warm text-base"
            aria-label="Apply to join the Aster Homecare team"
          >
            Apply Today
          </Link>
        </div>
      </section>
    </div>
  )
}
