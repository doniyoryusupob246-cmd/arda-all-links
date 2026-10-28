import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/** Secret admin URL (e.g. /k7x-panel), set only in env so it never lands in the public repo. */
export function adminPath() {
  const path = process.env.ADMIN_PATH ?? ''
  return path.startsWith('/') ? path.replace(/\/+$/, '') : ''
}

function sign(value: string) {
  return createHmac('sha256', process.env.ADMIN_SECRET ?? '')
    .update(value)
    .digest('base64url')
}

// Hash first so the comparison is constant-time regardless of input length
function safeEqual(a: string, b: string) {
  const hash = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(hash(a), hash(b))
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD
  return Boolean(expected) && safeEqual(password, expected!)
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE * 1000)
  ;(await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: adminPath(),
    maxAge: MAX_AGE,
  })
}

export async function destroySession() {
  ;(await cookies()).delete({ name: COOKIE, path: adminPath() })
}

export async function isAdmin() {
  if (!process.env.ADMIN_SECRET || !adminPath()) return false
  const value = (await cookies()).get(COOKIE)?.value
  const [exp, sig] = value?.split('.') ?? []
  return Boolean(exp && sig) && safeEqual(sig, sign(exp)) && Number(exp) > Date.now()
}
