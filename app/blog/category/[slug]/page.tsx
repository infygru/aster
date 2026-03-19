import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getBlogPosts, getBlogCategory, getAllCategorySlugs,
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
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await getBlogCategory(slug)
  if (!cat) return { title: 'Category Not Found' }
  return {
    title: cat.seo_title || `${cat.name} — Care Advice Blog`,
    description: cat.seo_description || cat.description || `Browse ${cat.name} articles from Aster Homecare UK.`,
    alternates: { canonical: `/blog/category/${cat.slug}` },
    openGraph: {
      title: cat.seo_title || `${cat.name} — Aster Homecare Blog`,
      description: cat.seo_description || cat.description || undefined,
      type: 'website',
    },
  }
}

const PER_PAGE = 9

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const [cat, posts, categories, tags, total] = await Promise.all([
    getBlogCategory(slug),
    getBlogPosts({ categorySlug: slug, page }),
    getBlogCategories(),
    getBlogTags(),
    getBlogPostCount({ categorySlug: slug }),
  ])

  if (!cat) notFound()

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-2">Category</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{cat.name}</h1>
          {cat.description && (
            <p className="text-blue-100 text-lg leading-relaxed">{cat.description}</p>
          )}
        </div>
      </section>

      <div className="bg-brand-white section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-14">
            <main aria-label={`${cat.name} posts`}>
              {posts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">
                  No posts in this category yet — check back soon.
                </p>
              )}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/blog/category/${slug}`}
              />
            </main>

            <BlogSidebar
              categories={categories}
              tags={tags}
              recentPosts={posts.slice(0, 4)}
              activeCategorySlug={slug}
            />
          </div>
        </div>
      </div>
    </>
  )
}
