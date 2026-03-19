import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getBlogPosts, getBlogTag, getAllTagSlugs,
  getBlogCategories, getBlogTags, getBlogPostCount,
} from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { Pagination } from '@/components/blog/Pagination'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllTagSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await getBlogTag(slug)
  if (!tag) return { title: 'Tag Not Found' }
  return {
    title: `#${tag.name} — Care Advice Blog`,
    description: tag.description || `Browse articles tagged "${tag.name}" from Aster Homecare UK.`,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
    robots: { index: false, follow: true }, // tag pages are typically noindex
  }
}

const PER_PAGE = 9

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const [tag, posts, categories, tags] = await Promise.all([
    getBlogTag(slug),
    getBlogPosts({ tagSlug: slug, page }),
    getBlogCategories(),
    getBlogTags(),
  ])

  if (!tag) notFound()

  const totalPages = Math.ceil(posts.length / PER_PAGE) // approximate since we can't easily count by tag

  return (
    <>
      <section className="hero-gradient text-white section-padding">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-2">Tag</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">#{tag.name}</h1>
          {tag.description && (
            <p className="text-blue-100 text-lg leading-relaxed">{tag.description}</p>
          )}
        </div>
      </section>

      <div className="bg-brand-white section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-14">
            <main aria-label={`Posts tagged ${tag.name}`}>
              {posts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">
                  No posts tagged &ldquo;{tag.name}&rdquo; yet.
                </p>
              )}
              <Pagination currentPage={page} totalPages={totalPages} basePath={`/blog/tag/${slug}`} />
            </main>

            <BlogSidebar
              categories={categories}
              tags={tags}
              recentPosts={posts.slice(0, 4)}
              activeTagSlug={slug}
            />
          </div>
        </div>
      </div>
    </>
  )
}
