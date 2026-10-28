import { db } from '@/lib/db'

export type GalleryImage = {
  id: number
  src: string
  alt: string
  caption: string | null
}

export type BlogPost = {
  id: number
  slug: string
  title: string
  /** ISO date, e.g. 2026-10-28 */
  date: string
  excerpt: string
  cover: string | null
  /** Paragraphs separated by a blank line */
  content: string
  published: boolean
}

export async function getGallery() {
  const rows = await db()`
    select id, url as src, alt, caption
    from gallery_images
    order by created_at desc, id desc`
  return rows as GalleryImage[]
}

export async function getPosts({ includeDrafts = false } = {}) {
  const rows = await db()`
    select id, slug, title, to_char(date, 'YYYY-MM-DD') as date, excerpt, cover, content, published
    from posts
    where published or ${includeDrafts}
    order by date desc, id desc`
  return rows as BlogPost[]
}

export async function getPostBySlug(slug: string) {
  const [post] = await db()`
    select id, slug, title, to_char(date, 'YYYY-MM-DD') as date, excerpt, cover, content, published
    from posts
    where slug = ${slug} and published`
  return post as BlogPost | undefined
}

export async function getPostById(id: number) {
  const [post] = await db()`
    select id, slug, title, to_char(date, 'YYYY-MM-DD') as date, excerpt, cover, content, published
    from posts
    where id = ${id}`
  return post as BlogPost | undefined
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function toParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
