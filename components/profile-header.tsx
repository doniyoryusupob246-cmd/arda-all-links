'use client'

import { motion } from 'framer-motion'
import { profile, socials } from '@/lib/profile-data'
import { ChevronDown } from 'lucide-react'

export function ProfileHeader({ onInView }: { onInView: () => void }) {
  return (
    <motion.header
      onViewportEnter={onInView}
      viewport={{ amount: 0.5 }}
      initial={{ opacity: 0, y: 64 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex min-h-[88vh] flex-col items-center justify-center text-center pt-28"
    >
      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
        {profile.name}
      </h1>

      <p className="mt-3 text-pretty text-[25px] leading-relaxed text-white">
        𐱅𐰇𐰼𐰜
      </p>

      <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-white sm:text-base">
        {profile.bio}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        {socials.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-card/40 text-foreground backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-card/70 hover:text-primary"
          >
            <Icon className="size-5" />
          </a>
        ))}
      </div>

      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        className="mt-14 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <ChevronDown />
      </motion.div>
    </motion.header>
  )
}
