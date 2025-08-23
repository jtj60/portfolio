import { NeonLight } from '@/components/ui/neon-lights'
import { useLightsStore } from '@/store/lightsStore'

export default function SectionTitle({ title, className }: { title: string; className?: string }) {
  const { lightsOn, light } = useLightsStore()
  return (
    <>
      <div className="flex items-center justify-start w-full max-w-7xl">
        <h3 className="text-neutral-700 text-xl md:text-3xl pl-4 md:pl-0 pb-4 font-semibold embossed-text">
          {title}
        </h3>
      </div>
      <div className="relative flex flex-col w-full mb-5 md:mb-10">
        <NeonLight
          lightsOn={lightsOn}
          className="z-10 absolute"
          orientation="horizontal"
          stroke={8}
                    color={light.hex}

          glowBlend="screen"
          glowWidthBoost={10}
          glowSpread={10}
          bgGlowPasses={[
            { blur: 72, opacity: 0.38 },
            { blur: 140, opacity: 0.22 },
            { blur: 220, opacity: 0.1 },
          ]}
          onMs={10}
          offMs={10}
          easing="easeInOut"
          mountLinePadStart={30}
          mountLinePadEnd={30}
          mountCount={4}
          offRimOpacity={0.1}
          offShadowOpacity={0.5}
          offBackdrop
          offBackdropBlur={10}
          offBackdropSaturate={1.08}
          offBackdropBrightness={1.07}
          offBackdropOpacity={0.45}
        />
      </div>
    </>
  )
}
