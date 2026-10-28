import Link from 'next/link'
import { ArrowUpRight, LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  deleteGalleryImage,
  deletePost,
  logout,
  updateGalleryCaption,
} from '@/app/admin/actions'
import { ConfirmButton } from '@/components/admin/confirm-button'
import { GalleryUploader } from '@/components/admin/gallery-uploader'
import { LoginForm } from '@/components/admin/login-form'
import {
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/admin/ui'
import { adminPath, isAdmin } from '@/lib/admin-auth'
import { formatDate, getGallery, getPosts } from '@/lib/content'

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />

  const base = adminPath()
  const [images, posts] = await Promise.all([
    getGallery(),
    getPosts({ includeDrafts: true }),
  ])

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-foreground">Yönetim paneli</h1>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className={secondaryButtonClass}>
            Siteyi aç
            <ArrowUpRight className="size-4" />
          </Link>
          <form action={logout}>
            <button type="submit" className={secondaryButtonClass}>
              <LogOut className="size-4" />
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <section className="flex flex-col gap-5">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Galeri <span className="text-base text-muted-foreground">· {images.length}</span>
        </h2>
        <GalleryUploader />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card/40 p-2"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
              <form action={updateGalleryCaption.bind(null, image.id)} className="flex gap-1.5">
                <input
                  name="caption"
                  defaultValue={image.caption ?? ''}
                  placeholder="Açıklama"
                  className={`${inputClass} px-3 py-1.5 text-xs`}
                />
                <button type="submit" className={`${secondaryButtonClass} px-2.5 py-1.5 text-xs`}>
                  Kaydet
                </button>
              </form>
              <form action={deleteGalleryImage.bind(null, image.id)}>
                <ConfirmButton
                  message="Bu fotoğraf silinsin mi?"
                  className={`${dangerButtonClass} w-full py-1.5 text-xs`}
                >
                  <Trash2 className="size-3.5" />
                  Sil
                </ConfirmButton>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Blog <span className="text-base text-muted-foreground">· {posts.length}</span>
          </h2>
          <Link href={`${base}/posts/new`} className={primaryButtonClass}>
            <Plus className="size-4" />
            Yeni yazı
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/40 p-3"
            >
              {post.cover ? (
                <img src={post.cover} alt="" className="h-14 w-20 rounded-lg object-cover" />
              ) : (
                <div className="h-14 w-20 rounded-lg bg-secondary/40" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                  {!post.published && (
                    <span className="ml-2 rounded-md bg-secondary px-1.5 py-0.5 text-foreground">
                      Taslak
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`${base}/posts/${post.id}`} className={secondaryButtonClass}>
                  <Pencil className="size-4" />
                  Düzenle
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <ConfirmButton message={`“${post.title}” silinsin mi?`} className={dangerButtonClass}>
                    <Trash2 className="size-4" />
                  </ConfirmButton>
                </form>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground">Henüz yazı yok.</p>
          )}
        </div>
      </section>
    </div>
  )
}
