import type { MetadataRoute } from 'next'

import { getAllPosts } from '@/lib/blog'
import { getAllServiceLocationCombos } from '@/lib/services-data'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  // Fallback for preview / first deploy. Set NEXT_PUBLIC_SITE_URL in production.
  'https://vimnyc15.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const base: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const serviceEntries: MetadataRoute.Sitemap = getAllServiceLocationCombos().map(({ service, location }) => ({
    url: `${siteUrl}/services/${service.slug}/${location.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [...base, ...serviceEntries, ...blogEntries]
}
