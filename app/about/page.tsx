import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Shield, Award, Users, ExternalLink, CheckCircle, MapPin, Star } from 'lucide-react'
import { getTeam, getAssetUrl } from '@/lib/directus'
import type { DirectusTeamMember } from '@/lib/directus'

export const metadata: Metadata = {
  title: 'About Us | Aster Homecare UK',
  description:
    'Learn about Aster Homecare UK, our mission, values, and our CQC-registered care services in Slough and Berkshire. Meet our Nominated Individual, Sanjeev Srichandan.',
}

const coreValues = [
  {
    icon: Heart,
    title: 'Compassion',
    description:
      'We treat every client with warmth, dignity, and genuine care — as if they were our own family.',
    color: '#EFF6FF',
    iconColor: '#2563EB',
  },
  {
    icon: Shield,
    title: 'Safety',
    description:
      'Fully compliant with the Health and Social Care Act 2008, ensuring the safest environment for every client.',
    color: '#F0FDF4',
    iconColor: '#16A34A',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We continuously invest in staff training and quality improvement to deliver consistently outstanding outcomes.',
    color: '#FFFBEB',
    iconColor: '#D97706',
  },
  {
    icon: Users,
    title: 'Person-Centred',
    description:
      'Every care plan is individually tailored, respecting personal preferences and promoting independence.',
    color: '#FDF4FF',
    iconColor: '#9333EA',
  },
]

const highlights = [
  { value: 'CQC', label: 'Registered Provider' },
  { value: '2024', label: 'Est. in Berkshire' },
  { value: '7+', label: 'Specialist Services' },
  { value: '24/7', label: 'On-Call Support' },
]

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function TeamCard({ member }: { member: DirectusTeamMember }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="relative h-56 bg-blue-50 overflow-hidden">
        {member.photo ? (
          <Image
            src={getAssetUrl(member.photo, { width: '400', height: '300', fit: 'cover' })}
            alt={member.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}>
            <span className="text-white text-4xl font-bold">{getInitials(member.name)}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
        <p className="text-blue-600 text-sm font-semibold mb-2">{member.role}</p>
        {member.bio && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
        )}
      </div>
    </div>
  )
}

