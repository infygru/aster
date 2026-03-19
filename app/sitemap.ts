import type { MetadataRoute } from 'next'
import { getAllBlogSlugs, getAllCategorySlugs } from '@/lib/blog'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://asterhomecare.co.uk'

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
  { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE}/compliance`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, categorySlugs] = await Promise.all([
    getAllBlogSlugs(),
    getAllCategorySlugs(),
  ])

  const blogPosts: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogCategories: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE}/blog/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...STATIC_PAGES, ...blogCategories, ...blogPosts]
}
