import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { getSiteSettings, getAssetUrl } from '@/lib/directus'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title = settings?.seo_title || 'Aster Homecare UK | CQC Registered Home Care in Slough'
  const description =
    settings?.seo_description ||
    'Aster Homecare UK provides compassionate, CQC-registered home care services in Slough and Berkshire. Personal care, companionship, and medication support tailored to your needs.'
  const siteName = settings?.site_name || 'Aster Homecare UK'
  const ogImageUrl = settings?.og_image ? getAssetUrl(settings.og_image) : '/og-image.svg'

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      'home care Slough',
      'personal care Berkshire',
      'CQC registered care UK',
      'home care agency Slough',
      'elderly care Berkshire',
      'domiciliary care Slough',
      'care at home Berkshire',
    ],
    authors: [{ name: `${siteName} Ltd` }],
    creator: `${siteName} Ltd`,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://asterhomecare.co.uk'
    ),
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url: '/',
      siteName,
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(settings?.google_analytics_id && {
      verification: { google: settings.google_analytics_id },
    }),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Navbar settings={settings} />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer settings={settings} />
        <Toaster />
      </body>
    </html>
  )
}
