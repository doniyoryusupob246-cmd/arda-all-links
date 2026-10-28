import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PostForm } from '@/components/admin/post-form'
import { secondaryButtonClass } from '@/components/admin/ui'
import { adminPath, isAdmin } from '@/lib/admin-auth'
import { getPostById } from '@/lib/content'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const base = adminPath()
  if (!(await isAdmin())) redirect(base)

  const { id } = await params
  const post = id === 'new' ? undefined : await getPostById(Number(id) || 0)
  if (id !== 'new' && !post) notFound()

  return (
    <div className="flex flex-col gap-8">
      <Link href={base} className={`${secondaryButtonClass} self-start`}>
        <ArrowLeft className="size-4" />
        Panele dön
      </Link>
      <h1 className="font-serif text-3xl font-bold text-foreground">
        {post ? 'Yazıyı düzenle' : 'Yeni yazı'}
      </h1>
      <PostForm post={post} />
    </div>
  )
}
