'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useLightsStore } from '@/store/lightsStore'
import { motion } from 'motion/react'

type BlendMode = React.CSSProperties['mixBlendMode']

interface GlowRingProps extends React.HTMLAttributes<HTMLDivElement> {
  // Shared
  stroke?: number
  color?: string

  // ON glow
  glowBlend?: BlendMode
  bgGlowPasses?: Array<{ blur: number; opacity: number }>
  glowWidthBoost?: number
  glowSpread?: number
  coreWidth?: number
  coreOpacity?: number
  tubeOpacity?: number

  // OFF “glass tube” look
  offGlassColor?: string
  offTintColor?: string
  offTintOpacity?: number
  offShadowBlur?: number
  offShadowOpacity?: number
  offRimOpacity?: number
  offSpecAngle?: number
  offSpecArc?: number
  offSpecOpacity?: number

  // Timings
  onMs?: number
  offMs?: number
  offColorMs?: number
  easing?: 'linear' | 'easeInOut' | 'easeOut'
}

export function GlowRing({
  // Tube
  stroke = 12,
  color = '#ec4fb4',

  // ON glow
  glowBlend = 'screen',
  bgGlowPasses = [
    { blur: 24, opacity: 0.65 },
    { blur: 64, opacity: 0.38 },
    { blur: 128, opacity: 0.18 },
  ],
  glowWidthBoost = 10,
  glowSpread = 2,
  coreWidth = 0,
  coreOpacity = 0.95,
  tubeOpacity = 1, // kept for compatibility, not used to hide the tube

  // OFF glass/tint
  offGlassColor = '#a7adb4',
  offTintColor = '#ff6ea8',
  offTintOpacity = 0.22,
  offShadowBlur = 2.5,
  offShadowOpacity = 0.8,
  offRimOpacity = 0.22,
  offSpecAngle = -35,
  offSpecArc = 0.08,
  offSpecOpacity = 0.9,

  // Timings
  onMs = 260,
  offMs = 220,
  offColorMs = 0,
  easing = 'easeInOut',

  className,
  style,
  ...divProps
}: GlowRingProps) {
  const lightsOn = useLightsStore(s => s.lightsOn)

  const ref = React.useRef<HTMLDivElement>(null)
  const [sz, setSz] = React.useState({ w: 0, h: 0 })
  const rawId = React.useId()
  const uid = React.useMemo(() => `gr_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`, [rawId])

  React.useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect
      setSz({ w: Math.max(1, r.width), h: Math.max(1, r.height) })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const w = sz.w, h = sz.h
  const cx = w / 2, cy = h / 2
  const radius = Math.max(0, Math.min(w, h) / 2 - stroke / 2)
  const C = 2 * Math.PI * Math.max(radius, 0.0001)
  const tOn  = { duration: onMs / 1000,  ease: easing }
  const tOff = { duration: offMs / 1000, ease: easing }
  const tColorOff = {duration: offColorMs / 1000, ease: easing}
  const animateKey = lightsOn ? 'on' : 'off'

  const coreW = coreWidth > 0 ? coreWidth : Math.max(1.5, stroke * 0.55)
  const specLen = Math.max(0, Math.min(1, offSpecArc)) * C
  const tubeColor = color

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none absolute inset-0 overflow-visible [isolation:isolate]', className)}
      style={style}
      {...divProps}
    >
      <motion.svg
        width="100%" height="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
        initial={false}
      >
        <defs>
          {bgGlowPasses.map((p, i) => {
            const margin = p.blur * 4 + glowSpread * 2 + 8
            return (
              <filter
                key={i}
                id={`${uid}_bg_${i}`}
                filterUnits="userSpaceOnUse"
                x={cx - radius - margin}
                y={cy - radius - margin}
                width={radius * 2 + margin * 2}
                height={radius * 2 + margin * 2}
                colorInterpolationFilters="sRGB"
              >
                {glowSpread > 0 && (
                  <feMorphology in="SourceGraphic" operator="dilate" radius={glowSpread} result="d" />
                )}
                <feGaussianBlur in={glowSpread > 0 ? 'd' : 'SourceGraphic'} stdDeviation={p.blur} result="b" />
                <feComponentTransfer in="b">
                  <feFuncA type="gamma" amplitude="1" exponent="0.85" offset="0" />
                </feComponentTransfer>
              </filter>
            )
          })}

          <filter id={`${uid}_coreBloom`} colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={Math.max(1.2, coreW * 0.35)} />
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="0.7" offset="0" />
            </feComponentTransfer>
          </filter>

          <filter
            id={`${uid}_offShadow`}
            filterUnits="userSpaceOnUse"
            x={cx - radius - 10}
            y={cy - radius - 10}
            width={radius * 2 + 20}
            height={radius * 2 + 20}
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={offShadowBlur} />
          </filter>
          <filter id={`${uid}_tintSoft`}>
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>

        {/* ===== OFF: glass tube accents ===== */}
        <g>
          <motion.circle
            cx={cx} cy={cy} r={radius}
            stroke="#000" fill="none"
            strokeOpacity={offShadowOpacity}
            strokeWidth={stroke + 3}
            strokeLinecap="round" vectorEffect="non-scaling-stroke"
            filter={`url(#${uid}_offShadow)`}
            initial={false}
            animate={{ opacity: lightsOn ? 0 : 1 }}
            transition={lightsOn ? tOn : tOff}
          />
          <motion.circle
            cx={cx} cy={cy} r={radius}
            stroke={offTintColor}
            strokeOpacity={offTintOpacity}
            fill="none"
            strokeWidth={Math.max(1, stroke * 0.22)}
            strokeLinecap="round" vectorEffect="non-scaling-stroke"
            filter={`url(#${uid}_tintSoft)`}
            initial={false}
            animate={{ opacity: lightsOn ? 0 : 1 }}
            transition={lightsOn ? tOn : tOff}
          />
          <motion.circle
            cx={cx} cy={cy} r={radius}
            stroke="#fff"
            strokeOpacity={offRimOpacity}
            fill="none"
            strokeWidth={Math.min(1.4, stroke * 0.42)}
            strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ opacity: lightsOn ? 0 : offRimOpacity }}
            transition={lightsOn ? tOn : tOff}
          />
          <g transform={`rotate(${offSpecAngle} ${cx} ${cy})`}>
            <motion.circle
              cx={cx} cy={cy} r={radius}
              stroke="#fff" fill="none"
              strokeLinecap="round" vectorEffect="non-scaling-stroke"
              strokeDasharray={`${specLen} ${Math.max(0, C - specLen)}`}
              strokeWidth={Math.min(1.8, stroke * 0.6)}
              initial={false}
              animate={{ strokeOpacity: lightsOn ? 0 : offSpecOpacity }}
              transition={lightsOn ? tOn : tOff}
            />
          </g>
        </g>

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
              <circle
                cx={cx} cy={cy} r={radius}
                stroke={tubeColor} fill="none"
                strokeWidth={stroke + glowWidthBoost}
                strokeLinecap="round" vectorEffect="non-scaling-stroke"
                filter={`url(#${uid}_bg_${i})`}
              />
            </g>
          ))}
        </motion.g>

        {/* ===== PHYSICAL GLASS TUBING — ALWAYS VISIBLE ===== */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={tubeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          // Color swaps between offGlass and neon color; no opacity tween.
          animate={{ stroke: lightsOn ? tubeColor : offGlassColor, opacity: 1 }}
          transition={lightsOn ? tOn : tColorOff}
        />

        {/* hot white core (only when ON) */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          stroke="#fff" fill="none"
          strokeOpacity={lightsOn ? coreOpacity : 0}
          strokeWidth={lightsOn ? coreW : 0}
          strokeLinecap="round" vectorEffect="non-scaling-stroke"
          filter={`url(#${uid}_coreBloom)`}
          initial={false}
          transition={lightsOn ? tOn : tOff}
        />
      </motion.svg>
    </div>
  )
}
