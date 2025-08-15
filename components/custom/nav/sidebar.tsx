'use client'

import Drawer from '@/components/ui/drawer'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

import { protectedRoutes } from '@/types/routes'
import { useDrawerStore } from '@/store/drawerStore'
import { cn } from '@/lib/utils'
import { ShineBorder } from '@/components/ui/shine-border'

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

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const drawerContent = (
    <div className="w-full flex-col">
      <nav aria-label="Primary site navigation" className="flex flex-col w-full mt-20">
        <motion.ul
          className="flex flex-col gap-8 w-full"
          variants={listVariants}
          initial="hidden"
          animate={isDrawerOpen ? 'visible' : 'hidden'}
        >
          {menuItems.map((item, idx) => {
            const offsetClass =
              idx % 2 === 0
                ? 'rounded-r-none pr-20'
                : 'rounded-l-none pl-20'

            const isActive = pathname === item.href

            return (
              <motion.li
                key={item.key}
                className={cn(idx % 2 === 0 ? 'ml-20' : 'mr-20', 'relative overflow-hidden')}
                initial={{ x: idx % 2 === 0 ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: idx % 2 === 0 ? '100%' : '-100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {isActive && (
                  <ShineBorder
                    shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
                    borderTop={2}
                    borderBottom={2}
                    borderRight={idx % 2 === 0 ? 0 : 2}
                    borderLeft={idx % 2 === 0 ? 2 : 0}
                    className={cn(
                      'z-1 rounded-lg',
                      idx % 2 === 0 ? 'rounded-r-none' : 'rounded-l-none'
                    )}
                  />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'block text-center text-2xl tracking-wide py-3 rounded-lg raised-off-page text-white bg-background',
                    offsetClass,
                    
                  )}
                >
                  {item.label}
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>
    </div>
  )

  return (
    <Drawer open={isDrawerOpen} setOpen={closeDrawer}>
      <div className="w-screen h-full">{drawerContent}</div>
    </Drawer>
  )
}
