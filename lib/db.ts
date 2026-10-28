import { neon } from '@neondatabase/serverless'

// Neon (Postgres) over HTTP — DATABASE_URL comes from the Vercel ↔ Neon integration.
export function db() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}
