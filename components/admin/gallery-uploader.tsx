'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { uploadGalleryImage } from '@/app/admin/actions'
import { inputClass, primaryButtonClass } from '@/components/admin/ui'
import { resizeImage } from '@/lib/resize-image'

export function GalleryUploader() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [caption, setCaption] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  async function upload() {
    const files = Array.from(fileRef.current?.files ?? [])
    if (!files.length) return
    setBusy(true)
    setErrors([])

    // One request per photo keeps each upload under the body size limit
    const failed: string[] = []
    for (const [i, file] of files.entries()) {
      setStatus(`Yükleniyor ${i + 1} / ${files.length}…`)
      const data = new FormData()
      data.set('file', await resizeImage(file))
      data.set('caption', caption)
      try {
        const result = await uploadGalleryImage(data)
        if (result.error) failed.push(`${file.name}: ${result.error}`)
      } catch {
        failed.push(`${file.name}: yüklenemedi`)
      }
    }

    setErrors(failed)
    setStatus(failed.length ? null : `${files.length} fotoğraf eklendi.`)
    setCaption('')
    if (fileRef.current) fileRef.current.value = ''
    setBusy(false)
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border p-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        className="text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:text-foreground"
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Açıklama (isteğe bağlı)"
        disabled={busy}
        className={inputClass}
      />
      <button type="button" onClick={upload} disabled={busy} className={primaryButtonClass}>
        <ImagePlus className="size-4" />
        {busy ? 'Yükleniyor…' : 'Fotoğraf ekle'}
      </button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
      {errors.map((error) => (
        <p key={error} className="text-sm text-destructive">
          {error}
        </p>
      ))}
    </div>
  )
}
