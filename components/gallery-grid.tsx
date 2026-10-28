'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryImage } from '@/lib/content'

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : images[openIndex]

  const step = useCallback(
    (dir: number) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + images.length) % images.length,
      ),
    [images.length],
  )

  // Keyboard navigation + page scroll lock while the lightbox is open
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, step])

  return (
    <>
      <div className="columns-2 gap-3">
        {images.map((image, i) => (
          <motion.button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors duration-300 hover:border-primary/60"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full transition-transform duration-500 group-hover:scale-105"
            />
            {image.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-left text-xs text-white">
                {image.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={open.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full border border-border bg-card/40 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <X className="size-5" />
            </button>

            <motion.img
              key={open.src}
              src={open.src}
              alt={open.alt}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain"
            />

            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-4 flex items-center gap-4 text-sm text-white"
            >
              {images.length > 1 && (
                <button
                  type="button"
                  aria-label="Önceki"
                  onClick={() => step(-1)}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-card/40 transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              <span className="min-w-16 text-center text-muted-foreground">
                {openIndex! + 1} / {images.length}
              </span>
              {images.length > 1 && (
                <button
                  type="button"
                  aria-label="Sonraki"
                  onClick={() => step(1)}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-card/40 transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
            </div>

            {open.caption && (
              <p className="mt-3 text-center text-sm text-white">{open.caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
