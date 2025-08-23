import { Light, lights } from '@/types/lights'
import { NeonLight } from './neon-lights'
import { GlassMountCard } from './glass-mount'
import { Button } from './button'
import { useLightsStore } from '@/store/lightsStore'
import { cn } from '@/lib/utils'

export default function ControlPanel() {
  const { lightsOn, toggle, set, light } = useLightsStore()
  return (
    <div className="flex w-full h-full">
      <GlassMountCard
        className="z-10 w-full h-full p-8 rounded-lg"
        blur={3}
        elevation={0.3}
        brightness={0.9}
        showRim={true}
        showMounts={true}
        mountRadius={5}
      >
        <GlassMountCard
          className="z-10 w-full h-full p-5 rounded-2xl flex flex-col gap-5"
          blur={0}
          elevation={0}
          brightness={0.2}
          showRim={true}
          showMounts={false}
          mountRadius={5}
        >
          <div className="flex w-full justify-between items-start">
            <div className="rounded-md w-full h-full grid grid-cols-3 md:grid-cols-5 gap-3 flex-grow">
              {lights.map((light) => (
                <LightButton light={light} key={light.name} />
              ))}
            </div>
            <div className="flex flex-col w-full items-center justify-center gap-0">
              <Button
                className={cn(
                  'rounded-lg flex items-center justify-center p-10 w-1/3 text-2xl shadow-none bg-neutral-900 text-neutral-200 border-2 ring-none rounded-b-none',
                  lightsOn && light.bg,
                  !lightsOn ? 'hover:bg-neutral-900' : light.hoverBg,
                  light.border
                )}
                onClick={() => set(true)}
              >
                On
              </Button>
              <Button
                className={cn(
                  'rounded-lg flex items-center justify-center p-10 w-1/3 text-2xl shadow-none bg-neutral-900 text-neutral-200 border-2 ring-none rounded-t-none',
                  !lightsOn && light.bg,
                  lightsOn ? 'hover:bg-neutral-900' : light.hoverBg,
                  light.border
                )}
                onClick={() => set(false)}
              >
                Off
              </Button>
            </div>
          </div>
          <div className="flex w-full"></div>
        </GlassMountCard>
      </GlassMountCard>
    </div>
  )
}

function LightButton({ light }: { light: Light }) {
  const { setLight, light: currentLight } = useLightsStore()
  return (
    <>
      <Button
        className="relative flex items-center justify-center aspect-square rounded-md overflow-hidden"
        onClick={() => setLight(light)}
      >
        <GlassMountCard
          className="absolute inset-0 z-10 rounded-none"
          blur={3}
          elevation={1}
          brightness={0.9}
          showRim={false}
          showMounts={false}
        />

        <NeonLight
          lightsOn
          className="absolute inset-0 px-2"
          orientation="horizontal"
          stroke={6}
          color={light.hex}
          glowBlend="screen"
          glowWidthBoost={25}
          glowSpread={3}
          bgGlowPasses={[
            { blur: 10, opacity: 0.9 },
            { blur: 20, opacity: 0.6 },
            { blur: 25, opacity: 0.3 },
            { blur: 35, opacity: 0.15 },
          ]}
          showMounts={false}
          tubeOpacity={0.9}
          coreOpacity={0.9}
        />
      </Button>
    </>
  )
}
