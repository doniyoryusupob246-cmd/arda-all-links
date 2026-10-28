'use client'

import { startTransition, useActionState, useState } from 'react'
import { savePost } from '@/app/admin/actions'
import { inputClass, labelClass, primaryButtonClass } from '@/components/admin/ui'
import type { BlogPost } from '@/lib/content'
import { resizeImage } from '@/lib/resize-image'
import { slugify } from '@/lib/slugify'

export function PostForm({ post }: { post?: BlogPost }) {
  const [state, action, pending] = useActionState(savePost, {})
  const [title, setTitle] = useState(post?.title ?? '')
  const [preparing, setPreparing] = useState(false)

  // Swap the picked cover for a resized copy before the form is submitted
  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget
    const file = input.files?.[0]
    if (!file) return
    setPreparing(true)
    const resized = await resizeImage(file)
    const transfer = new DataTransfer()
    transfer.items.add(resized)
    input.files = transfer.files
    setPreparing(false)
  }

  // Submitting manually (not via `action=`) stops React from clearing the
  // fields when the server returns a validation error.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(() => action(data))
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>Başlık</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className={labelClass}>Adres (slug)</label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder={slugify(title) || 'otomatik'}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="date" className={labelClass}>Tarih</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={post?.date ?? new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>Kısa açıklama</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cover" className={labelClass}>Kapak fotoğrafı</label>
        {post?.cover && (
          <div className="mb-3 flex items-center gap-4">
            <img src={post.cover} alt="" className="h-20 w-32 rounded-xl border border-border object-cover" />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" name="removeCover" className="accent-primary" />
              Kapağı kaldır
            </label>
          </div>
        )}
        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/*"
          onChange={onCoverChange}
          className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:text-foreground"
        />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>Metin</label>
        <textarea
          id="content"
          name="content"
          rows={14}
          defaultValue={post?.content}
          className={`${inputClass} leading-relaxed`}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Paragrafları boş bir satırla ayırın.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
          className="accent-primary"
        />
        Yayında (işaretli değilse taslak olarak kalır)
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <button type="submit" disabled={pending || preparing} className={primaryButtonClass}>
        {pending ? 'Kaydediliyor…' : 'Kaydet'}
      </button>
    </form>
  )
}
