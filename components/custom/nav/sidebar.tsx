'use client'

import Drawer from '@/components/ui/drawer'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { protectedRoutes } from '@/types/routes'
import { useDrawerStore } from '@/store/drawerStore'

export default function Sidebar() {
  const pathname = usePathname()

  const { activeDrawer, closeDrawer } = useDrawerStore()
  const isDrawerOpen = activeDrawer === 'sidebar'

  useEffect(() => {
    closeDrawer()
  }, [pathname, closeDrawer])

  const menuItems = Object.entries(protectedRoutes)
    .filter(([_, route]) => route.mobileDisplay)
    .map(([key, route]) => ({
      key,
      href: route.path,
      label: route.mobileLabel,
    }))

  const drawerContent = (
    <div className="w-full flex-col">
      <nav aria-label="Primary site navigation" className="flex-col items-center pb-5">
        <ul className="flex-col p-5 gap-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const linkClasses = isActive
              ? 'text-primary-gradient'
              : 'text-neutral-200 dark:text-neutral-800  hover-text-primary-gradient'
            return (
              <li className="flex-col items-center pb-5 text-xl" key={item.key}>
                <div className="flex items-center justify-center">
                  <Link href={item.href} className={linkClasses}>
                    {item.label}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )

  return (
    <Drawer open={isDrawerOpen} setOpen={closeDrawer}>
      <div className="w-screen h-full bg-neutral-800/50 dark:bg-neutral-200/50 backdrop-blur-xl border-t-1 border-border">
        {drawerContent}
      </div>
    </Drawer>
  )
}
