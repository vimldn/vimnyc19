import Link from 'next/link'
import type { Metadata } from 'next'
import { Building2, MapPin } from 'lucide-react'
import { getAllServiceLocationCombos, getLocationBySlug, getServiceBySlug } from '@/lib/services-data'
import { getServiceLandingCopy } from '@/lib/services-copy'
import { getAllPosts } from '@/lib/blog-utils'
import LeadForm from '@/components/LeadForm'

export async function generateStaticParams() {
  return getAllServiceLocationCombos().map(({ service, location }) => ({
    service: service.slug,
    location: location.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { service: string; location: string }
}): Promise<Metadata> {
  const service = getServiceBySlug(params.service)
  const location = getLocationBySlug(params.location)

  if (!service || !location) {
    return {
      title: 'Services | Building Health X',
      description: 'Find trusted NYC renter services by neighborhood.',
    }
  }

  const title = `${service.name} in ${location.name} | Building Health X`
  const description =
    `Get practical, neighborhood-specific guidance for ${service.name.toLowerCase()} in ${location.name}. ` +
    `Use Building Health X to check a building before you sign.`

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}/${location.slug}`,
    },
  }
}

export default function ServiceLandingPage({
  params,
}: {
  params: { service: string; location: string }
}) {
  const service = getServiceBySlug(params.service)
  const location = getLocationBySlug(params.location)

  if (!service || !location) {
    return (
      <main className="min-h-screen bg-[#0a0e17]">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-[#94a3b8] mb-6">That service or neighborhood doesn’t exist.</p>
          <Link href="/" className="text-blue-400 hover:underline">
            Go back to search
          </Link>
        </div>
      </main>
    )
  }

  const copy = getServiceLandingCopy(service, location)

  const posts = getAllPosts()
  const locationNeedle = location.name.toLowerCase()
  const locationMatches = posts.filter((p) => p.title.toLowerCase().includes(locationNeedle))

  const serviceKeywords: Record<string, string[]> = {
    'moving-companies': ['moving', 'tour', 'walkthrough', 'checklist', 'apartment tour'],
    'tenant-lawyers': ['tenant', 'rights', 'rent', 'lease', 'stabil', 'security deposit'],
    'renters-insurance': ['insurance', 'coverage', 'liability', 'theft'],
    'pest-control': ['pest', 'bed bug', 'roaches', 'mice', 'rats'],
    'storage-facilities': ['storage', 'move', 'moving'],
    'building-inspectors': ['inspection', 'checklist', 'tour', 'renovation', 'safety'],
  }

  const keywords = serviceKeywords[service.slug] || []
  const serviceMatches = posts.filter((p) =>
    keywords.some((k) => p.title.toLowerCase().includes(k))
  )

  const uniquePosts = [...locationMatches, ...serviceMatches]
    .filter((p, idx, arr) => arr.findIndex((x) => x.slug === p.slug) === idx)
    .slice(0, 3)

  const livingGuide = locationMatches.find((p) => /\brentals\b|\bliving\b/i.test(p.title))

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://vimnyc15.vercel.app'

  const canonicalPath = `/services/${service.slug}/${location.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${service.name} in ${location.name} | Building Health X`,
    url: `${baseUrl}${canonicalPath}`,
    about: {
      '@type': 'Service',
      name: `${service.name} in ${location.name}`,
      serviceType: service.name,
      provider: {
        '@type': 'Organization',
        name: 'Building Health X',
        url: baseUrl,
      },
      areaServed: {
        '@type': 'City',
        name: `New York City - ${location.name}`,
      },
    },
  }

  return (
    <main className="min-h-screen bg-[#0a0e17]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <MapPin size={16} />
              Services
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

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="card p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            {copy.hero.title}
            <span className="text-[#94a3b8]"> | Building Health X</span>
          </h1>
          <p className="text-[#cbd5e1] max-w-3xl leading-relaxed">
            {copy.hero.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="pill">{location.borough}</span>
            <span className="pill">{location.name}</span>
            <span className="pill">{service.name}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-6" id="location-intro">
              <h2 className="text-xl font-bold mb-2">About {location.name}</h2>
              <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{copy.locationContext}</p>
            </section>

            <section className="card p-6" id="why-needed">
              <h2 className="text-xl font-bold mb-2">Why {location.name} residents look for {service.name}</h2>
              <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{copy.whyResidentsNeed}</p>
            </section>

            <section className="card p-6" id="what-to-look-for">
              <h2 className="text-xl font-bold mb-2">What to look for in a {service.singular}</h2>
              <div className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{copy.whatToLookFor}</div>
            </section>

            <section className="card p-6" id="local-tips">
              <h2 className="text-xl font-bold mb-2">Local considerations & tips</h2>
              <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{copy.localTips}</p>
            </section>

            <section className="card p-6" id="data-insights">
              <h2 className="text-xl font-bold mb-2">Data-driven insights</h2>
              <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{copy.dataDriven}</p>
              <div className="mt-4">
                <Link href="/" className="text-blue-400 hover:underline">
                  Check an address on Building Health X
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-2">Get help in {location.name}</h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
                Tell us what you need and we’ll route it to a trusted {service.singular} option for {location.name}. This is free, and you’re not
                committing to anything.
              </p>
              <LeadForm
                serviceName={service.name}
                serviceSlug={service.slug}
                locationName={location.name}
                locationSlug={location.slug}
              />
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold mb-2">Check a building first</h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
                Before you hire anyone, make sure the building itself isn’t the problem. Run a quick Building Health X check for heat, pests,
                noise, safety, and violations.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
              >
                Search an address
              </Link>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold mb-2">Related resources</h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
                Quick reads that pair well with a building check in {location.name}.
              </p>

              <div className="flex flex-col gap-2">
                {livingGuide ? (
                  <Link href={`/blog/${livingGuide.slug}`} className="text-blue-400 hover:underline">
                    Living in {location.name}: renter checklist
                  </Link>
                ) : null}

                {uniquePosts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="text-blue-400 hover:underline">
                    {p.title}
                  </Link>
                ))}

                <Link href="/blog" className="text-blue-400 hover:underline">
                  Browse all articles
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
