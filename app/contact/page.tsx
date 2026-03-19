import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Aster Homecare UK for a free care assessment. Visit us at 7 Mackenzie Street, Slough, or call our team today.',
}

const contactCards = [
  {
    icon: MapPin,
    title: 'Office Address',
    lines: ['7 Mackenzie Street', 'Slough, Berkshire', 'SL1 1XQ'],
    href: undefined,
  },
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+44 (0)1753 000000'],
    href: 'tel:+441753000000',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['info@asterhomecare.co.uk'],
    href: 'mailto:info@asterhomecare.co.uk',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Mon – Fri: 9:00am – 5:30pm', '24/7 on-call for existing clients'],
    href: undefined,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero */}
      <section
        className="relative overflow-hidden hero-gradient text-white"
        aria-labelledby="contact-hero-heading"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative container-custom py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4">
              Contact Us
            </p>
            <h1
              id="contact-hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-balance mb-6 leading-tight"
            >
              Get In Touch
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
              Our team is here to help. Contact us to discuss your care needs
              and arrange a free, no-obligation assessment.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main content — two columns */}
      <section className="section-padding bg-brand-cream" aria-label="Contact information and enquiry form">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* LEFT: Contact info cards + map */}
            <div>
              <h2 className="text-2xl font-bold text-brand-blue font-serif mb-6">
                Contact Information
              </h2>

              <div className="space-y-4 mb-8">
                {contactCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className="bg-white border border-amber-100 p-5 rounded-xl flex gap-4 shadow-sm"
                    >
                      <div className="w-11 h-11 bg-brand-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-teal" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-blue text-sm mb-1">{card.title}</p>
                        {card.href ? (
                          <a
                            href={card.href}
                            className="text-gray-600 hover:text-brand-teal transition-colors text-sm"
                          >
                            {card.lines[0]}
                          </a>
                        ) : (
                          card.lines.map((line, i) => (
                            <p key={i} className="text-gray-600 text-sm">
                              {line}
                            </p>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Find Us card */}
              <div
                className="rounded-2xl border border-amber-100 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1D3461 0%, #2B4E8A 100%)' }}
              >
                <div className="p-6 text-white">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15">
                      <MapPin className="w-5 h-5 text-amber-300" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-lg text-white font-serif">Find Us</h3>
                  </div>
                  <address className="not-italic text-blue-100 leading-relaxed mb-5">
                    7 Mackenzie Street<br />
                    Slough, Berkshire<br />
                    SL1 1XQ<br />
                    United Kingdom
                  </address>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      Mon – Fri: 9:00am – 5:30pm
                    </div>
                    <div className="flex items-center gap-2 text-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      24/7 on-call for existing clients
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=7+Mackenzie+Street,+Slough,+SL1+1XQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-colors border border-white/25"
                  >
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact form card */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-card p-8">
              <h2 className="text-2xl font-bold text-brand-blue font-serif mb-2">
                Request a Free Assessment
              </h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                All enquiries are handled in strict confidence and in
                accordance with our GDPR-compliant privacy policy.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Emergency strip */}
      <section className="bg-brand-navy text-white py-12" aria-label="24/7 emergency contact information">
        <div className="container-custom text-center">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-2">
            Need Urgent Help?
          </p>
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3">
            24/7 Support Line Available
          </h2>
          <p className="text-blue-200 mb-6 max-w-lg mx-auto">
            For existing clients requiring urgent care support, our on-call
            team is available around the clock.
          </p>
          <a
            href="tel:+441753000000"
            className="inline-flex items-center justify-center gap-3 bg-brand-teal hover:bg-brand-teal-light text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-warm text-lg"
            aria-label="Call our 24/7 support line on 01753 000000"
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            01753 000000
          </a>
        </div>
      </section>
    </div>
  )
}
