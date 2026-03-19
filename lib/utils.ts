import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Build a full Directus asset URL — safe to use in both server and client components.
 */
export function getAssetUrl(fileId: string, params?: Record<string, string>): string {
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || ''
  const searchParams = params ? '?' + new URLSearchParams(params).toString() : ''
  return `${baseUrl}/assets/${fileId}${searchParams}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim()
}
