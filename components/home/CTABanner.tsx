import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { getSiteSettings } from '@/lib/directus'

export async function CTABanner() {
  const settings = await getSiteSettings()
  const phone = settings?.phone_display || '01753 000000'
  const phoneHref = `tel:${settings?.phone || '+441753000000'}`

  return (
    <section
      className="relative overflow-hidden py-16 md:py-20"
      style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)' }}
      aria-labelledby="cta-heading"
    >
      {/* Subtle pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #DBEAFE, transparent)' }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #FEF3C7, transparent)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
      </div>

      <div className="relative container-custom text-center">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-balance mb-4 text-white">
          Ready to Discuss Your Care Needs?
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed text-blue-50" style={{ opacity: 0.9 }}>
          Book a free, no-obligation care assessment. Our team will work with you to create the perfect care plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/assessment"
            className="group inline-flex items-center justify-center gap-2 bg-white font-bold py-3.5 px-8 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#1D4ED8', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
          >
            Request Free Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href={phoneHref}
            className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-8 rounded-2xl transition-all duration-200 hover:bg-white/10 text-white"
            style={{ border: '2px solid rgba(255,255,255,0.4)' }}
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
