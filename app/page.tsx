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
    <main className="relative min-h-screen">
      <ScrollBackground images={backgrounds} activeIndex={activeIndex} />

      <div className="relative z-10 mx-auto w-full max-w-xl px-5 pb-24 sm:px-6">
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
    </main>
  )
}
