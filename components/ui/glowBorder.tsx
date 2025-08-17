'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useLightsStore } from '@/store/lightsStore'

type BlendMode = React.CSSProperties['mixBlendMode']

type GlowTubeLineProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
  stroke?: number
  color?: string

  // ON glow
  glowBlend?: BlendMode
  bgGlowPasses?: Array<{ blur: number; opacity: number }>
  glowWidthBoost?: number
  glowSpread?: number
  coreOpacity?: number

  // OFF glass look
  offGlassColor?: string
  offTintColor?: string
  offTintOpacity?: number
  offShadowBlur?: number
  offShadowOpacity?: number
  offRimOpacity?: number
  offInnerRimOpacity?: number
  offGlassAlpha?: number
  offNoiseOpacity?: number
  offTubeAlpha?: number
  offBackdrop?: boolean
  offBackdropBlur?: number
  offBackdropSaturate?: number
  offBackdropBrightness?: number
  offBackdropOpacity?: number

  // timings
  onMs?: number
  offMs?: number
  offColorMs?: number
  easing?: 'linear' | 'easeInOut' | 'easeOut'
}

export function GlowTubeLine({
  orientation = 'horizontal',
  stroke = 8,
  color = '#ec4fb4',

  glowBlend = 'screen',
  bgGlowPasses = [
    { blur: 72, opacity: 0.38 },
    { blur: 140, opacity: 0.22 },
    { blur: 220, opacity: 0.1 },
  ],
  glowWidthBoost = 10,
  glowSpread = 10,
  coreOpacity = 0.95,

  offGlassColor = '#a7adb4',
  offTintColor = 'hsl(215 14% 74%)',
  offTintOpacity = 0.12,
  offShadowBlur = 2.5,
  offShadowOpacity = 0.9,
  offRimOpacity = 0.26,
  offInnerRimOpacity = 0.18,
  offGlassAlpha = 0.6,
  offNoiseOpacity = 0.05,
  offTubeAlpha = 0.18,
  offBackdrop = true,
  offBackdropBlur = 2,
  offBackdropSaturate = 1.12,
  offBackdropBrightness = 1.05,
  offBackdropOpacity = 0.35,

  onMs = 260,
  offMs = 220,
  offColorMs = 0,
  easing = 'easeInOut',

  className,
  style,
  ...divProps
}: GlowTubeLineProps) {
  const lightsOn = useLightsStore((s) => s.lightsOn)

  const ref = React.useRef<HTMLDivElement>(null)
  const [sz, setSz] = React.useState({ w: 0, h: 0 })
  const rawId = React.useId()
  const uid = React.useMemo(() => `gtl_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [rawId])

  React.useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect
      setSz({ w: Math.max(1, r.width), h: Math.max(1, r.height) })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  // Quantize to avoid hydration drift from float stringification
  const q = (n: number) => Math.round(n * 1000) / 1000

  const w = sz.w
  const h = sz.h
  const cx = q(w / 2)
  const cy = q(h / 2)

  // after w/h/cx/cy
  const capPad = Math.ceil(stroke / 2) + 1 // 1px buffer
  const shadowPad = Math.max(12, stroke * 2)

  // endpoints (were 0..w or 0..h)
  const x1 = orientation === 'horizontal' ? capPad : cx
  const y1 = orientation === 'horizontal' ? cy : capPad
  const x2 = orientation === 'horizontal' ? Math.max(capPad, w - capPad) : cx
  const y2 = orientation === 'horizontal' ? cy : Math.max(capPad, h - capPad)

  const coreW = Math.max(1.5, stroke * 0.55)

  const tOn = { duration: onMs / 1000, ease: easing as any }
  const tOff = { duration: offMs / 1000, ease: easing as any }
  const tColorOff = { duration: offColorMs / 1000, ease: easing as any }

  // Linear glass gradient across thickness (perpendicular to the line)
  const gradX1 = 0
  const gradY1 = orientation === 'horizontal' ? cy - stroke / 2 : 0
  const gradX2 = orientation === 'horizontal' ? 0 : cx + stroke / 2
  const gradY2 = orientation === 'horizontal' ? cy + stroke / 2 : 0

  const coreBloom = Math.max(1.2, coreW * 0.35)
  const coreMargin = Math.max(stroke, coreW) * 6

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none relative w-full h-[28px]', className)}
      style={style}
      {...divProps}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
        initial={false}
        // Belt-and-suspenders in case any tiny number still differs:
        suppressHydrationWarning
      >
        <defs>
          {/* Glow filters (like the ring) */}
          {bgGlowPasses.map((p, i) => {
            const margin = p.blur * 4 + glowSpread * 2 + 8
            const fx = orientation === 'horizontal' ? -margin : cx - margin
            const fy = orientation === 'horizontal' ? cy - margin : -margin
            const fw = orientation === 'horizontal' ? w + margin * 2 : margin * 2
            const fh = orientation === 'horizontal' ? margin * 2 : h + margin * 2

            return (
              <filter
                key={i}
                id={`${uid}_bg_${i}`}
                filterUnits="userSpaceOnUse"
                x={fx}
                y={fy}
                width={fw}
                height={fh}
                colorInterpolationFilters="sRGB"
              >
                {glowSpread > 0 && (
                  <feMorphology
                    in="SourceGraphic"
                    operator="dilate"
                    radius={glowSpread}
                    result="d"
                  />
                )}
                <feGaussianBlur
                  in={glowSpread > 0 ? 'd' : 'SourceGraphic'}
                  stdDeviation={p.blur}
                  result="b"
                />
                <feComponentTransfer in="b">
                  <feFuncA type="gamma" amplitude="1" exponent="0.85" offset="0" />
                </feComponentTransfer>
              </filter>
            )
          })}

          <filter
            id={`${uid}_coreBloom`}
            filterUnits="userSpaceOnUse"
            x={orientation === 'horizontal' ? -coreMargin : cx - coreMargin}
            y={orientation === 'horizontal' ? cy - coreMargin : -coreMargin}
            width={orientation === 'horizontal' ? w + coreMargin * 2 : coreMargin * 2}
            height={orientation === 'horizontal' ? coreMargin * 2 : h + coreMargin * 2}
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={coreBloom} />
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="0.7" offset="0" />
            </feComponentTransfer>
          </filter>

          <filter
            id={`${uid}_offShadow`}
            filterUnits="userSpaceOnUse"
            x={-shadowPad}
            y={-shadowPad}
            width={w + shadowPad * 2}
            height={h + shadowPad * 2}
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={offShadowBlur} />
          </filter>

          <filter id={`${uid}_tintSoft`}>
            <feGaussianBlur stdDeviation="0.35" />
          </filter>

          {/* Grain (clipped by mask) */}
          <filter id={`${uid}_grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="1"
              seed="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>

          {/* Mask that limits fills/filters to the stroke thickness */}
          <mask id={`${uid}_lineMask`} maskUnits="userSpaceOnUse">
            <rect
              x={-capPad}
              y={-capPad}
              width={w + capPad * 2}
              height={h + capPad * 2}
              fill="black"
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth={stroke}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </mask>

          {/* Glass gradient across the tube thickness */}
          <linearGradient
            id={`${uid}_offGlassLG`}
            x1={gradX1}
            y1={gradY1}
            x2={gradX2}
            y2={gradY2}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#000" stopOpacity={0.25 * offGlassAlpha} />
            <stop offset="50%" stopColor="#fff" stopOpacity={0.35 * offGlassAlpha} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0.15 * offGlassAlpha} />
          </linearGradient>
        </defs>

        {/* ===== OFF: shadow & glass ===== */}
        {/* Soft drop shadow behind the tube */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#000"
          strokeOpacity={offShadowOpacity}
          strokeWidth={stroke + 3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${uid}_offShadow)`}
          initial={false}
          animate={{ opacity: lightsOn ? 0 : 1 }}
          transition={lightsOn ? tOn : tOff}
        />

        {/* Glass gradient clipped to the stroke */}
        <motion.rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill={`url(#${uid}_offGlassLG)`}
          mask={`url(#${uid}_lineMask)`}
          initial={false}
          animate={{ opacity: lightsOn ? 0 : 1 }}
          transition={lightsOn ? tOn : tOff}
        />

        {/* Subtle neutral tint */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={offTintColor}
          strokeOpacity={offTintOpacity}
          strokeWidth={Math.max(1, stroke * 0.22)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${uid}_tintSoft)`}
          initial={false}
          animate={{ opacity: lightsOn ? 0 : 1 }}
          transition={lightsOn ? tOn : tOff}
        />

        {/* Backdrop blur clipped to the line */}
        {offBackdrop && (
          <motion.g
            initial={false}
            animate={{ opacity: lightsOn ? 0 : offBackdropOpacity }}
            transition={lightsOn ? tOn : tOff}
          >
            <foreignObject
              x={0}
              y={0}
              width={w}
              height={h}
              mask={`url(#${uid}_lineMask)`}
              requiredExtensions="http://www.w3.org/1999/xhtml"
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backdropFilter: `blur(${offBackdropBlur}px) saturate(${offBackdropSaturate}) brightness(${offBackdropBrightness})`,
                  WebkitBackdropFilter: `blur(${offBackdropBlur}px) saturate(${offBackdropSaturate}) brightness(${offBackdropBrightness})`,
                }}
              />
            </foreignObject>
          </motion.g>
        )}

        {/* Outer bright rim */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fff"
          strokeOpacity={offRimOpacity}
          strokeWidth={Math.min(1.4, stroke * 0.42)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ opacity: lightsOn ? 0 : offRimOpacity }}
          transition={lightsOn ? tOn : tOff}
        />

        {/* Inner dark rim */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#000"
          strokeOpacity={offInnerRimOpacity}
          strokeWidth={Math.min(1.2, stroke * 0.36)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ opacity: lightsOn ? 0 : offInnerRimOpacity }}
          transition={lightsOn ? tOn : tOff}
        />

        {/* Tiny grain over the glass */}
        {offNoiseOpacity > 0 && (
          <motion.rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill="white"
            mask={`url(#${uid}_lineMask)`}
            filter={`url(#${uid}_grain)`}
            style={{ mixBlendMode: 'soft-light' as any }}
            initial={false}
            animate={{ opacity: lightsOn ? 0 : offNoiseOpacity }}
            transition={lightsOn ? tOn : tOff}
          />
        )}

        {/* ===== ON: neon halos ===== */}
        <motion.g
          style={{ mixBlendMode: glowBlend as any }}
          animate={lightsOn ? 'on' : 'off'}
          initial={false}
          variants={{ on: { opacity: 1 }, off: { opacity: 0 } }}
          transition={lightsOn ? tOn : tOff}
        >
          {bgGlowPasses.map((p, i) => (
            <g key={i} style={{ opacity: p.opacity }}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                fill="none"
                strokeWidth={stroke + glowWidthBoost}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                filter={`url(#${uid}_bg_${i})`}
              />
            </g>
          ))}
        </motion.g>

        {/* Physical tube (always visible; color snaps off first) */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{
            stroke: lightsOn ? color : offGlassColor,
            strokeOpacity: lightsOn ? 1 : offTubeAlpha,
            opacity: 1,
          }}
          transition={lightsOn ? tOn : tColorOff}
        />

        {/* Hot white core (only when ON) */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fff"
          strokeOpacity={lightsOn ? coreOpacity : 0}
          strokeWidth={lightsOn ? coreW : 0}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${uid}_coreBloom)`}
          initial={false}
          transition={lightsOn ? tOn : tOff}
        />
      </motion.svg>
    </div>
  )
}
