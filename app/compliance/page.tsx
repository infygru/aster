import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ExternalLink, FileText, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quality of Care & CQC Compliance',
  description:
    'Aster Homecare UK is a CQC-registered care provider. View our registration details, quality standards, and commitment to safe, effective, and compassionate care.',
}

const cqcQuestions = [
  {
    initial: 'S',
    title: 'Safe',
    description: 'We protect clients from abuse, harm, and avoidable risks.',
    color: 'bg-blue-500',
  },
  {
    initial: 'E',
    title: 'Effective',
    description: 'Our care achieves good outcomes and promotes quality of life.',
    color: 'bg-green-500',
  },
  {
    initial: 'C',
    title: 'Caring',
    description: 'Staff treat clients with compassion, dignity, and respect.',
    color: 'bg-pink-500',
  },
  {
    initial: 'R',
    title: 'Responsive',
    description: 'Services are organised to meet each person\'s individual needs.',
    color: 'bg-amber-500',
  },
  {
    initial: 'W',
    title: 'Well-led',
    description: 'Strong leadership ensures quality, sustainability, and improvement.',
    color: 'bg-purple-500',
  },
]

const commitments = [
  {
    title: 'Safeguarding First',
    description:
      'We operate robust safeguarding policies to protect every client from harm. All staff receive mandatory safeguarding training.',
  },
  {
    title: 'Trained Staff',
    description:
      'Every member of our team undergoes a comprehensive induction and ongoing training programme, including manual handling, dementia awareness, and first aid.',
  },
  {
    title: 'Person-Centred Care',
    description:
      'Care plans are written with the individual, not for them. We honour personal preferences, cultural needs, and individual goals.',
  },
  {
    title: 'Infection Control',
    description:
      'We follow strict infection prevention and control procedures, including the use of appropriate PPE and regular hygiene audits.',
  },
  {
    title: 'Medication Safety',
    description:
      'Our medication management procedures comply with NICE guidance. All medication administration is recorded and reviewed regularly.',
  },
  {
    title: 'Continuous Improvement',
    description:
      'We welcome client and family feedback, carry out regular quality reviews, and act on any concerns promptly and transparently.',
  },
]

const policies = [
  'Safeguarding Adults Policy',
  'Infection Control & Prevention',
  'Medication Management Policy',
  'Equality & Diversity Policy',
  'Complaints & Compliments Procedure',
  'GDPR & Data Protection Policy',
  'Whistleblowing Policy',
  'Health & Safety Policy',
  'Business Continuity Plan',
]

