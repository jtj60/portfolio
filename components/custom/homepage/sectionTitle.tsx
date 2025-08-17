import { GlowTubeLine } from '@/components/ui/glowBorder'
import { ShineBorder } from '@/components/ui/shine-border'
import { cn } from '@/lib/utils'

export default function SectionTitle({ title, className }: { title: string; className?: string }) {
  return (
    <>
      <div className="flex items-center justify-start w-full max-w-7xl">
        <h3 className="text-neutral-700 text-xl md:text-3xl pl-4 md:pl-0 pb-4 font-semibold embossed-text">
          {title}
        </h3>
      </div>
      <div className="relative flex flex-col w-full mb-5 md:mb-10">
        <GlowTubeLine
          className="z-10"
          orientation="horizontal"
          stroke={8}
          color="#ec4fb4"
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
        />
      </div>
    </>
  )
}
