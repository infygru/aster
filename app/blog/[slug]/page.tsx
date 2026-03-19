import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, Tag, ChevronRight, Twitter, Linkedin, Share2 } from 'lucide-react'
import {
  getBlogPost, getAllBlogSlugs, getRelatedPosts, getBlogCategories, getBlogTags, getBlogPosts,
  formatDate, getAuthor, getCategory, getTags, getAssetUrl,
} from '@/lib/blog'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Post Not Found' }

  const author = getAuthor(post)
  const category = getCategory(post)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asterhomecare.co.uk'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const ogImg = post.og_image ?? post.featured_image
  const ogImgUrl = ogImg ? getAssetUrl(ogImg, { width: '1200', height: '630', fit: 'cover' }) : undefined

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    robots: post.no_index ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical: post.canonical_url || postUrl },
    openGraph: {
      type: 'article',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      url: postUrl,
      publishedTime: post.published_at || undefined,
      authors: author ? [author.name] : undefined,
      section: category?.name,
      images: ogImgUrl ? [{ url: ogImgUrl, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      images: ogImgUrl ? [ogImgUrl] : undefined,
    },
  }
}

function JsonLd({ post }: { post: NonNullable<Awaited<ReturnType<typeof getBlogPost>>> }) {
  const author = getAuthor(post)
  const category = getCategory(post)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asterhomecare.co.uk'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const ogImg = post.og_image ?? post.featured_image
  const imgUrl = ogImg ? getAssetUrl(ogImg, { width: '1200', height: '630', fit: 'cover' }) : null

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // Article
      {
        '@type': post.schema_type || 'BlogPosting',
        '@id': postUrl,
        headline: post.title,
        description: post.excerpt || undefined,
        datePublished: post.published_at || undefined,
        dateModified: post.published_at || undefined,
        url: postUrl,
        image: imgUrl ? { '@type': 'ImageObject', url: imgUrl, width: 1200, height: 630 } : undefined,
        author: author
          ? { '@type': 'Person', name: author.name, url: `${siteUrl}/blog/author/${author.slug}` }
          : { '@type': 'Organization', name: 'Aster Homecare UK' },
        publisher: {
          '@type': 'Organization',
          name: 'Aster Homecare UK',
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.svg` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
        articleSection: category?.name,
        timeRequired: post.read_time ? `PT${post.read_time}M` : undefined,
        inLanguage: 'en-GB',
      },
      // BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
          ...(category
            ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${siteUrl}/blog/category/${category.slug}` }]
            : []),
          { '@type': 'ListItem', position: category ? 4 : 3, name: post.title, item: postUrl },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params
  const [post, categories, tags, recentPosts] = await Promise.all([
    getBlogPost(slug),
    getBlogCategories(),
    getBlogTags(),
    getBlogPosts({ limit: 4 }),
  ])

  if (!post) notFound()

  const author = getAuthor(post)
  const category = getCategory(post)
  const postTags = getTags(post)
  const related = await getRelatedPosts(post, 3)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asterhomecare.co.uk'
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const imgUrl = post.featured_image
    ? getAssetUrl(post.featured_image, { width: '1200', height: '630', fit: 'cover', quality: '85' })
    : null

  return (
    <>
      <JsonLd post={post} />

      {/* Hero / Featured image */}
      <div className="relative h-72 md:h-96 hero-gradient overflow-hidden">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={post.featured_image_alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 container-custom">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-white/70" role="list">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              {category && (
                <>
                  <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
                  <li>
                    <Link href={`/blog/category/${category.slug}`} className="hover:text-white transition-colors">
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li className="text-white truncate max-w-[200px]" aria-current="page">{post.title}</li>
            </ol>
          </nav>
        </div>

        {/* Post meta overlay */}
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {category && (
              <Link
                href={`/blog/category/${category.slug}`}
                className="inline-block text-xs font-semibold text-white bg-brand-teal px-3 py-1 rounded-full hover:bg-brand-teal-light transition-colors"
              >
                {category.name}
              </Link>
            )}
            {post.schema_type && post.schema_type !== 'BlogPosting' && (
              <span className="text-xs text-white/60 border border-white/30 px-2 py-0.5 rounded-full">
                {post.schema_type}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug max-w-3xl text-balance">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content area */}
      <div className="bg-brand-white">
        <div className="container-custom py-10">
          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-14">
            {/* Article */}
            <article>
              {/* Author / meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-amber-100">
                <div className="flex items-center gap-3">
                  {author?.photo ? (
                    <Image
                      src={getAssetUrl(author.photo, { width: '48', height: '48', fit: 'cover' })}
                      alt={author.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover border-2 border-brand-teal/30"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-brand-teal" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-brand-blue">
                      {author?.name ?? 'Aster Homecare Team'}
                    </p>
                    {author?.job_title && (
                      <p className="text-xs text-gray-500">{author.job_title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    <time dateTime={post.published_at ?? ''}>
                      {formatDate(post.published_at)}
                    </time>
                  </span>
                  {post.read_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {post.read_time} min read
                    </span>
                  )}
                </div>
              </div>

              {/* Excerpt lead */}
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-brand-teal pl-5">
                  {post.excerpt}
                </p>
              )}

              {/* Body */}
              {post.content && (
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-brand-blue prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-brand-teal prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-brand-blue
                    prose-ul:text-gray-700 prose-ol:text-gray-700
                    prose-li:my-1
                    prose-blockquote:border-brand-teal prose-blockquote:text-gray-600
                    prose-img:rounded-xl prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {/* Tags */}
              {postTags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-amber-100">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-3">
                    <Tag className="w-4 h-4" aria-hidden="true" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className="inline-block text-sm text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20 px-3 py-1.5 rounded-full transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-amber-100">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-3">
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                  Share this article
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] px-4 py-2 rounded-lg transition-colors"
                    aria-label="Share on X (Twitter)"
                  >
                    <Twitter className="w-4 h-4" aria-hidden="true" />
                    X / Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 hover:bg-[#0077B5]/10 hover:text-[#0077B5] px-4 py-2 rounded-lg transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" aria-hidden="true" />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Author bio */}
              {author && author.bio && (
                <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-4">
                    {author.photo ? (
                      <Image
                        src={getAssetUrl(author.photo, { width: '80', height: '80', fit: 'cover' })}
                        alt={author.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover flex-shrink-0 border-2 border-brand-teal/30"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-7 h-7 text-brand-teal" aria-hidden="true" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-brand-blue">{author.name}</p>
                      {author.job_title && (
                        <p className="text-sm text-brand-teal mb-2">{author.job_title}</p>
                      )}
                      <p className="text-sm text-gray-600 leading-relaxed">{author.bio}</p>
                      <div className="flex gap-3 mt-3">
                        {author.linkedin_url && (
                          <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077B5] transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {author.twitter_url && (
                          <a href={author.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors" aria-label="Twitter">
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <BlogSidebar
              categories={categories}
              tags={tags}
              recentPosts={recentPosts.filter((p) => p.id !== post.id).slice(0, 4)}
              activeCategorySlug={category?.slug}
            />
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-amber-100">
              <h2 className="text-2xl font-bold text-brand-blue mb-8">Related Articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
