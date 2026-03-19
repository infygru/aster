import { Heart, Users, User, Brain, HeartHandshake, Accessibility, Eye, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  features?: string[]
  color?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  heart:             Heart,
  users:             Users,
  user:              User,
  brain:             Brain,
  'heart-handshake': HeartHandshake,
  accessibility:     Accessibility,
  eye:               Eye,
  pill:              Heart,
}

const accentColors: Record<string, { iconBg: string; iconColor: string; checkColor: string }> = {
  teal:    { iconBg: '#F0FDFA', iconColor: '#0D9488', checkColor: '#0D9488' },
  sky:     { iconBg: '#F0F9FF', iconColor: '#0EA5E9', checkColor: '#0EA5E9' },
  cyan:    { iconBg: '#ECFEFF', iconColor: '#0891B2', checkColor: '#0891B2' },
  emerald: { iconBg: '#ECFDF5', iconColor: '#059669', checkColor: '#059669' },
  indigo:  { iconBg: '#F0FDFA', iconColor: '#0D9488', checkColor: '#0D9488' },
  violet:  { iconBg: '#F0F9FF', iconColor: '#0EA5E9', checkColor: '#0EA5E9' },
  blue:    { iconBg: '#F0F9FF', iconColor: '#0EA5E9', checkColor: '#0EA5E9' },
  purple:  { iconBg: '#F0FDFA', iconColor: '#0D9488', checkColor: '#0D9488' },
  gold:    { iconBg: '#F0FDFA', iconColor: '#0D9488', checkColor: '#0D9488' },
}

export function ServiceCard({ service }: { service: Service }) {
  const Icon = iconMap[service.icon || 'heart'] || Heart
  const c = accentColors[service.color || 'teal'] || accentColors.teal

  return (
    <article
      className="group bg-white rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      aria-labelledby={`service-${service.id}-title`}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105"
        style={{ background: c.iconBg }}>
        <span style={{ color: c.iconColor }} aria-hidden="true"><Icon className="w-5 h-5" /></span>
      </div>

      <h3 id={`service-${service.id}-title`}
        className="text-base font-bold mb-2 leading-snug" style={{ color: '#0F172A' }}>
        {service.title}
      </h3>

      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#64748B' }}>
        {service.description}
      </p>

      {service.features && service.features.length > 0 && (
        <ul className="space-y-1.5 mb-5" role="list">
          {service.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#64748B' }}>
              <span style={{ color: c.checkColor }} aria-hidden="true"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /></span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <Link href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto transition-colors duration-200"
        style={{ color: c.iconColor }}
        aria-label={`Learn more about ${service.title}`}>
        Learn more
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </Link>
    </article>
  )
}
