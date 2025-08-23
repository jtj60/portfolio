'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Light, lights } from '@/types/lights'

type LightsState = {
  lightsOn: boolean
  light: Light
  set: (on: boolean) => void
  toggle: () => void
  setLight: (l: Light) => void
  next: () => void
  prev: () => void
}

export const useLightsStore = create<LightsState>()(
  persist(
    (set, get) => ({
      lightsOn: true,
      light: lights[0],

      set: (on) => set({ lightsOn: on }),
      toggle: () => set({ lightsOn: !get().lightsOn }),

      setLight: (l) => set({ light: l }),

      next: () => {
        const cur = get().light
        const i = lights.findIndex(x => x === cur || x.hex === cur.hex || x.name === cur.name)
        const idx = i >= 0 ? i : 0
        set({ light: lights[(idx + 1) % lights.length] })
      },
      prev: () => {
        const cur = get().light
        const i = lights.findIndex(x => x === cur || x.hex === cur.hex || x.name === cur.name)
        const idx = i >= 0 ? i : 0
        set({ light: lights[(idx - 1 + lights.length) % lights.length] })
      },
    }),
    {
      name: 'lights',
      version: 3,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
