import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { getBlogPosts, getCategory, getAssetUrl } from '@/lib/blog'
import type { BlogPost } from '@/lib/blog'

function BlogCard({ post }: { post: BlogPost }) {
  const category = getCategory(post)

  return (
    <article className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      {/* Featured image */}
      <div className="relative h-48 overflow-hidden" style={{ background: '#F0FDFA' }}>
        {post.featured_image ? (
          <Image
            src={getAssetUrl(post.featured_image, { width: '600', height: '300', fit: 'cover' })}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-60" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }} />
        )}
        {/* Category badge overlay */}
        {category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: category.color || '#0D9488' }}
            >
              {category.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-snug" style={{ color: '#0F172A' }}>
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: '#64748B' }}>
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
          {post.read_time && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {post.read_time} min read
            </span>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-sm transition-colors group ml-auto"
            style={{ color: '#0D9488' }}
            aria-label={`Read more about ${post.title}`}
          >
            Read More
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function BlogPreview() {
  let posts: BlogPost[] = []

  try {
    posts = await getBlogPosts({ limit: 3 })
  } catch {
    return null
  }

  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="bg-white section-padding" aria-labelledby="blog-preview-heading">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: '#0D9488' }}>
            Our Blog
          </p>
          <h2
            id="blog-preview-heading"
            className="text-3xl md:text-4xl font-bold text-balance"
            style={{ color: '#0F172A' }}
          >
            Care Advice &amp; Insights
          </h2>
          <p className="mt-4 max-w-xl mx-auto leading-relaxed" style={{ color: '#64748B' }}>
            Helpful articles, tips, and guidance for families navigating home
            care choices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 text-white font-semibold py-3 px-7 rounded-xl transition-all hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)', boxShadow: '0 6px 24px rgba(13,148,136,0.30)' }}
            aria-label="View all care advice articles"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
