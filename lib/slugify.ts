const TR_CHARS: Record<string, string> = { ı: 'i', İ: 'i', ğ: 'g', ü: 'u', ş: 's', ö: 'o', ç: 'c' }

export function slugify(text: string) {
  return text
    .replace(/[ıİğüşöç]/gi, (ch) => TR_CHARS[ch] ?? TR_CHARS[ch.toLowerCase()] ?? ch)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
