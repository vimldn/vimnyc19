import Link from 'next/link'
import { Building2, Newspaper } from 'lucide-react'
import { getAllPosts } from '@/lib/blog-utils'

export const metadata = {
  title: 'Blog | Building Health X',
  description: 'Practical NYC renting checklists and building walkthrough tips.',
}

export default function BlogIndexPage({ searchParams }: { searchParams?: { page?: string; tag?: string } }) {
  const allPosts = getAllPosts()
  const activeTag = searchParams?.tag
  const posts = activeTag ? allPosts.filter((p) => (p.tags || []).includes(activeTag)) : allPosts

  const pageSize = 10
  const pageNum = Math.max(1, Number.parseInt(searchParams?.page || '1', 10) || 1)
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
  const page = Math.min(pageNum, totalPages)
  const start = (page - 1) * pageSize
  const shown = posts.slice(start, start + pageSize)

  return (
    <main className="min-h-screen bg-[#0a0e17]">
      <header className="sticky top-0 z-50 bg-[#0a0e17]/95 backdrop-blur-xl border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold hidden sm:block">Building Health X</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-[#94a3b8]">
              <Newspaper size={16} />
              Blog
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-sm text-[#cbd5e1] hover:bg-white/5 transition"
            >
              Search
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">NYC renter guides</h1>
        <p className="text-[#94a3b8] mb-8 max-w-3xl">
          Checklists and walkthrough tips you can use on a tour — with photos and tables included.
        </p>

        {posts.length && allPosts.length ? (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href="/blog"
              className="px-3 py-1 rounded-full border border-[#1e293b] text-xs text-[#cbd5e1] hover:bg-white/5 transition"
            >
              All
            </Link>
            {Array.from(new Set(allPosts.flatMap((p) => p.tags || []))).sort().map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={`px-3 py-1 rounded-full border border-[#1e293b] text-xs transition ${activeTag === t ? 'bg-white/5 text-white' : 'text-[#cbd5e1] hover:bg-white/5'}`}
              >
                {t}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card overflow-hidden hover:translate-y-[-1px] transition"
            >
              {p.featuredImage ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#111827]">
                  <img
                    src={p.featuredImage}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10" />
              )}
              <div className="p-5">
                <h2 className="font-bold leading-snug mb-2">{p.title}</h2>
                <div className="text-xs text-[#94a3b8] mb-2">
                  {p.dateISO ? new Date(p.dateISO).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                </div>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Link
              href={`/blog?page=${Math.max(1, page - 1)}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
              className={`px-3 py-1.5 rounded-lg border border-[#1e293b] text-sm transition ${page <= 1 ? 'opacity-40 pointer-events-none' : 'text-[#cbd5e1] hover:bg-white/5'}`}
            >
              Prev
            </Link>
            <div className="text-sm text-[#94a3b8]">
              Page {page} of {totalPages}
            </div>
            <Link
              href={`/blog?page=${Math.min(totalPages, page + 1)}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
              className={`px-3 py-1.5 rounded-lg border border-[#1e293b] text-sm transition ${page >= totalPages ? 'opacity-40 pointer-events-none' : 'text-[#cbd5e1] hover:bg-white/5'}`}
            >
              Next
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  )
}
