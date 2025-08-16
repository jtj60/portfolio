'use client'
import { Button } from '@/components/ui/button'
import { useLightsStore } from '@/store/lightsStore'
import {  LightbulbIcon } from '@phosphor-icons/react'

export function LightsToggle({ className }: { className?: string }) {
  const lightsOn = useLightsStore((s) => s.lightsOn)
  const toggle = useLightsStore((s) => s.toggle)

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggle}
      className={className}
      aria-pressed={!lightsOn}
      title={lightsOn ? 'Turn lights off' : 'Turn lights on'}
    >
      <LightbulbIcon size={18} className="mr-2" />
      {lightsOn ? 'Lights: On' : 'Lights: Off'}
    </Button>
  )
}