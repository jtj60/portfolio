'use client'

import Shell from '@/components/custom/nav/shell'
import { cn } from '@/lib/utils'
import React from 'react'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-card via-background to-card">
      {/* Frosted frame */}
      <div
        className={cn(
          'absolute inset-0 z-10 pointer-events-none p-8' // p-8 makes space for blur on all sides
        )}
      >
        <div
          className={cn(
            'h-full rounded-xl border border-white/10',
            'bg-white/5 backdrop-blur-xl backdrop-saturate-150',
            '[background-size:20px_20px]',
            '[background-image:radial-gradient(rgb(255_255_255/.08)_1px,transparent_1px)]'
          )}
        />
      </div>

      <div
        className={cn(
          'fixed inset-0 z-10 pointer-events-none',
          'backdrop-blur-xl backdrop-saturate-150',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(rgb(255_255_255/.08)_1px,transparent_1px)]'
        )}
      />

      <div className="relative z-20 h-full overflow-y-auto">
        <Shell />
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}