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
    lines: ['Mon – Fri: 9:00am – 5:30pm', '24/7 on-call clients'],
    href: undefined,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)' }}
        aria-labelledby="contact-hero-heading"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative container-custom py-20 md:py-28 text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0">
            <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4">
              Contact Us
            </p>
            <h1
              id="contact-hero-heading"
              className="text-white text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-balance mb-6 leading-tight"
            >
              Get In Touch
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Our team is here to help. Contact us to discuss your care needs
              and arrange a free, no-obligation assessment.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main content — Two Columns */}
      <section className="section-padding bg-slate-50" aria-label="Contact information and enquiry form">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* LEFT: Contact info cards */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">
                Contact Information
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you have a question about our care services, pricing, or anything else, our team is ready to answer all your questions.
              </p>

              <div className="space-y-4">
                {contactCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={card.title}
                      className="bg-white border border-slate-200 p-5 rounded-xl flex gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm mb-1">{card.title}</p>
                        <div className="text-slate-600 text-sm">
                          {card.href ? (
                            <a href={card.href} className="hover:text-blue-600 transition-colors">
                              {card.lines[0]}
                            </a>
                          ) : (
                            card.lines.map((line, i) => <p key={i}>{line}</p>)
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 font-serif">
                Request a Free Assessment
              </h2>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                Fill out the form below and a member of our team will get back to you shortly. All enquiries are handled in strict confidence.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Emergency strip */}
      <section className="bg-slate-900 text-white py-14" aria-label="24/7 emergency contact information">
        <div className="container-custom text-center">
          <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">
            Need Urgent Help?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white">
            <span className="text-blue-400">
              24/7 Support Line
            </span>{' '}
            Available
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
            For existing clients requiring urgent care support, our on-call
            team is available around the clock.
          </p>
          <a
            href="tel:+441753000000"
            className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-colors shadow-lg text-lg"
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
