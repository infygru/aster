import 'server-only'
import { createDirectus, rest, staticToken, readItems, readSingleton } from '@directus/sdk'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DirectusService {
  id: string
  status: 'published' | 'draft' | 'archived'
  sort: number | null
  title: string
  slug: string
  description: string
  icon: string
  color: string
  features: string[]
  long_description?: string
  image?: string
}

export interface DirectusTestimonial {
  id: string
  status: 'published' | 'draft'
  sort: number | null
  quote: string
  author_name: string
  author_relation: string
  author_location: string
  rating: number
  date_created: string
}

export interface DirectusJobOpening {
  id: string
  status: 'published' | 'draft' | 'archived'
  sort: number | null
  title: string
  slug: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'flexible'
  description: string
  requirements: string[]
  salary_range?: string
  date_posted: string
  closing_date?: string
}

export interface DirectusTeamMember {
  id: string
  status: 'published' | 'draft'
  name: string
  role: string
  bio: string
  photo?: string
  nominated_individual: boolean
}

export interface DirectusSiteSettings {
  id: number
  site_name: string | null
  site_tagline: string | null
  logo: string | null
  logo_dark: string | null
  favicon: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  hero_video_url: string | null
  phone: string | null
  phone_display: string | null
  email: string | null
  email_careers: string | null
  address_line1: string | null
  address_line2: string | null
  address_city: string | null
  address_county: string | null
  address_postcode: string | null
  google_maps_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  twitter_x_url: string | null
  company_number: string | null
  cqc_provider_id: string | null
  cqc_location_id: string | null
  cqc_rating: string | null
  cqc_report_url: string | null
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  google_analytics_id: string | null
}

export interface Schema {
  services: DirectusService[]
  testimonials: DirectusTestimonial[]
  job_openings: DirectusJobOpening[]
  team: DirectusTeamMember[]
  site_settings: DirectusSiteSettings
}

// ─── Client ───────────────────────────────────────────────────────────────────

function getDirectusClient() {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is not set')
  }

  const token = process.env.DIRECTUS_TOKEN
  if (token) {
    return createDirectus<Schema>(url).with(rest()).with(staticToken(token))
  }

  return createDirectus<Schema>(url).with(rest())
}

// ─── Data Fetching Functions ───────────────────────────────────────────────────

/**
 * Fetch all published services, ordered by sort index.
 */
export async function getServices(): Promise<DirectusService[]> {
  try {
    const client = getDirectusClient()
    const services = await client.request(
      readItems('services', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
        fields: ['id', 'title', 'slug', 'description', 'icon', 'color', 'features', 'image'],
      })
    )
    return services as DirectusService[]
  } catch (error) {
    console.warn('[Directus] Failed to fetch services:', error)
    return []
  }
}

/**
 * Fetch a single service by slug.
 */
export async function getServiceBySlug(slug: string): Promise<DirectusService | null> {
  try {
    const client = getDirectusClient()
    const services = await client.request(
      readItems('services', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        limit: 1,
      })
    )
    return (services[0] as DirectusService) ?? null
  } catch (error) {
    console.warn(`[Directus] Failed to fetch service "${slug}":`, error)
    return null
  }
}

/**
 * Fetch published testimonials.
 */
export async function getTestimonials(): Promise<DirectusTestimonial[]> {
  try {
    const client = getDirectusClient()
    const testimonials = await client.request(
      readItems('testimonials', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
        limit: 6,
      })
    )
    return testimonials as DirectusTestimonial[]
  } catch (error) {
    console.warn('[Directus] Failed to fetch testimonials:', error)
    return []
  }
}

/**
 * Fetch open job vacancies.
 */
export async function getJobOpenings(): Promise<DirectusJobOpening[]> {
  try {
    const client = getDirectusClient()
    const jobs = await client.request(
      readItems('job_openings', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort', '-date_posted'],
      })
    )
    return jobs as DirectusJobOpening[]
  } catch (error) {
    console.warn('[Directus] Failed to fetch job openings:', error)
    return []
  }
}

/**
 * Fetch team members.
 */
export async function getTeamMembers(): Promise<DirectusTeamMember[]> {
  try {
    const client = getDirectusClient()
    const team = await client.request(
      readItems('team', {
        filter: { status: { _eq: 'published' } },
        sort: ['-nominated_individual', 'name'],
      })
    )
    return team as DirectusTeamMember[]
  } catch (error) {
    console.warn('[Directus] Failed to fetch team:', error)
    return []
  }
}

/**
 * Alias for getTeamMembers — used in new components.
 */
export async function getTeam(): Promise<DirectusTeamMember[]> {
  return getTeamMembers()
}

/**
 * Fetch global site settings (singleton).
 */
export async function getSiteSettings(): Promise<DirectusSiteSettings | null> {
  try {
    const client = getDirectusClient()
    const settings = await client.request(readSingleton('site_settings'))
    return settings as DirectusSiteSettings
  } catch (error) {
    console.warn('[Directus] Failed to fetch site settings:', error)
    return null
  }
}

/**
 * Build the full asset URL for Directus-hosted files.
 * Re-exported from lib/utils so server and client components both use the same implementation.
 */
export { getAssetUrl } from '@/lib/utils'
