'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type BlendMode = React.CSSProperties['mixBlendMode']

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderTop?: number
  borderBottom?: number
  borderRight?: number
  borderLeft?: number
  duration?: number
  shineColor?: string | string[]
  glow?: boolean
  glowBlur?: number
  glowOpacity?: number
  glowBlend?: BlendMode
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
  glow = true,
  glowBlur = 16,
  glowOpacity = 0.6,
  glowBlend = 'screen',
  ...props
}: ShineBorderProps) {
  // this must live on the SAME element that’s masked
  const ringStyles: React.CSSProperties = {
    paddingTop: `${borderTop}px`,
    paddingBottom: `${borderBottom}px`,
    paddingLeft: `${borderLeft}px`,
    paddingRight: `${borderRight}px`,
    backgroundImage: `radial-gradient(${
      Array.isArray(shineColor) ? shineColor.join(',') : shineColor
    }, transparent 60%, transparent 100%)`,
    backgroundSize: '300% 300%',
    // mask a ring: content-box keeps the inner cutout aligned with padding
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }

  return (
    <div
      // let children inherit the animation duration var
      style={{ ['--duration' as any]: `${duration}s`, ...style }}
      className={cn(
        'pointer-events-none absolute inset-0 overflow-visible rounded-[inherit]',
        className
      )}
      {...props}
    >
      {/* crisp ring */}
      <div
        aria-hidden
        style={ringStyles}
        className="absolute inset-0 rounded-[inherit] will-change-[background-position] motion-safe:animate-shine"
      />

      {/* soft glow ring */}
      {glow && (
        <div
          aria-hidden
          style={{
            ...ringStyles,
            opacity: glowOpacity,
            filter: `blur(${glowBlur}px) drop-shadow(0 0 ${Math.round(
              glowBlur * 1.25
            )}px rgba(0,0,0,0.15))`,
            mixBlendMode: glowBlend,
          }}
          className="absolute inset-0 rounded-[inherit] will-change-[background-position] motion-safe:animate-shine"
        />
      )}
    </div>
  )
}
