'use client'

import { useActionState } from 'react'
import { Lock } from 'lucide-react'
import { login } from '@/app/admin/actions'
import { inputClass, primaryButtonClass } from '@/components/admin/ui'
import { cn } from '@/lib/utils'

export function LoginForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(login, {})

  return (
    <form
      action={action}
      className={cn(
        'mx-auto mt-24 flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-border bg-card/40 p-8 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border text-primary">
        <Lock className="size-5" />
      </div>
      <h1 className="text-center font-serif text-2xl font-semibold text-foreground">Yönetim</h1>
      <input
        type="password"
        name="password"
        placeholder="Şifre"
        autoComplete="current-password"
        autoFocus
        required
        className={inputClass}
      />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? 'Kontrol ediliyor…' : 'Giriş'}
      </button>
    </form>
  )
}
