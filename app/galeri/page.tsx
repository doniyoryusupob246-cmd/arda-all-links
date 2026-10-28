import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/gallery-grid'
import { SubpageShell } from '@/components/subpage-shell'
import { getGallery } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Galeri · Umut Arda Yılmaz',
}

export default async function GalleryPage() {
  const gallery = await getGallery()

  return (
    <SubpageShell title="Galeri" subtitle={`${gallery.length} fotoğraf`}>
      {gallery.length > 0 ? (
        <GalleryGrid images={gallery} />
      ) : (
        <p className="text-center text-sm text-muted-foreground">Henüz fotoğraf yok.</p>
      )}
    </SubpageShell>
  )
}
