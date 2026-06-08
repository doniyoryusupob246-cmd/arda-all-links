'use client'

import { useState } from 'react'
import { BusinessCard } from '@/components/business-card'
import { ProfileHeader } from '@/components/profile-header'
import { ScrollBackground } from '@/components/scroll-background'
import { backgrounds, businesses } from '@/lib/profile-data'

export default function Page() {
  // index 0 = hero, 1..n = each business background
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <main className="relative min-h-screen bg-zinc-950 flex justify-center">
      <div className="relative w-full max-w-md min-h-screen bg-background border-x border-zinc-800/40 shadow-2xl overflow-x-hidden flex flex-col">
        <ScrollBackground images={backgrounds} activeIndex={activeIndex} />

        <div className="relative z-10 w-full px-5 pt-60 pb-24 sm:px-6 flex-grow">
          <ProfileHeader onInView={() => setActiveIndex(0)} />

          <div className="flex flex-col">
            {businesses.map((business, i) => (
              <BusinessCard
                key={business.id}
                business={business}
                onInView={() => setActiveIndex(i + 1)}
              />
            ))}
          </div>

          <footer className="pt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Umut Arda Yılmaz. All rights reserved.
          </footer>
        </div>
      </div>
    </main>
  )
}
