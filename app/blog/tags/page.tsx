import Link from 'next/link'
import { Building2, Tags } from 'lucide-react'
import { getAllTags } from '@/lib/blog-utils'

export const metadata = {
  title: 'Tags | Blog | Building Health X',
  description: 'Browse Building Health X blog posts by topic.',
}

export default function BlogTagsIndexPage() {
  const tags = getAllTags()

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
              <Tags size={16} />
              Tags
            </span>
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-sm text-[#cbd5e1] hover:bg-white/5 transition"
            >
              Blog
            </Link>
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
        <h1 className="text-3xl md:text-4xl font-black mb-2">Browse by topic</h1>
        <p className="text-[#94a3b8] mb-8 max-w-3xl">Explore renter guides, building issue explainers, and neighborhood walkthroughs.</p>

        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog/tags/${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full border border-[#1e293b] text-sm text-[#cbd5e1] hover:bg-white/5 transition"
            >
              {tag} <span className="text-[#94a3b8]">({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
