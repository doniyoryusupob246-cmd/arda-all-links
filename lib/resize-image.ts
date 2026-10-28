// Browser-only: shrink photos before upload so they stay under the 4 MB
// Server Action limit and load fast on phones (images are served unoptimized).
export async function resizeImage(file: File, maxSize = 2000, quality = 0.85) {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    )
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
    })
  } catch {
    // Formats the browser can't decode (e.g. HEIC in Chrome) go up as-is
    return file
  }
}
