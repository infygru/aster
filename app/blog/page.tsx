import type { Metadata } from 'next'
import {
  getBlogPosts, getBlogCategories, getBlogTags, getBlogPostCount
} from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { Pagination } from '@/components/blog/Pagination'

export const metadata: Metadata = {
  title: 'Care Advice Blog | Home Care Tips & Guidance',
  description:
    'Expert articles on home care, medication support, companionship, and navigating the UK care system — from the Aster Homecare team in Slough and Berkshire.',
  openGraph: {
    title: 'Care Advice Blog | Aster Homecare UK',
    description: 'Expert home care articles and guidance from Aster Homecare UK.',
    type: 'website',
  },
  alternates: { canonical: '/blog' },
}

const PER_PAGE = 9

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const [allPosts, categories, tags, total] = await Promise.all([
    getBlogPosts({ page }),
    getBlogCategories(),
    getBlogTags(),
    getBlogPostCount(),
  ])

  const featuredPost = page === 1 ? allPosts.find((p) => p.is_featured) : null
  const gridPosts = featuredPost ? allPosts.filter((p) => p.id !== featuredPost.id) : allPosts
  const recentPosts = allPosts.slice(0, 4)
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3">Our Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Care Advice &amp; Guidance
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Expert articles on home care, elderly wellbeing, and navigating the UK care system —
            written by the Aster Homecare team.
          </p>
        </div>
      </section>

      <div className="bg-brand-white section-padding">
        <div className="container-custom">
          {/* Featured post */}
          {featuredPost && (
            <div className="mb-12">
              <BlogCard post={featuredPost} featured />
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_320px] gap-10 xl:gap-14">
            {/* Main grid */}
            <main aria-label="Blog posts">
              {gridPosts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-12 text-center">No posts published yet — check back soon.</p>
              )}

              <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
            </main>

            {/* Sidebar */}
            <BlogSidebar
              categories={categories}
              tags={tags}
              recentPosts={recentPosts}
            />
          </div>
        </div>
      </div>
    </>
  )
}
