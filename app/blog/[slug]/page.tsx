import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SubpageShell } from '@/components/subpage-shell'
import { formatDate, getPostBySlug, toParagraphs } from '@/lib/content'

type Props = { params: Promise<{ slug: string }> }

// Posts come from the database: render each one on first visit, then cache it
// until the admin panel revalidates it.
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug)
  if (!post) return {}
  return { title: `${post.title} · Umut Arda Yılmaz`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug)
  if (!post) notFound()

  return (
    <SubpageShell
      title={post.title}
      subtitle={formatDate(post.date)}
      backHref="/blog"
      backLabel="Blog"
    >
      <article>
        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="mb-8 aspect-[16/9] w-full rounded-3xl border border-border object-cover"
          />
        )}
        <div className="flex flex-col gap-5 text-pretty text-[15px] leading-relaxed text-foreground/90">
          {toParagraphs(post.content).map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </SubpageShell>
  )
}
