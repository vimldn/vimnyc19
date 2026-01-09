import fs from 'fs'
import path from 'path'

export type BlogPostMeta = {
  slug: string
  title: string
  excerpt: string
  featuredImage?: string
  tags: string[]
  dateISO?: string
  metaTitle?: string
  metaDescription?: string
  schema?: unknown
}

export type BlogPost = BlogPostMeta & {
  html: string
}

type IndexedPost = BlogPostMeta & { filePath: string }

const BLOG_ROOT = path.join(process.cwd(), 'content', 'blog')

const stripHtml = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractExcerpt = (html: string): string => {
  const pm = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const base = pm?.[1] ? stripHtml(pm[1]) : stripHtml(html)
  return base.length > 220 ? `${base.slice(0, 220).trim()}…` : base
}

type Frontmatter = Record<string, unknown>

const parseFrontmatter = (raw: string): { fm: Frontmatter; body: string } => {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---')) return { fm: {}, body: raw }

  const end = trimmed.indexOf('\n---', 3)
  if (end === -1) return { fm: {}, body: raw }

  const fmBlock = trimmed.slice(3, end).trim()
  const body = trimmed.slice(end + '\n---'.length).trimStart()

  const fm: Frontmatter = {}
  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    const val = m[2].trim()

    // very small YAML subset: quoted strings, bare strings, JSON-like objects, and ["a","b"] lists
    if (val.startsWith('[') && val.endsWith(']')) {
      try {
        fm[key] = JSON.parse(val)
      } catch {
        fm[key] = val
      }
    } else if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
      try {
        fm[key] = JSON.parse(val)
      } catch {
        fm[key] = val
      }
    } else if (val.startsWith('"') && val.endsWith('"')) {
      fm[key] = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    } else {
      fm[key] = val
    }
  }

  return { fm, body }
}

const listPostFolders = (): string[] => {
  if (!fs.existsSync(BLOG_ROOT)) return []
  return fs
    .readdirSync(BLOG_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

let cachedIndex: IndexedPost[] | null = null
let cachedBySlug: Map<string, IndexedPost> | null = null

const buildIndex = (): IndexedPost[] => {
  if (cachedIndex) return cachedIndex

  const out: IndexedPost[] = []
  for (const folder of listPostFolders()) {
    const filePathMdx = path.join(BLOG_ROOT, folder, 'index.mdx')
    const filePathMd = path.join(BLOG_ROOT, folder, 'index.md')
    const filePath = fs.existsSync(filePathMdx) ? filePathMdx : fs.existsSync(filePathMd) ? filePathMd : null
    if (!filePath) continue

    const raw = fs.readFileSync(filePath, 'utf8')
    const { fm, body } = parseFrontmatter(raw)

    const title = (fm.title as string) || folder
    const slug = (fm.slug as string) || folder
    const featuredImage = (fm.featuredImage as string) || undefined
    const metaTitle = (fm.metaTitle as string) || undefined
    const metaDescription = (fm.metaDescription as string) || undefined
    const schema = fm.schema
    const tags = Array.isArray(fm.tags) ? (fm.tags as string[]).filter(Boolean) : []

    const stat = fs.statSync(filePath)
    const dateISO = (fm.date as string) || stat.mtime.toISOString()

    const excerpt = (fm.excerpt as string) || extractExcerpt(body)

    out.push({
      slug,
      title,
      excerpt,
      featuredImage,
      tags,
      dateISO,
      metaTitle,
      metaDescription,
      schema,
      filePath,
    })
  }

  // reverse chronological using dateISO, fallback to title
  out.sort((a, b) => {
    const ad = Date.parse(a.dateISO || '')
    const bd = Date.parse(b.dateISO || '')
    if (!Number.isNaN(ad) && !Number.isNaN(bd) && ad !== bd) return bd - ad
    return a.title.localeCompare(b.title)
  })

  cachedIndex = out
  cachedBySlug = new Map(out.map((p) => [p.slug, p]))
  return out
}

export const getAllPosts = (): BlogPostMeta[] => buildIndex().map(({ filePath: _fp, ...m }) => m)

export const getPostBySlug = (slug: string): BlogPost | null => {
  const index = buildIndex()
  if (!cachedBySlug) cachedBySlug = new Map(index.map((p) => [p.slug, p]))
  const meta = cachedBySlug.get(slug)
  if (!meta) return null
  const raw = fs.readFileSync(meta.filePath, 'utf8')
  const { body } = parseFrontmatter(raw)
  // Posts are stored as HTML blocks inside MDX/MD. We render them as HTML.
  return { ...meta, html: body }
}

export const getRecentPosts = (count = 5): BlogPostMeta[] => getAllPosts().slice(0, count)

export const getRelatedPosts = (slug: string, count = 6): BlogPostMeta[] => {
  const all = getAllPosts()
  const cur = all.find((p) => p.slug === slug)
  if (!cur) return all.filter((p) => p.slug !== slug).slice(0, count)

  const curTags = new Set((cur.tags || []).map((t) => t.toLowerCase()))
  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const s = (p.tags || []).reduce((acc, t) => acc + (curTags.has(t.toLowerCase()) ? 1 : 0), 0)
      return { p, s }
    })
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => p)

  const top = scored.filter((p) => (p.tags || []).some((t) => curTags.has(t.toLowerCase()))).slice(0, count)
  if (top.length >= Math.min(count, 3)) return top
  return [...top, ...scored.filter((p) => !top.find((x) => x.slug === p.slug)).slice(0, count - top.length)]
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const counts = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags || []) {
      counts.set(t, (counts.get(t) || 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => (p.tags || []).includes(tag))
}
