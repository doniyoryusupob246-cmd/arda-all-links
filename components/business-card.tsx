'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { InstagramIcon } from '@/components/brand-icons'
import type { Business } from '@/lib/profile-data'

export function BusinessCard({
  business,
  onInView,
}: {
  business: Business
  onInView: () => void
}) {
  return (
    <motion.section
      onViewportEnter={onInView}
      viewport={{ amount: 0.6 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex scroll-mt-24 flex-col justify-center py-6"
    >
      <div className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:bg-card/55 sm:p-8">
        {/* glow accent */}
        <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(120px_circle_at_top,oklch(0.82_0.09_78/0.12),transparent_70%)]" />

        <div className="relative">
          <h2 className="font-serif text-center text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
            {business.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {business.tagline}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_oklch(0.82_0.09_78/0.35)]"
              >
                Website
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            )}
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-5 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-secondary/70"
            >
              <InstagramIcon className="size-4" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
