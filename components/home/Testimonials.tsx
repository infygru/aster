import { getTestimonials } from '@/lib/directus'
import { ScrollReveal } from '@/components/ScrollReveal'

const fallbackTestimonials = [
  {
    id: '1',
    quote:
      "The carers from Aster Homecare have been absolutely wonderful with my mother. They treat her with such dignity and kindness. I can't recommend them highly enough.",
    author_name: 'Sarah M.',
    author_relation: 'Daughter of client',
    author_location: 'Slough',
  },
  {
    id: '2',
    quote:
      'Since starting with Aster Homecare, my father has regained his confidence and independence. The medication support has given our family tremendous peace of mind.',
    author_name: 'James T.',
    author_relation: 'Son of client',
    author_location: 'Windsor',
  },
  {
    id: '3',
    quote:
      'Professional, compassionate, and reliable. The care coordinator is always responsive and genuinely cares about getting the right support in place.',
    author_name: 'Patricia H.',
    author_relation: 'Care recipient',
    author_location: 'Slough',
  },
]

export async function Testimonials() {
  const data = await getTestimonials()
  const testimonials = data.length > 0 ? data : fallbackTestimonials

  return (
    <section className="section-padding" style={{ background: '#FFFFFF' }} aria-labelledby="testimonials-heading">
      <div className="container-custom">
        <ScrollReveal animation="up">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
              What Families Say
            </span>
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-bold text-balance" style={{ color: '#0F172A' }}
            >
              Trusted by Families Across Our Area
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((t, i) => (
            <ScrollReveal key={t.id} animation="up" delay={(i as 0 | 1 | 2)}>
              <blockquote className="relative bg-white rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full"
                style={{ border: '1px solid #E2E8F0' }}>
                {/* Large quote mark */}
                <div
                  className="text-6xl font-sans leading-none mb-4"
                  style={{ color: '#D97706', lineHeight: '1' }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="leading-relaxed flex-1 mb-6 text-sm" style={{ color: '#64748B' }}>{t.quote}</p>
                <footer className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                  {/* Avatar circle with initials */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #D97706)' }}
                    aria-hidden="true"
                  >
                    {t.author_name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <cite className="not-italic">
                    <p className="font-bold text-sm" style={{ color: '#0F172A' }}>{t.author_name}</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                      {t.author_relation}
                      {t.author_location ? ` · ${t.author_location}` : ''}
                    </p>
                  </cite>
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
