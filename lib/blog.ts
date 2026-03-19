import 'server-only'
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BlogAuthor {
  id: number
  status: 'published' | 'draft'
  name: string
  slug: string
  job_title: string | null
  bio: string | null
  photo: string | null
  email: string | null
  twitter_url: string | null
  linkedin_url: string | null
  website_url: string | null
}

export interface BlogCategory {
  id: number
  status: 'published' | 'draft'
  sort: number | null
  name: string
  slug: string
  description: string | null
  color: string | null
  featured_image: string | null
  seo_title: string | null
  seo_description: string | null
}

export interface BlogTag {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface BlogPost {
  id: number
  status: 'published' | 'draft' | 'scheduled' | 'archived'
  sort: number | null
  is_featured: boolean
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image: string | null
  featured_image_alt: string | null
  author: BlogAuthor | number | null
  category: BlogCategory | number | null
  tags: Array<{ id: number; blog_tags_id: BlogTag | number }> | null
  published_at: string | null
  read_time: number | null
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  canonical_url: string | null
  no_index: boolean
  schema_type: 'BlogPosting' | 'Article' | 'NewsArticle' | null
  allow_comments: boolean
}

// ── Client ────────────────────────────────────────────────────────────────────

function client() {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL
  if (!url) throw new Error('NEXT_PUBLIC_DIRECTUS_URL not set')
  const token = process.env.DIRECTUS_TOKEN
  return token
    ? createDirectus(url).with(rest()).with(staticToken(token))
    : createDirectus(url).with(rest())
}

const POST_CARD_FIELDS = [
  'id', 'status', 'sort', 'is_featured', 'title', 'slug', 'excerpt',
  'featured_image', 'featured_image_alt', 'published_at', 'read_time',
  'author.id', 'author.name', 'author.slug', 'author.photo', 'author.job_title',
  'category.id', 'category.name', 'category.slug', 'category.color',
  'tags.id', 'tags.blog_tags_id.id', 'tags.blog_tags_id.name', 'tags.blog_tags_id.slug',
] as const

const POST_FULL_FIELDS = [
  ...POST_CARD_FIELDS,
  'content', 'seo_title', 'seo_description', 'og_image',
  'canonical_url', 'no_index', 'schema_type', 'allow_comments',
] as const

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatDate(iso: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', ...opts,
  })
}

export function getAuthor(post: BlogPost): BlogAuthor | null {
  if (!post.author || typeof post.author === 'number') return null
  return post.author
}

export function getCategory(post: BlogPost): BlogCategory | null {
  if (!post.category || typeof post.category === 'number') return null
  return post.category
}

export function getTags(post: BlogPost): BlogTag[] {
  if (!post.tags) return []
  return post.tags
    .map((t) => (typeof t.blog_tags_id === 'number' ? null : t.blog_tags_id))
    .filter(Boolean) as BlogTag[]
}

// ── Fetch Functions ───────────────────────────────────────────────────────────

const PER_PAGE = 9

