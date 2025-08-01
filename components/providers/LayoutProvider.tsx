'use client'

import Shell from '@/components/custom/nav/shell'
import Footer from '../custom/nav/footer'

import React from 'react'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="flex flex-col min-h-screen">
        
        <Shell />
        <div className="flex flex-col relative flex-grow">
          {children}
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  )
}