import { Hero } from '@/components/home/Hero'
import { TrustSignals } from '@/components/home/TrustSignals'
import { ServiceGrid } from '@/components/home/ServiceGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { StatsSection } from '@/components/home/StatsSection'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogPreview } from '@/components/home/BlogPreview'
import { CTABanner } from '@/components/home/CTABanner'
import { getServices } from '@/lib/directus'

export default async function HomePage() {
  const services = await getServices()

  return (
    <>
      <Hero />
      <ServiceGrid services={services} />
      <TrustSignals />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <BlogPreview />
      <CTABanner />
    </>
  )
}