export async function getBlogPosts(options?: {
  page?: number
  categorySlug?: string
  tagSlug?: string
  featured?: boolean
  limit?: number
}): Promise<BlogPost[]> {
  try {
    const { page = 1, categorySlug, tagSlug, featured, limit } = options ?? {}

    const filter: Record<string, unknown> = { status: { _eq: 'published' } }
    if (featured !== undefined) filter.is_featured = { _eq: featured }
    if (categorySlug) filter['category'] = { slug: { _eq: categorySlug } }

    const posts = await client().request(
      readItems('blog_posts' as never, {
        fields: POST_CARD_FIELDS as unknown as string[],
        filter,
        sort: ['-is_featured', '-published_at'],
        limit: limit ?? PER_PAGE,
        offset: limit ? 0 : (page - 1) * PER_PAGE,
        deep: tagSlug
          ? ({ tags: { blog_tags_id: { slug: { _eq: tagSlug } } } } as never)
          : undefined,
      })
    )
    return posts as unknown as BlogPost[]
  } catch (e) {
    console.warn('[Blog] getBlogPosts failed:', e)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await client().request(
      readItems('blog_posts' as never, {
        fields: POST_FULL_FIELDS as unknown as string[],
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        limit: 1,
      })
    )
    return (posts as unknown as BlogPost[])[0] ?? null
  } catch (e) {
    console.warn('[Blog] getBlogPost failed:', e)
    return null
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const posts = await client().request(
      readItems('blog_posts' as never, {
        fields: ['slug'] as string[],
        filter: { status: { _eq: 'published' } },
        limit: -1,
      })
    )
    return (posts as unknown as { slug: string }[]).map((p) => p.slug)
  } catch {
    return []
  }
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  try {
    const cat = getCategory(post)
    const filter: Record<string, unknown> = {
      status: { _eq: 'published' },
      id: { _neq: post.id },
      ...(cat ? { category: { slug: { _eq: cat.slug } } } : {}),
    }
    const posts = await client().request(
      readItems('blog_posts' as never, {
        fields: POST_CARD_FIELDS as unknown as string[],
        filter,
        sort: ['-published_at'],
        limit,
      })
    )
    const result = posts as unknown as BlogPost[]
    // If not enough from same category, backfill with recent posts
    if (result.length < limit) {
      const more = await client().request(
        readItems('blog_posts' as never, {
          fields: POST_CARD_FIELDS as unknown as string[],
          filter: { status: { _eq: 'published' }, id: { _nin: [post.id, ...result.map((p) => p.id)] } },
          sort: ['-published_at'],
          limit: limit - result.length,
        })
      )
      result.push(...(more as unknown as BlogPost[]))
    }
    return result
  } catch {
    return []
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const cats = await client().request(
      readItems('blog_categories' as never, {
        fields: ['id', 'name', 'slug', 'description', 'color', 'seo_title', 'seo_description'] as string[],
        filter: { status: { _eq: 'published' } },
        sort: ['sort', 'name'],
        limit: -1,
      })
    )
    return cats as unknown as BlogCategory[]
  } catch {
    return []
  }
}

export async function getBlogCategory(slug: string): Promise<BlogCategory | null> {
  try {
    const cats = await client().request(
      readItems('blog_categories' as never, {
        fields: ['*'] as string[],
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        limit: 1,
      })
    )
    return (cats as unknown as BlogCategory[])[0] ?? null
  } catch {
    return null
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const cats = await client().request(
      readItems('blog_categories' as never, {
        fields: ['slug'] as string[],
        filter: { status: { _eq: 'published' } },
        limit: -1,
      })
    )
    return (cats as unknown as { slug: string }[]).map((c) => c.slug)
  } catch {
    return []
  }
}

export async function getBlogTags(): Promise<BlogTag[]> {
  try {
    const tags = await client().request(
      readItems('blog_tags' as never, {
        fields: ['id', 'name', 'slug'] as string[],
        sort: ['name'],
        limit: -1,
      })
    )
    return tags as unknown as BlogTag[]
  } catch {
    return []
  }
}

export async function getBlogTag(slug: string): Promise<BlogTag | null> {
  try {
    const tags = await client().request(
      readItems('blog_tags' as never, {
        fields: ['*'] as string[],
        filter: { slug: { _eq: slug } },
        limit: 1,
      })
    )
    return (tags as unknown as BlogTag[])[0] ?? null
  } catch {
    return null
  }
}

export async function getAllTagSlugs(): Promise<string[]> {
  try {
    const tags = await client().request(
      readItems('blog_tags' as never, {
        fields: ['slug'] as string[],
        limit: -1,
      })
    )
    return (tags as unknown as { slug: string }[]).map((t) => t.slug)
  } catch {
    return []
  }
}

export async function getBlogPostCount(options?: { categorySlug?: string; tagSlug?: string }): Promise<number> {
  try {
    const { categorySlug, tagSlug } = options ?? {}
    const filter: Record<string, unknown> = { status: { _eq: 'published' } }
    if (categorySlug) filter['category'] = { slug: { _eq: categorySlug } }
    const posts = await client().request(
      readItems('blog_posts' as never, {
        fields: ['id'] as string[],
        filter,
        limit: -1,
        deep: tagSlug ? ({ tags: { blog_tags_id: { slug: { _eq: tagSlug } } } } as never) : undefined,
      })
    )
    return (posts as unknown[]).length
  } catch {
    return 0
  }
}

export { getAssetUrl } from '@/lib/utils'