export default async function AboutPage() {
  const team = await getTeam()

  return (
    <div className="min-h-screen">

      {/* 1. Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}
        aria-labelledby="about-hero-heading"
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #D97706, transparent)' }} />
        </div>

        <div className="relative container-custom py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4">
              About Aster Homecare UK
            </p>
            <h1
              id="about-hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance mb-6 leading-tight"
            >
              Care Built on Trust,<br />Delivered with Heart
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-10 max-w-2xl">
              Founded with a simple belief: every person deserves to live comfortably and with dignity in their own home. We are a CQC-registered provider committed to making that possible across Slough and Berkshire.
            </p>

            {/* Stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {highlights.map((h) => (
                <div key={h.label} className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">{h.value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{h.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision + CQC Card */}
      <section className="section-padding bg-white" aria-labelledby="mission-heading">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left: Mission + Vision */}
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
                What Drives Us
              </p>
              <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                Our Mission &amp; Vision
              </h2>

              <div className="space-y-7">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-slate-900">Mission</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-3">
                    To provide high-quality, compassionate home care that enables individuals to maintain their independence, well-being, and quality of life in the comfort of their own homes.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-amber-500 rounded-full" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-slate-900">Vision</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-3">
                    To be the most trusted and respected home care provider in Berkshire, recognised for outstanding care, our dedicated team, and our positive impact on the communities we serve.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-xl">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Legal Compliance:</strong>{' '}
                    Aster Homecare UK Ltd operates in full compliance with the{' '}
                    <strong>Health and Social Care Act 2008</strong> and the Health and Social Care Act (Regulated Activities) Regulations 2014.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: CQC Registration card */}
            <div className="rounded-2xl p-8 text-white"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold">CQC Registration</h3>
              </div>

              <div className="overflow-x-auto -mx-1"><table className="w-full text-sm min-w-[280px]" aria-label="CQC registration details">
                <tbody className="divide-y divide-white/10">
                  {[
                    { label: 'Provider Name', value: 'Aster Homecare UK Ltd' },
                    { label: 'Provider ID', value: '1-20633610286' },
                    { label: 'Nominated Individual', value: 'Sanjeev Srichandan' },
                    { label: 'Registration Type', value: 'Domiciliary Care Agency' },
                    { label: 'Location', value: 'Slough, Berkshire' },
                    { label: 'Status', value: '✓ Registered', highlight: true },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="py-3 text-blue-200">{row.label}</td>
                      <td className={`py-3 font-medium text-right ${'highlight' in row && row.highlight ? 'text-green-300' : 'text-white'}`}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>

              <Link
                href="https://www.cqc.org.uk/provider/1-20633610286"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white py-3 px-5 rounded-xl font-semibold text-sm transition-colors"
                aria-label="View Aster Homecare UK profile on CQC website (opens in new tab)"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                View CQC Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Story */}
      <section className="section-padding bg-slate-50" aria-labelledby="story-heading">
        <div className="container-custom">
          <div className="grid md:grid-cols-5 gap-12 items-start max-w-5xl mx-auto">
            <div className="md:col-span-3">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
              <h2 id="story-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Aster Homecare Was Founded
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>
                  Aster Homecare UK was founded in 2024 with a clear purpose: to bridge a gap in quality, person-centred home care across Slough and Berkshire. Our founder, Sanjeev Srichandan, recognised that too many families were struggling to find care services that genuinely prioritised the individual — their preferences, routines, and dignity.
                </p>
                <p>
                  Starting with a small but dedicated team, we built Aster Homecare on values that matter: compassion, safety, and respect. From the very first day, every decision we have made has been guided by one simple question — &ldquo;Is this the best possible care for this person?&rdquo;
                </p>
                <p>
                  As a CQC-registered provider, we hold ourselves to the highest regulatory standards. But beyond compliance, we believe outstanding care comes from the heart — and that is what sets our team apart.
                </p>
              </div>
            </div>

            {/* Side card */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-slate-700 text-sm leading-relaxed italic mb-5">
                  &ldquo;Every person we care for is someone&apos;s parent, grandparent, or loved one. That responsibility shapes everything we do — from how we recruit our carers to how we design each individual care plan.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}>
                    SS
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Sanjeev Srichandan</p>
                    <p className="text-slate-500 text-xs">Founder &amp; Nominated Individual</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-600 rounded-2xl p-6 text-white">
                <MapPin className="w-6 h-6 text-blue-200 mb-3" aria-hidden="true" />
                <p className="font-bold text-base mb-1">Serving Berkshire Since 2024</p>
                <p className="text-blue-100 text-sm leading-relaxed">Slough, Windsor, Maidenhead, Bracknell, Reading &amp; Wokingham</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="section-padding bg-white" aria-labelledby="values-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              What We Stand For
            </p>
            <h2 id="values-heading" className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Core Values
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Every interaction, every care visit, every decision — guided by these principles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl border border-slate-200 p-7 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: value.color }}>
                    <span style={{ color: value.iconColor }} aria-hidden="true"><Icon className="w-7 h-7" /></span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Nominated Individual */}
      <section className="section-padding bg-slate-50" aria-labelledby="ni-heading">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Top accent bar */}
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #1D4ED8, #2563EB, #D97706)' }} />
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="flex-shrink-0">
                    <div
                      className="w-28 h-28 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md"
                      style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}
                    >
                      SS
                    </div>
                    <div className="mt-3 text-center">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        CQC Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-1">
                      Nominated Individual
                    </p>
                    <h2 id="ni-heading" className="text-2xl font-bold text-slate-900 mb-4">
                      Sanjeev Srichandan
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      As the Nominated Individual for Aster Homecare UK Ltd, Sanjeev Srichandan is responsible for supervising the management of regulated activities and ensuring the organisation consistently meets CQC standards. With deep expertise in health and social care compliance, Sanjeev leads our commitment to delivering safe, effective, and compassionate care to every client.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        CQC Provider ID: 1-20633610286
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        Domiciliary Care Agency
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Team */}
      {team.length > 0 && (
        <section className="section-padding bg-white" aria-labelledby="team-heading">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Our People</p>
              <h2 id="team-heading" className="text-3xl md:text-4xl font-bold text-slate-900">
                Meet Our Team
              </h2>
              <p className="text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
                Dedicated professionals united by a passion for outstanding home care.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Why Work With Us */}
      <section className="section-padding bg-slate-50" aria-labelledby="why-heading">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Promise</p>
              <h2 id="why-heading" className="text-3xl md:text-4xl font-bold text-slate-900">
                Why Families Trust Aster Homecare
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'CQC Registered & fully regulated',
                'All carers fully DBS-checked',
                'Personalised, written care plans',
                '24/7 on-call management support',
                'Regular quality review visits',
                'GDPR-compliant data handling',
                'Continuous staff training & development',
                'Local team with deep Berkshire knowledge',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-200">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
                  <span className="text-slate-700 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section
        className="text-white py-20"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}
        aria-labelledby="about-cta-heading"
      >
        <div className="container-custom text-center">
          <h2 id="about-cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discuss Your Care Needs?
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Our friendly team is here to help — no obligation, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl text-base btn-assessment"
              aria-label="Request a free care assessment"
            >
              Free Care Assessment
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-colors text-base"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
