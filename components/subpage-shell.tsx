import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function SubpageShell({
  title,
  subtitle,
  backHref = '/',
  backLabel = 'Ana sayfa',
  children,
}: {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  children: React.ReactNode
}) {
  return (
    <main className="relative min-h-screen bg-zinc-950 flex justify-center">
      <div className="relative w-full max-w-md md:max-w-3xl min-h-screen bg-background border-x border-zinc-800/40 shadow-2xl overflow-x-hidden flex flex-col">
        {/* Warm glow behind the page title */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 [background:radial-gradient(70%_100%_at_50%_0%,oklch(0.82_0.09_78/0.12),transparent_70%)]" />

        <div className="relative z-10 w-full px-5 pt-8 pb-24 sm:px-6 flex-grow">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-foreground backdrop-blur-xl transition-all duration-300 hover:border-primary/60 hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>

          <header className="mt-10 text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </header>

          <div className="mt-10">{children}</div>

          <footer className="pt-16 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Umut Arda Yılmaz. All rights reserved.
          </footer>
        </div>
      </div>
    </main>
  )
}
