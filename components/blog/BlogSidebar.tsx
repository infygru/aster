import Link from 'next/link'
import Image from 'next/image'
import { Tag, Folder, ArrowRight } from 'lucide-react'
import type { BlogPost, BlogCategory, BlogTag } from '@/lib/blog'
import { formatDate, getCategory, getAssetUrl } from '@/lib/blog'

interface BlogSidebarProps {
  categories: BlogCategory[]
  tags: BlogTag[]
  recentPosts: BlogPost[]
  activeCategorySlug?: string
  activeTagSlug?: string
}

export function BlogSidebar({ categories, tags, recentPosts, activeCategorySlug, activeTagSlug }: BlogSidebarProps) {
  return (
    <aside className="space-y-8" aria-label="Blog sidebar">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-brand-cream rounded-xl border border-amber-100 shadow-sm p-6">
          <h2 className="flex items-center gap-2 font-semibold text-brand-blue mb-4 text-sm uppercase tracking-wider">
            <Folder className="w-4 h-4 text-brand-teal" aria-hidden="true" />
            Categories
          </h2>
          <ul className="space-y-1" role="list">
            <li>
              <Link
                href="/blog"
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  !activeCategorySlug
                    ? 'bg-brand-teal/10 text-brand-teal font-medium'
                    : 'text-gray-600 hover:text-brand-teal hover:bg-brand-warm'
                }`}
                aria-current={!activeCategorySlug ? 'page' : undefined}
              >
                <span>All Posts</span>
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/blog/category/${cat.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategorySlug === cat.slug
                      ? 'bg-brand-teal/10 text-brand-teal font-medium'
                      : 'text-gray-600 hover:text-brand-teal hover:bg-brand-warm'
                  }`}
                  aria-current={activeCategorySlug === cat.slug ? 'page' : undefined}
                >
                  <span className="flex items-center gap-2">
                    {cat.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                        aria-hidden="true"
                      />
                    )}
                    {cat.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-brand-cream rounded-xl border border-amber-100 shadow-sm p-6">
          <h2 className="font-semibold text-brand-blue mb-4 text-sm uppercase tracking-wider">
            Recent Posts
          </h2>
          <ul className="space-y-4" role="list">
            {recentPosts.map((post) => {
              const imgUrl = post.featured_image
                ? getAssetUrl(post.featured_image, { width: '80', height: '80', fit: 'cover', quality: '70' })
                : null
              return (
                <li key={post.id} className="flex gap-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-brand-blue to-brand-teal"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block text-sm font-medium text-gray-800 hover:text-brand-teal leading-snug line-clamp-2 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(post.published_at)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-brand-cream rounded-xl border border-amber-100 shadow-sm p-6">
          <h2 className="flex items-center gap-2 font-semibold text-brand-blue mb-4 text-sm uppercase tracking-wider">
            <Tag className="w-4 h-4 text-brand-teal" aria-hidden="true" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className={`inline-block text-xs px-3 py-1.5 rounded-full transition-colors ${
                  activeTagSlug === tag.slug
                    ? 'bg-brand-teal text-white font-medium'
                    : 'bg-amber-50 text-gray-600 hover:bg-brand-teal/10 hover:text-brand-teal'
                }`}
                aria-current={activeTagSlug === tag.slug ? 'page' : undefined}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand-blue to-brand-teal rounded-xl p-6 text-white">
        <h2 className="font-bold text-lg mb-2">Need Care Advice?</h2>
        <p className="text-blue-100 text-sm leading-relaxed mb-4">
          Our care experts are here to help. Book a free, no-obligation assessment today.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand-navy text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-blue-light transition-colors"
        >
          Free Assessment
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}
