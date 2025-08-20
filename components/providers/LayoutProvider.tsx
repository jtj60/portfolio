'use client'

import Shell from '@/components/custom/nav/shell'
import React from 'react'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-highest background-fiber">
      <div className="relative h-full overflow-y-auto">
        <Shell />
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </div>
    </div>
  )
}