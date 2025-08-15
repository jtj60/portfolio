import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";

export default function SectionTitle({ title, className }: { title: string; className?: string }) {
  return (
    <>
      <div className="flex items-center justify-start w-full max-w-7xl">
        <h3 className="text-neutral-700 text-xl md:text-3xl pl-4 md:pl-0 pb-4 font-semibold">{title}</h3>
      </div>
      <div className="relative flex flex-col w-full mb-5 md:mb-10 w-full">
        <ShineBorder
          shineColor={['#5a75ff', '#f176c5', '#425fff', '#ec4fb4']}
          borderTop={0}
          borderBottom={2}
          borderRight={0}
          borderLeft={0}
          className={cn('z-0 rounded-full bottom-1', className)}
        />
      </div>
    </>
  )
}