'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


type LightsState = {
  lightsOn: boolean
  set: (on: boolean) => void
  toggle: () => void
}

export const useLightsStore = create<LightsState>()(
  persist(
    (set, get) => ({
      lightsOn: true,
      set: (on) => set({ lightsOn: on }),
      toggle: () => set({ lightsOn: !get().lightsOn }),
    }),
    {
      name: 'lights',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

export function LightsBridge() {
  const lightsOn = useLightsStore((s) => s.lightsOn)

  useEffect(() => {
    document.documentElement.dataset.lights = lightsOn ? 'on' : 'off'
  }, [lightsOn])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'lights' || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue) as { state?: Partial<LightsState> }
        if (parsed?.state?.lightsOn !== undefined) {
          useLightsStore.setState({ lightsOn: parsed.state.lightsOn })
        }
      } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return null
}
