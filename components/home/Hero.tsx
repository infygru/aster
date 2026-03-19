import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone, ShieldCheck, BadgeCheck, CheckCircle, Star, Users, Clock } from 'lucide-react'
import { getSiteSettings, getAssetUrl } from '@/lib/directus'

const metrics = [
  { value: '500+', label: 'Families Supported', icon: Users },
  { value: '5.0★', label: 'Client Rating',       icon: Star },
  { value: 'CQC',  label: 'Regulated Provider',  icon: ShieldCheck },
  { value: '24/7', label: 'On-Call Support',      icon: Clock },
]

export async function Hero() {
  const settings = await getSiteSettings()

  const phone     = settings?.phone_display || '01753 000000'
  const phoneHref = `tel:${settings?.phone || '+441753000000'}`
  const cqcId     = settings?.cqc_provider_id || '1-20633610286'
  const heroImage = settings?.hero_image
    ? getAssetUrl(settings.hero_image, { width: '1200', height: '900', fit: 'cover', quality: '88' })
    : null

  return (
    <section className="relative overflow-hidden" style={{ background: '#0F172A' }} aria-labelledby="hero-heading">

      {/* ── Decorative glow ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 65%)' }} />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.25) 0%, transparent 65%)' }} />
      </div>

      {/* ── Right-half hero image (desktop) ── */}
      <div className="absolute right-0 top-0 h-full hidden lg:block" style={{ width: '52%' }}>
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Professional home care — Aster Homecare UK"
            fill
            className="object-cover"
            priority
            sizes="52vw"
          />
        ) : (
          /* Fallback decorative gradient when no image set */
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(217,119,6,0.08) 100%)' }} />
        )}
        {/* Left-edge fade blending image into dark bg */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0F172A] to-transparent" />
        {/* Bottom scrim */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0F172A]/70 to-transparent" />
      </div>

      {/* ── Main content ── */}
      <div className="relative container-custom flex items-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="max-w-[640px] py-28 lg:py-32">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.35)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">
              CQC Registered · Slough &amp; Windsor
            </span>
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="font-extrabold leading-[1.05] tracking-tight mb-6 text-white"
            style={{ fontSize: 'clamp(3rem, 5.5vw, 5rem)' }}
          >
            Care That Feels<br />
            Like{' '}
            <span style={{
              background: 'linear-gradient(90deg, #60A5FA 0%, #FCD34D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Family.
            </span>
          </h1>

          <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: '#94A3B8' }}>
            CQC-registered home care across Slough, Windsor and surrounding areas — compassionate, expert support that preserves independence and dignity in your own home.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/assessment"
              className="group inline-flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-2xl text-white text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', boxShadow: '0 4px 24px rgba(37,99,235,0.45)' }}
            >
              Book Free Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-2xl text-sm transition-all duration-200"
              style={{ border: '1.5px solid rgba(255,255,255,0.18)', color: '#E2E8F0', background: 'rgba(255,255,255,0.04)' }}
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: ShieldCheck,  label: 'CQC Regulated' },
              { icon: BadgeCheck,   label: 'DBS Checked Staff' },
              { icon: CheckCircle,  label: 'Free Assessment' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                {label}
              </span>
            ))}
          </div>

          {/* CQC ID */}
          <p className="mt-6 text-xs" style={{ color: '#475569' }}>
            CQC Provider ID: <span style={{ color: '#64748B' }}>{cqcId}</span>
          </p>
        </div>
      </div>

      {/* ── Bottom metrics strip ── */}
      <div className="relative border-t" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(15,23,42,0.95)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className="flex items-center gap-3 py-5 px-4"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(37,99,235,0.15)' }}>
                  <m.icon className="w-4.5 h-4.5 text-blue-400 w-[18px] h-[18px]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-white font-black text-base leading-none">{m.value}</p>
                  <p className="text-xs mt-0.5 leading-none" style={{ color: '#64748B' }}>{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
