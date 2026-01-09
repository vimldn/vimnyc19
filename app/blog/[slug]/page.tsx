import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, ChevronLeft, Newspaper } from 'lucide-react'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog-utils'
import BlogSidebar from '@/components/BlogSidebar'

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.metaTitle || `${post.title} | Building Health X`,
    description: post.metaDescription || post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return notFound()

  const related = getRelatedPosts(post.slug, 6)

  return (
    <main className="min-h-screen bg-[#0a0e17]">
      <header className="sticky top-0 z-50 bg-[#0a0e17]/95 backdrop-blur-xl border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold hidden sm:block">Building Health X</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e293b] text-sm text-[#cbd5e1] hover:bg-white/5 transition"
            >
              <ChevronLeft size={16} />
              All posts
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 text-sm text-[#94a3b8]">
              <Newspaper size={16} />
              Blog
            </span>
          </div>
        </div>
      </header>

      <article className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-3">{post.title}</h1>
            <div className="text-sm text-[#94a3b8] mb-6">
              {post.dateISO
                ? new Date(post.dateISO).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : ''}
            </div>

            {post.tags && post.tags.length ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="px-3 py-1 rounded-full border border-[#1e293b] text-xs text-[#cbd5e1] hover:bg-white/5 transition"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            ) : null}

            {post.featuredImage ? (
              <div className="card overflow-hidden mb-7">
                <div className="aspect-[16/9] w-full bg-[#111827]">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            ) : null}

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />

            {related.length ? (
              <div className="mt-10">
                <h2 className="text-2xl font-black mb-4">Related posts</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-5 hover:bg-white/5 transition">
                      <div className="font-bold mb-2">{p.title}</div>
                      <div className="text-sm text-[#94a3b8] line-clamp-3">{p.excerpt}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <BlogSidebar currentSlug={post.slug} />
        </div>
      </article>
    </main>
  )
}
