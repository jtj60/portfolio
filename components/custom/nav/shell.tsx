'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { MenuIcon } from '@/components/icons/navIcon'

import Sidebar from './sidebar'

import React from 'react'

import { useDrawerStore } from '@/store/drawerStore'
import { protectedRoutes } from '@/types/routes'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/icons/logo'
import { ShineBorder } from '@/components/ui/shine-border'
import { LightsToggle } from './lightsToggle'

export default function Shell() {
  const pathname = usePathname()
  const { activeDrawer, openDrawer, closeDrawer } = useDrawerStore()
  const isAnyDrawerOpen = !!activeDrawer

  const menuItems = Object.entries(protectedRoutes)
    .filter(([_, route]) => route.desktopDisplay)
    .map(([key, route]) => ({
      key,
      href: route.path,
      label: route.desktopLabel,
    }))

  const anyActive = menuItems.some((item) => pathname === item.href)

  return (
    <div className={cn('z-60')}>
      <div className="hidden lg:flex p-4 px-20">
        <div className="flex items-center justify-between w-full gap-2">
          <Link href="/" className="px-0">
            <Logo height={64} size={128} className='text-muted'/>
          </Link>

          <div className="flex items-end">
            <div className="flex text-base items-center tracking-wide gap-8">
              <nav aria-label="Primary site navigation" className="hidden lg:block pt-2">
                <ul className="flex items-end text-base uppercase tracking-widest font-semibold gap-8">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    const linkClasses = isActive || !anyActive ? 'text-neutral-800' : 'text-neutral-800/65'
                    return (
                      <li key={item.key} className="relative flex pb-1">
                        {isActive && (
                          <ShineBorder
                            shineColor={['#3F3F46', '#27272A', '#18181B']}
                            borderTop={0}
                            borderBottom={2}
                            borderRight={0}
                            borderLeft={0}
                            className="z-1 rounded-md"
                          />
                        )}
                        <Link href={item.href} className={linkClasses}>
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>
          <LightsToggle />
        </div>
      </div>

      <div className="flex lg:hidden py-4 px-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="px-0">
            <Logo height={48} size={96} className='text-muted' />
          </Link>
        </div>
        <div className="lg:hidden flex items-center ml-auto gap-2">
          <Button
            className="p-0 hover:bg-card"
            variant="ghost"
            onClick={() => {
              if (isAnyDrawerOpen) {
                closeDrawer()
              } else {
                openDrawer('sidebar')
              }
            }}
          >
            <MenuIcon size={38} isOpen={isAnyDrawerOpen} className="p-0 text-neutral-900 mt-1" />
          </Button>
        </div>
      </div>

      <Sidebar />
    </div>
  )
}
