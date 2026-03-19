import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, ShieldCheck } from 'lucide-react'
import { CQCBadge } from '@/components/CQCBadge'
import type { DirectusSiteSettings } from '@/lib/directus'
import { getAssetUrl } from '@/lib/directus'

const footerServices = [
  { label: 'Personal Care',             href: '/services/personal-care' },
  { label: 'Caring for Adults Over 65', href: '/services/adults-over-65' },
  { label: 'Caring for Adults Under 65',href: '/services/adults-under-65' },
  { label: 'Dementia Care',             href: '/services/dementia' },
  { label: 'Mental Health Support',     href: '/services/mental-health' },
  { label: 'Physical Disabilities',     href: '/services/physical-disabilities' },
  { label: 'Sensory Impairments',       href: '/services/sensory-impairments' },
]

const footerCompany = [
  { label: 'About Us',         href: '/about' },
  { label: 'Quality of Care',  href: '/compliance' },
  { label: 'Our Team',         href: '/about#team' },
  { label: 'Careers',          href: '/careers' },
  { label: 'Blog',             href: '/blog' },
  { label: 'Contact Us',       href: '/contact' },
]

const footerAreas = [
  { label: 'Home Care Slough',      href: '/services' },
  { label: 'Home Care Windsor',     href: '/services' },
  { label: 'Home Care Maidenhead',  href: '/services' },
  { label: 'Home Care Bracknell',   href: '/services' },
  { label: 'Home Care Reading',     href: '/services' },
  { label: 'Home Care Wokingham',   href: '/services' },
  { label: 'Home Care Berkshire',   href: '/services' },
]

const footerLegal = [
  { label: 'Privacy Policy',    href: '/privacy' },
  { label: 'Cookie Policy',     href: '/cookies' },
  { label: 'Terms of Service',  href: '/terms' },
  { label: 'Complaints Policy', href: '/complaints' },
]

interface FooterProps {
  settings: DirectusSiteSettings | null
}

export function Footer({ settings }: FooterProps) {
  const phone = settings?.phone_display || '01753 000000'
  const phoneHref = `tel:${settings?.phone || '+441753000000'}`
  const email = settings?.email || 'info@asterhomecare.co.uk'
  const siteName = settings?.site_name || 'Aster Homecare UK'

  const address = [
    settings?.address_line1 || '7 Mackenzie Street',
    settings?.address_line2,
    settings?.address_city || 'Slough',
    settings?.address_county || 'Berkshire',
    settings?.address_postcode || 'SL1 1XQ',
  ].filter(Boolean).join(', ')

  const socialLinks = [
    { url: settings?.facebook_url,  Icon: Facebook,  label: 'Facebook' },
    { url: settings?.instagram_url, Icon: Instagram, label: 'Instagram' },
    { url: settings?.linkedin_url,  Icon: Linkedin,  label: 'LinkedIn' },
    { url: settings?.twitter_x_url, Icon: Twitter,   label: 'X (Twitter)' },
  ].filter((s) => s.url)

  return (
    <footer style={{ background: `radial-gradient(ellipse 900px 500px at 15% 40%, rgba(99,102,241,0.18) 0%, transparent 65%), radial-gradient(ellipse 700px 400px at 85% 65%, rgba(37,99,235,0.14) 0%, transparent 65%), radial-gradient(ellipse 500px 300px at 55% 5%, rgba(217,119,6,0.08) 0%, transparent 55%), linear-gradient(160deg, #020617 0%, #0B1120 100%)` }} className="text-white" role="contentinfo">

      {/* SEO intro strip */}
      <div className="border-b border-white/10">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <div className="flex-1">
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                <span className="text-white font-semibold">Aster Homecare UK</span> is a CQC-registered home care provider
                delivering expert, compassionate care in <span className="text-white">Slough, Windsor, Maidenhead, Bracknell, Reading, Wokingham</span> and
                across Berkshire. Our specialist services support older adults, people with dementia, mental health conditions, physical and sensory disabilities.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-blue-400" aria-hidden="true" />
              <div>
                <p className="text-white font-bold text-sm">CQC Registered</p>
                <p className="text-slate-400 text-xs">Provider ID: 1-20633610286</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 md:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4" aria-label={`${siteName} - Home`}>
              {settings?.logo_dark ? (
                <Image
                  src={getAssetUrl(settings.logo_dark)}
                  alt={siteName}
                  width={140}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' }}>
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">Aster Homecare</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">UK Ltd</p>
                  </div>
                </>
              )}
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              CQC-registered home care provider delivering compassionate, person-centred care in Slough and across our service areas since our founding.
            </p>

            <CQCBadge variant="footer" />

            {/* Contact details */}
            <ul className="mt-5 space-y-2.5" role="list">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                {settings?.google_maps_url ? (
                  <a href={settings.google_maps_url} target="_blank" rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white text-sm transition-colors not-italic">
                    <address className="not-italic">
                      {settings.address_line1}<br />
                      {settings.address_line2 && <>{settings.address_line2}<br /></>}
                      {settings.address_city}, {settings.address_county} {settings.address_postcode}
                    </address>
                  </a>
                ) : (
                  <address className="text-slate-300 text-sm not-italic">{address}</address>
                )}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                <a href={phoneHref} className="text-slate-300 hover:text-white text-sm transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${email}`} className="text-slate-300 hover:text-white text-sm transition-colors">{email}</a>
              </li>
            </ul>

            {/* Social */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialLinks.map(({ url, Icon, label }) => (
                  <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-blue-600">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-2" role="list">
              {footerServices.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Company</h3>
            <ul className="space-y-2" role="list">
              {footerCompany.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Covered */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Areas We Cover</h3>
            <ul className="space-y-2" role="list">
              {footerAreas.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} {siteName} Ltd. All rights reserved.
            {settings?.company_number && <> Company No. {settings.company_number}.</>}{' '}
            Registered in England &amp; Wales. CQC Provider ID: 1-20633610286.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-center">
            {footerLegal.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-500 hover:text-white text-xs transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
