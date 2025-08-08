'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderTop?: number
  borderBottom?: number
  borderRight?: number
  borderLeft?: number
  duration?: number
  shineColor?: string | string[]
}

export function ShineBorder({
  borderTop = 1,
  borderBottom = 1,
  borderLeft = 1,
  borderRight = 1,
  duration = 14,
  shineColor = '#000',
  className,
  style,
  ...props
}: ShineBorderProps) {
  const paddingStyles = {
    paddingTop: `${borderTop}px`,
    paddingBottom: `${borderBottom}px`,
    paddingLeft: `${borderLeft}px`,
    paddingRight: `${borderRight}px`,
  }

  return (
    <div
      style={
        {
          ...paddingStyles,
          '--duration': `${duration}s`,
          backgroundImage: `radial-gradient(${
            Array.isArray(shineColor) ? shineColor.join(',') : shineColor
          }, transparent, transparent)`,
          backgroundSize: '300% 300%',
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] will-change-[background-position] motion-safe:animate-shine',
        className
      )}
      {...props}
    />
  )
}
