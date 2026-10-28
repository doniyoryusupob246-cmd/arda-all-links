'use client'

import { useFormStatus } from 'react-dom'

// Submit button that asks for confirmation before the form's action runs.
export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string
  className?: string
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}
