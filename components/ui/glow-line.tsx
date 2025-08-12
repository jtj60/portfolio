'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type GlowLineProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'vertical' | 'horizontal'
  position?: number // 0..1
  thickness?: number
  colors?: string | string[]
  blur?: number
}

export function GlowLine({
  orientation = 'vertical',
  position = 0.5,
  thickness = 4,
  colors = ['#5a75ff', '#f176c5', '#425fff', '#ec4fb4'],
  blur = 10,
  className,
  ...divProps
}: GlowLineProps) {
  const rawId = React.useId()
  // sanitize: only [A-Za-z0-9_-] so url(#...) works everywhere
  const id = React.useMemo(() => `gl_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [rawId])

  const stops = Array.isArray(colors) ? colors : [colors]
  const pct = (n: number) => `${(n * 100).toFixed(4)}%`

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
      {...divProps}
    >
      {/* block avoids inline baseline gap that can cause stray scrolling */}
      <svg className="w-full h-full block" preserveAspectRatio="none">
        <defs>
          <linearGradient
            id={`${id}-grad`}
            x1="0"
            y1="0"
            x2={orientation === 'vertical' ? '0' : '1'}
            y2={orientation === 'vertical' ? '1' : '0'}
            gradientUnits="objectBoundingBox"
          >
            {stops.map((c, i) => (
              <stop
                key={i}
                offset={pct(stops.length === 1 ? 0 : i / (stops.length - 1))}
                stopColor={c}
              />
            ))}
          </linearGradient>

          {/* keep filter bounds tight to avoid extra scrollbars */}
          <filter
            id={`${id}-bloom`}
            x="-10%"
            y="-300%"
            width="120%"
            height="700%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={blur} result="b" />
            <feColorMatrix
              in="b"
              result="b2"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${id}-bloom)`} style={{ mixBlendMode: 'screen' }}>
          {orientation === 'vertical' ? (
            <line
              x1={pct(position)}
              y1="0%"
              x2={pct(position)}
              y2="100%"
              stroke={`url(#${id}-grad)`}
              strokeWidth={thickness}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <line
              x1="0%"
              y1={pct(position)}
              x2="100%"
              y2={pct(position)}
              stroke={`url(#${id}-grad)`}
              strokeWidth={thickness}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>
      </svg>
    </div>
  )
}

export function StaticGlowRule({ height = 4 }: { height: number }) {
  return (
    <div className="w-full overflow-hidden">
      <svg
        width="100%"
        height="8" // line thickness lives here
        viewBox="0 0 1000 8"
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gl-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5a75ff" />
            <stop offset="50%" stopColor="#ec4fb4" />
            <stop offset="100%" stopColor="#425fff" />
          </linearGradient>

          {/* Bloom/glow */}
          <filter
            id="gl-bloom"
            x="-30%"
            y="-600%"
            width="160%"
            height="1200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="6" result="b" />
            <feColorMatrix
              in="b"
              result="b2"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#gl-bloom)">
          <line
            x1="0"
            y1="4"
            x2="1000"
            y2="4"
            stroke="url(#gl-grad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}

export function GlowRuleCSS({
  colors = ['#5a75ff', '#f176c5', '#425fff', '#ec4fb4'],
  height = 4,
  className,
}: {
  colors?: string[]
  height?: number
  className?: string
}) {
  const gradient = `linear-gradient(90deg, ${colors.join(',')})`
  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      {/* crisp core */}
      <div className="absolute inset-0 rounded-full" style={{ background: gradient }} />
      {/* soft glow */}
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-md"
        style={{ background: gradient }}
      />
    </div>
  )
}

export function SvgRuleBloom() {
  return (
    <div className="relative z-20 w-full h-[8px] overflow-hidden">
      <svg viewBox="0 1000 1000 8" className="block w-full h-full">
        <defs>
          <linearGradient id="rule-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#5a75ff" />
            <stop offset="50%"  stopColor="#ec4fb4" />
            <stop offset="100%" stopColor="#425fff" />
          </linearGradient>

          {/* Bloom around the stroke */}
          <filter id="rule-bloom" filterUnits="userSpaceOnUse" x="-80" y="-40" width="1160" height="88">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feColorMatrix in="b" result="b2" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#rule-bloom)">
          <line x1="0" y1="4" x2="1000" y2="4" stroke="url(#rule-grad)" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}
