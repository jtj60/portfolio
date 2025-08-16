'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type BlendMode = React.CSSProperties['mixBlendMode']

interface GlowBorderSvgProps extends React.HTMLAttributes<HTMLDivElement> {
  borderTop?: number
  borderBottom?: number
  borderRight?: number
  borderLeft?: number
  colors?: string | string[]
  cap?: 'butt' | 'round' | 'square'
  glowBlend?: BlendMode
  bgGlowPasses?: Array<{ blur: number; opacity: number }>
  highlightWidth?: number
  highlightOpacity?: number
  /** NEW: widen only the blurred glow layers (px added to strokeWidth) */
  glowWidthBoost?: number
  /** NEW: pre-blur dilation radius (px) to “spread” the glow */
  glowSpread?: number
}

export function GlowBorderSvg({
  borderTop = 0,
  borderBottom = 4,
  borderRight = 0,
  borderLeft = 0,
  colors = '#4FABFF',
  cap = 'round',
  glowBlend = 'screen',
  bgGlowPasses = [
    { blur: 36, opacity: 0.45 },
    { blur: 80, opacity: 0.25 },
    { blur: 140, opacity: 0.12 },
  ],
  highlightWidth = 1.5,
  highlightOpacity = 0.9,
  glowWidthBoost = 3,   // <-- default boost
  glowSpread = 2,       // <-- default spread
  className,
  style,
  ...divProps
}: GlowBorderSvgProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const rawId = React.useId()
  const uid = React.useMemo(() => `gl_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [rawId])

  React.useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(([e]) => {
      const cr = e.contentRect
      setSize({ w: Math.max(1, cr.width), h: Math.max(1, cr.height) })
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const strokePaint = Array.isArray(colors) ? colors[0] : colors

  // place strokes inside the box
  const yTop    = Math.min(size.h, Math.max(0, borderTop / 2))
  const yBottom = size.h >= borderBottom ? (size.h - borderBottom / 2) : (size.h / 2)
  const xLeft   = Math.min(size.w, Math.max(0, borderLeft / 2))
  const xRight  = size.w >= borderRight ? (size.w - borderRight / 2) : (size.w / 2)

  const pathTop    = `M 0 ${yTop} L ${size.w} ${yTop}`
  const pathBottom = `M 0 ${yBottom} L ${size.w} ${yBottom}`
  const pathLeft   = `M ${xLeft} 0 L ${xLeft} ${size.h}`
  const pathRight  = `M ${xRight} 0 L ${xRight} ${size.h}`

  const hasTop = borderTop > 0
  const hasBottom = borderBottom > 0
  const hasLeft = borderLeft > 0
  const hasRight = borderRight > 0

  const baseStrokeProps = {
    stroke: strokePaint,
    vectorEffect: 'non-scaling-stroke' as const,
    strokeLinecap: cap,
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        'pointer-events-none absolute inset-0 overflow-visible',
        '[isolation:isolate]',
        className
      )}
      style={style}
      {...divProps}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
        colorInterpolationFilters="sRGB"
      >
        <defs>
          {/* one filter per glow pass; include a dilation step before blur */}
          {bgGlowPasses.map((p, i) => {
            const margin = p.blur * 4 + glowSpread * 2
            return (
              <filter
                key={i}
                id={`${uid}_bg_${i}`}
                filterUnits="userSpaceOnUse"
                x={-margin} y={-margin}
                width={size.w + margin * 2}
                height={size.h + margin * 2}
                colorInterpolationFilters="sRGB"
              >
                {glowSpread > 0 && (
                  <feMorphology in="SourceGraphic" operator="dilate" radius={glowSpread} result="d" />
                )}
                <feGaussianBlur in={glowSpread > 0 ? 'd' : 'SourceGraphic'} stdDeviation={p.blur} result="b" />
                <feComponentTransfer in="b">
                  {/* gentle shaping to avoid muddy mid-tones */}
                  <feFuncA type="gamma" amplitude="1" exponent="0.9" offset="0" />
                </feComponentTransfer>
              </filter>
            )
          })}
        </defs>

        {/* blurred underlays */}
        <g style={{ mixBlendMode: glowBlend }}>
          {bgGlowPasses.map((p, i) => (
            <g key={i} opacity={p.opacity}>
              {hasTop    && <path d={pathTop}    {...baseStrokeProps} strokeWidth={borderTop    + glowWidthBoost} filter={`url(#${uid}_bg_${i})`} />}
              {hasBottom && <path d={pathBottom} {...baseStrokeProps} strokeWidth={borderBottom + glowWidthBoost} filter={`url(#${uid}_bg_${i})`} />}
              {hasLeft   && <path d={pathLeft}   {...baseStrokeProps} strokeWidth={borderLeft   + glowWidthBoost} filter={`url(#${uid}_bg_${i})`} />}
              {hasRight  && <path d={pathRight}  {...baseStrokeProps} strokeWidth={borderRight  + glowWidthBoost} filter={`url(#${uid}_bg_${i})`} />}
            </g>
          ))}
        </g>

        {/* crisp stroke */}
        {hasTop    && <path d={pathTop}    {...baseStrokeProps} strokeWidth={borderTop} />}
        {hasBottom && <path d={pathBottom} {...baseStrokeProps} strokeWidth={borderBottom} />}
        {hasLeft   && <path d={pathLeft}   {...baseStrokeProps} strokeWidth={borderLeft} />}
        {hasRight  && <path d={pathRight}  {...baseStrokeProps} strokeWidth={borderRight} />}

        {/* white hot core */}
        {hasTop    && <path d={pathTop}    stroke="#fff" strokeWidth={Math.min(highlightWidth, borderTop)}    strokeOpacity={highlightOpacity} strokeLinecap={cap} />}
        {hasBottom && <path d={pathBottom} stroke="#fff" strokeWidth={Math.min(highlightWidth, borderBottom)} strokeOpacity={highlightOpacity} strokeLinecap={cap} />}
        {hasLeft   && <path d={pathLeft}   stroke="#fff" strokeWidth={Math.min(highlightWidth, borderLeft)}   strokeOpacity={highlightOpacity} strokeLinecap={cap} />}
        {hasRight  && <path d={pathRight}  stroke="#fff" strokeWidth={Math.min(highlightWidth, borderRight)}  strokeOpacity={highlightOpacity} strokeLinecap={cap} />}
      </svg>
    </div>
  )
}
