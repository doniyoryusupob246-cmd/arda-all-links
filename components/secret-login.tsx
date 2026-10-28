'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoginForm } from '@/components/admin/login-form'

const TAPS = 5
const WINDOW_MS = 2000

// Hidden admin entrance: tapping the children 5 times quickly opens a password
// prompt. The admin URL is never shipped to the browser — the server redirects
// there only after a correct password.
export function SecretLogin({ children }: { children: React.ReactNode }) {
  const taps = useRef<number[]>([])
  const [open, setOpen] = useState(false)

  function onTap() {
    const now = Date.now()
    taps.current = [...taps.current.filter((t) => now - t < WINDOW_MS), now]
    if (taps.current.length >= TAPS) {
      taps.current = []
      setOpen(true)
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <span onClick={onTap} className="select-none [touch-action:manipulation]">
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
              <LoginForm className="mt-0 bg-card/80" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
