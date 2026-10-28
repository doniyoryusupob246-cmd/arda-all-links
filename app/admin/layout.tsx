import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yönetim',
  robots: { index: false, follow: false },
}

// Always render per request: every page here depends on the session cookie
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </main>
  )
}
