'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { DirectusSiteSettings } from '@/lib/directus'
import { getAssetUrl } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

interface NavbarProps {
  settings: DirectusSiteSettings | null
}

export function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const siteName = settings?.site_name || 'Aster Homecare'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-sm border-b border-slate-200'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
      role="banner"
    >
      <nav
        className="container-custom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center h-20 gap-8">
          {/* Logo — far left */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label={`${siteName} - Home`}
          >
            {settings?.logo ? (
              <Image
                src={getAssetUrl(settings.logo)}
                alt={siteName}
                width={200}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            ) : (
              <Image
                src="/logo.jpg"
                alt={siteName}
                width={200}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            )}
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Nav — all right-aligned */}
          <ul className="hidden lg:flex items-center gap-0.5" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/assessment"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold py-2.5 px-5 rounded-xl btn-assessment"
              aria-label="Request a free care assessment"
            >
              Free Assessment
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-slate-100 pb-6"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="pt-3 space-y-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'text-blue-700 bg-blue-50 font-semibold'
                        : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-4">
              <Link
                href="/assessment"
                className="block w-full text-center py-3 px-4 rounded-xl font-bold text-sm btn-assessment"
              >
                Free Assessment
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
