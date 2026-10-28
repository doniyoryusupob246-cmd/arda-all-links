import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SubpageShell } from '@/components/subpage-shell'
import { formatDate, getPosts } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blog · Umut Arda Yılmaz',
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <SubpageShell title="Blog" subtitle="Yazılar ve notlar">
      <div className="flex flex-col gap-5">
        {posts.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">Henüz yazı yok.</p>
        )}
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:bg-card/55"
          >
            {post.cover && (
              <img
                src={post.cover}
                alt=""
                loading="lazy"
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )}
            <div className="p-5">
              <time
                dateTime={post.date}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                {formatDate(post.date)}
              </time>
              <h2 className="mt-2 flex items-start justify-between gap-3 font-serif text-xl font-semibold tracking-tight text-foreground text-balance">
                {post.title}
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </SubpageShell>
  )
}
