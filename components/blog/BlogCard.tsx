import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Tag } from 'lucide-react'
import type { BlogPost } from '@/lib/blog'
import { formatDate, getAuthor, getCategory, getTags, getAssetUrl } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const author = getAuthor(post)
  const category = getCategory(post)
  const tags = getTags(post).slice(0, 3)
  const imgUrl = post.featured_image
    ? getAssetUrl(post.featured_image, { width: featured ? '1200' : '640', height: featured ? '630' : '360', fit: 'cover', quality: '80' })
    : null

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 lg:grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 lg:h-full min-h-[280px] bg-gradient-to-br from-brand-blue to-brand-teal overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/30 text-8xl font-bold select-none">A</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r" />
          {/* Featured badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 bg-brand-gold text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
              ★ Featured
            </span>
          </div>
          {category && (
            <div className="absolute bottom-4 left-4">
              <Link
                href={`/blog/category/${category.slug}`}
                className="inline-block text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full transition-colors"

              >
                {category.name}
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {formatDate(post.published_at)}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {post.read_time} min read
              </span>
            )}
          </div>

          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-2xl font-bold text-brand-blue leading-snug mb-3 group-hover:text-brand-teal transition-colors">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="text-gray-600 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 px-2.5 py-1 rounded-full transition-colors"
                >
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            {author && (
              <div className="flex items-center gap-2">
                {author.photo ? (
                  <Image
                    src={getAssetUrl(author.photo, { width: '40', height: '40', fit: 'cover' })}
                    alt={author.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-teal" aria-hidden="true" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{author.name}</span>
              </div>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:text-brand-blue transition-colors"
              aria-label={`Read ${post.title}`}
            >
              Read article →
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // Standard card
  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-amber-100 card-hover">
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-gradient-to-br from-brand-blue to-brand-teal flex-shrink-0">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/20 text-6xl font-bold select-none">A</span>
          </div>
        )}
        {category && (
          <div className="absolute top-3 left-3">
            <Link
              href={`/blog/category/${category.slug}`}
              className="inline-block text-xs font-semibold text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full transition-colors"

            >
              {category.name}
            </Link>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(post.published_at)}
          </span>
          {post.read_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {post.read_time} min
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-bold text-brand-blue leading-snug mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="text-[11px] text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 px-2 py-0.5 rounded-full transition-colors"

              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-amber-50 mt-auto">
          {author ? (
            <div className="flex items-center gap-2">
              {author.photo ? (
                <Image
                  src={getAssetUrl(author.photo, { width: '32', height: '32', fit: 'cover' })}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-brand-teal" aria-hidden="true" />
                </div>
              )}
              <span className="text-xs text-gray-500">{author.name}</span>
            </div>
          ) : <span />}
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-semibold text-brand-teal hover:text-brand-blue transition-colors"
            aria-label={`Read ${post.title}`}
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  )
}
