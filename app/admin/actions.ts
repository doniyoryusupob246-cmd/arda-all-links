'use server'

import { del, put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  adminPath,
  checkPassword,
  createSession,
  destroySession,
  isAdmin,
} from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { slugify } from '@/lib/slugify'

export type FormState = { error?: string }

const MAX_UPLOAD = 4 * 1024 * 1024

// Server Actions are public endpoints — every mutation checks the session itself.
async function assertAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorized')
}

async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith('image/')) throw new Error('Sadece resim dosyası yüklenebilir.')
  if (file.size > MAX_UPLOAD) throw new Error('Dosya 4 MB’tan büyük olamaz.')
  const name = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
  const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
  const { url } = await put(`${folder}/${name}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: true,
    contentType: file.type,
  })
  return url
}

// Only Blob-hosted files are deleted; seed images in /public are left alone.
async function removeBlob(url: string | null | undefined) {
  if (url?.includes('.blob.vercel-storage.com/')) await del(url)
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim()
}

function refreshGallery() {
  revalidatePath('/galeri')
  revalidatePath('/admin', 'layout')
}

function refreshBlog(...slugs: string[]) {
  revalidatePath('/blog')
  for (const slug of slugs) revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin', 'layout')
}

// ---------- auth ----------

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  if (!checkPassword(String(formData.get('password') ?? ''))) {
    // Slow down password guessing
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { error: 'Şifre yanlış.' }
  }
  await createSession()
  redirect(adminPath())
}

export async function logout() {
  await destroySession()
  redirect('/')
}

// ---------- gallery ----------

export async function uploadGalleryImage(formData: FormData): Promise<FormState> {
  await assertAdmin()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) return { error: 'Dosya seçilmedi.' }
  const caption = field(formData, 'caption') || null

  let url: string
  try {
    url = await uploadImage(file, 'gallery')
  } catch (e) {
    return { error: (e as Error).message }
  }

  await db()`
    insert into gallery_images (url, alt, caption)
    values (${url}, ${caption ?? 'Umut Arda Yılmaz'}, ${caption})`
  refreshGallery()
  return {}
}

export async function updateGalleryCaption(id: number, formData: FormData) {
  await assertAdmin()
  const caption = field(formData, 'caption') || null
  await db()`
    update gallery_images
    set caption = ${caption}, alt = ${caption ?? 'Umut Arda Yılmaz'}
    where id = ${id}`
  refreshGallery()
}

export async function deleteGalleryImage(id: number) {
  await assertAdmin()
  const [row] = await db()`delete from gallery_images where id = ${id} returning url`
  await removeBlob(row?.url)
  refreshGallery()
}

// ---------- blog ----------

export async function savePost(_: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin()
  const id = Number(formData.get('id')) || null
  const title = field(formData, 'title')
  const slug = slugify(field(formData, 'slug') || title)
  const date = field(formData, 'date') || new Date().toISOString().slice(0, 10)
  const excerpt = field(formData, 'excerpt')
  const content = field(formData, 'content')
  const published = formData.get('published') === 'on'
  const file = formData.get('cover')

  if (!title) return { error: 'Başlık gerekli.' }
  if (!slug) return { error: 'Adres (slug) oluşturulamadı — Latin harfleri kullanın.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'Tarih geçersiz.' }

  const [existing] = id ? await db()`select slug, cover from posts where id = ${id}` : []
  if (id && !existing) return { error: 'Yazı bulunamadı.' }

  let newCover: string | null = null
  if (file instanceof File && file.size > 0) {
    try {
      newCover = await uploadImage(file, 'blog')
    } catch (e) {
      return { error: (e as Error).message }
    }
  }
  const oldCover: string | null = existing?.cover ?? null
  const cover = newCover ?? (formData.get('removeCover') === 'on' ? null : oldCover)

  try {
    if (id) {
      await db()`
        update posts
        set slug = ${slug}, title = ${title}, date = ${date}, excerpt = ${excerpt},
            cover = ${cover}, content = ${content}, published = ${published}, updated_at = now()
        where id = ${id}`
    } else {
      await db()`
        insert into posts (slug, title, date, excerpt, cover, content, published)
        values (${slug}, ${title}, ${date}, ${excerpt}, ${cover}, ${content}, ${published})`
    }
  } catch (e) {
    await removeBlob(newCover)
    if ((e as { code?: string }).code === '23505') {
      return { error: `“${slug}” adresi başka bir yazıda kullanılıyor.` }
    }
    throw e
  }

  if (oldCover !== cover) await removeBlob(oldCover)
  refreshBlog(slug, ...(existing && existing.slug !== slug ? [existing.slug] : []))
  redirect(adminPath())
}

export async function deletePost(id: number) {
  await assertAdmin()
  const [row] = await db()`delete from posts where id = ${id} returning slug, cover`
  if (!row) return
  await removeBlob(row.cover)
  refreshBlog(row.slug)
}