export default function CompliancePage() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero */}
      <section
        className="relative overflow-hidden hero-gradient text-white"
        aria-labelledby="compliance-hero-heading"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative container-custom py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4">
              Quality &amp; Compliance
            </p>
            <h1
              id="compliance-hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-balance mb-6 leading-tight"
            >
              Quality of Care &amp; CQC Compliance
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
              Regulated by the Care Quality Commission, we hold ourselves to the
              highest standards of safe, effective, caring, responsive, and
              well-led services.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CQC Details + Key Questions */}
      <section className="section-padding bg-brand-cream" aria-labelledby="cqc-details-heading">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">

            {/* Left: CQC registration card */}
            <div className="bg-brand-navy rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <h2
                  id="cqc-details-heading"
                  className="text-xl font-bold font-serif"
                >
                  CQC Registration
                </h2>
              </div>

              <table className="w-full text-sm" aria-label="CQC registration details">
                <tbody className="divide-y divide-white/10">
                  {[
                    { label: 'Provider Name', value: 'Aster Homecare UK Ltd' },
                    { label: 'Provider ID', value: '1-20633610286' },
                    { label: 'Nominated Individual', value: 'Sanjeev Srichandan' },
                    { label: 'Registration Type', value: 'Domiciliary Care Agency' },
                    { label: 'Address', value: '7 Mackenzie Street, Slough, SL1 1XQ' },
                    { label: 'Status', value: '✓ Registered', highlight: true },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="py-3 text-blue-200 pr-4">{row.label}</td>
                      <td
                        className={`py-3 font-medium text-right ${
                          'highlight' in row && row.highlight ? 'text-green-300' : 'text-white'
                        }`}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                href="https://www.cqc.org.uk/provider/1-20633610286"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-light text-white py-3 px-5 rounded-xl font-semibold text-sm transition-colors"
                aria-label="View Aster Homecare UK profile on CQC website (opens in new tab)"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                View Our CQC Profile
              </Link>
            </div>

            {/* Right: 5 CQC Key Questions */}
            <div>
              <h2 className="text-2xl font-bold text-brand-blue font-serif mb-6">
                CQC Key Questions
              </h2>
              <div className="space-y-4">
                {cqcQuestions.map((q) => (
                  <div
                    key={q.title}
                    className="flex items-start gap-4 bg-white p-4 rounded-xl border border-amber-100 shadow-sm"
                  >
                    <div
                      className={`w-10 h-10 ${q.color} text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold`}
                      aria-hidden="true"
                    >
                      {q.initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-blue">{q.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{q.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Commitments */}
      <section className="section-padding bg-brand-warm" aria-labelledby="commitments-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Our Standards
            </p>
            <h2
              id="commitments-heading"
              className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
            >
              Our Commitments to You
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
              Quality is not a checklist — it is embedded in everything we do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl shadow-card border border-amber-100 p-7 card-hover"
              >
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-brand-teal" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-brand-blue font-serif mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Policies */}
      <section className="section-padding bg-brand-cream" aria-labelledby="policies-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
              Governance
            </p>
            <h2
              id="policies-heading"
              className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
            >
              Our Policies &amp; Procedures
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
              We maintain a comprehensive suite of policies in line with
              regulatory requirements. All policies are available on request.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {policies.map((policy) => (
              <div
                key={policy}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-amber-100"
              >
                <FileText className="w-5 h-5 text-brand-teal flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-700 text-sm font-medium">{policy}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            All policies available on request.{' '}
            <Link href="/contact" className="text-brand-teal hover:underline font-medium">
              Contact us
            </Link>{' '}
            for copies.
          </p>
        </div>
      </section>

      {/* 5. Regulatory Framework */}
      <section className="section-padding bg-brand-warm" aria-labelledby="regulatory-heading">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">
                Legal Framework
              </p>
              <h2
                id="regulatory-heading"
                className="text-3xl md:text-4xl font-bold text-brand-blue font-serif text-balance"
              >
                Regulatory Framework
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-amber-100 p-8 space-y-5">
              <p className="text-gray-600 leading-relaxed">
                Aster Homecare UK Ltd is registered and regulated under the{' '}
                <strong className="text-brand-blue">
                  Health and Social Care Act 2008
                </strong>{' '}
                and the Health and Social Care Act (Regulated Activities)
                Regulations 2014. Our registration with the Care Quality
                Commission (CQC) covers the provision of personal care as a
                regulated activity.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We comply fully with{' '}
                <strong className="text-brand-blue">Regulation 17</strong> —
                Good Governance — which requires us to maintain effective systems
                for assessing, monitoring, and improving the quality and safety
                of our services. This includes regular audits, client satisfaction
                surveys, staff supervision records, and incident reviews.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our Nominated Individual, Sanjeev Srichandan, holds overall
                responsibility for the oversight of regulated activities, ensuring
                that leadership, culture, and governance consistently reflect the
                highest standards expected by the CQC and the people we support.
              </p>

              <div className="border-l-4 border-brand-teal bg-amber-50 p-5 rounded-r-xl">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-brand-blue">Data Protection:</strong>{' '}
                  All personal data is processed in full compliance with the UK
                  General Data Protection Regulation (UK GDPR) and the Data
                  Protection Act 2018. We never share client data with third
                  parties without explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="bg-brand-navy text-white py-16" aria-labelledby="compliance-cta-heading">
        <div className="container-custom text-center">
          <h2
            id="compliance-cta-heading"
            className="text-3xl md:text-4xl font-bold font-serif mb-4 text-balance"
          >
            Confident in Our Standards?
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            View our full CQC profile or get in touch to learn more about how
            we deliver safe, high-quality care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://www.cqc.org.uk/provider/1-20633610286"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-light text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-warm text-base"
              aria-label="View our CQC profile (opens in new tab)"
            >
              <ExternalLink className="w-5 h-5" aria-hidden="true" />
              View CQC Profile
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border border-white/30 transition-colors text-base"
              aria-label="Contact Aster Homecare UK"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
