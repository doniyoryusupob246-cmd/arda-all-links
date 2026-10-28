import { NextResponse, type NextRequest } from 'next/server'

// The admin panel lives at a secret URL taken from ADMIN_PATH (never committed).
// Direct hits on /admin get the regular 404 page, so the panel stays hidden.
export function proxy(request: NextRequest) {
  const secret = process.env.ADMIN_PATH?.replace(/\/+$/, '')
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  if (secret?.startsWith('/') && secret !== '/admin' && (pathname === secret || pathname.startsWith(`${secret}/`))) {
    url.pathname = `/admin${pathname.slice(secret.length)}`
    return NextResponse.rewrite(url)
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Private (underscore) folders are never routable, so this renders the standard 404
    url.pathname = '/_not-found-admin'
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)'],
}
