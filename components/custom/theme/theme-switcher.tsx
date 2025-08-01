'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-16 h-16 flex flex-col items-center justify-center rounded-lg bg-card raised-off-page"
    >
      {theme === 'light' ? (
        <MoonIcon size={20} />
      ) : (
        <SunIcon size={20}  />
      )}
      <span className="text-sm text-primary-gradient">{theme === 'light' ? 'Dark' : 'Light'}</span>
    </Button>
  )
}
