'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useLightsStore } from '@/store/lightsStore'

// =========================
// Types
// =========================
export type BlendMode = React.CSSProperties['mixBlendMode']

export interface GlowRingProps extends React.HTMLAttributes<HTMLDivElement> {
  // Shared
  stroke?: number
  color?: string

  // ON glow
  glowBlend?: BlendMode
  bgGlowPasses?: Array<{ blur: number; opacity: number }>
  glowWidthBoost?: number
  glowSpread?: number
  coreOpacity?: number
  tubeOpacity?: number

  // OFF glass look
  offGlassColor?: string
  offTintColor?: string
  offTintOpacity?: number
  offShadowBlur?: number
  offShadowOpacity?: number
  offRimOpacity?: number
  offSpecAngle?: number
  offSpecArc?: number
  offSpecOpacity?: number

  // OFF glass shaping
  offInnerRimOpacity?: number
  offGlassAlpha?: number
  offNoiseOpacity?: number
  offTubeAlpha?: number
  offBackdrop?: boolean
  offBackdropBlur?: number
  offBackdropSaturate?: number
  offBackdropBrightness?: number
  offBackdropOpacity?: number

  // Timings
  onMs?: number
  offMs?: number
  offColorMs?: number
  easing?: 'linear' | 'easeInOut' | 'easeOut'

  // Mounts
  showMounts?: boolean
  mountAngles?: number[]
  mountPostLen?: number
  mountPostWidth?: number
  mountBaseRadius?: number
  mountHeadRadius?: number
  mountBaseColor?: string
  mountHeadColor?: string
  mountPostColor?: string
  mountShineOpacity?: number
  mountShadowBlur?: number
  mountShadowOpacity?: number
  mountCount?: number
  mountStartDeg?: number
  mountOutside?: boolean
}

// =========================
// Context (geometry, ids, timing, lights)
// =========================
interface Geometry {
  w: number
  h: number
  cx: number
  cy: number
  radius: number
  C: number // circumference
}

interface Timing {
  tOn: { duration: number; ease: any }
  tOff: { duration: number; ease: any }
  tColorOff: { duration: number; ease: any }
}

interface Ids {
  uid: string
}

interface RingContextValue {
  geo: Geometry
  ids: Ids
  timing: Timing
  Q: (n: number) => number
  q: (n: number) => number
  toRad: (deg: number) => number
  polarQ: (deg: number, r: number, cx?: number, cy?: number) => { x: number; y: number }
  lightsOn: boolean
}

const RingCtx = React.createContext<RingContextValue | null>(null)

function useRing() {
  const ctx = React.useContext(RingCtx)
  if (!ctx) throw new Error('GlowRing subcomponent used outside <GlowRing>')
  return ctx
}

// =========================
// Hooks & helpers
// =========================
function useMeasure() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  React.useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return { ref, size }
}

function useUid(prefix = 'gr_') {
  const raw = React.useId()
  return React.useMemo(() => `${prefix}${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`, [prefix, raw])
}

const nz = (n: number) => (Object.is(n, -0) ? 0 : n)
const q = (n: number) => Math.round(n * 1000) / 1000
const Q = (n: number) => nz(q(n))
const toRad = (deg: number) => (deg * Math.PI) / 180
const polarQ = (deg: number, r: number, cx: number, cy: number) => ({
  x: Q(cx + r * Math.cos(toRad(deg))),
  y: Q(cy + r * Math.sin(toRad(deg))),
})

// =========================
// Defs (filters/gradients/masks) — purely presentational
// =========================
function Defs({
  stroke,
  color,
  glowSpread,
  bgGlowPasses,
  coreW,
  coreMargin,
  gradOuterR,
  innerEdgePct,
  midPct,
  offShadowBlur,
  offGlassAlpha,
  mountShadowBlur,
  mountShadowOpacity,
}: {
  stroke: number
  color: string
  glowSpread: number
  bgGlowPasses: Array<{ blur: number; opacity: number }>
  coreW: number
  coreMargin: number
  gradOuterR: number
  innerEdgePct: string
  midPct: string
  offShadowBlur: number
  offGlassAlpha: number
  mountShadowBlur: number
  mountShadowOpacity: number
}) {
  const { geo, ids, Q } = useRing()
  const { cx, cy, radius } = geo

  return (
    <defs>
      {bgGlowPasses.map((p, i) => {
        const margin = Q(p.blur * 4 + glowSpread * 2 + 8)
        return (
          <filter
            key={i}
            id={`${ids.uid}_bg_${i}`}
            filterUnits="userSpaceOnUse"
            x={Q(cx - radius - margin)}
            y={Q(cy - radius - margin)}
            width={Q(radius * 2 + margin * 2)}
            height={Q(radius * 2 + margin * 2)}
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

      {/* Core bloom */}
      <filter
        id={`${ids.uid}_coreBloom`}
        filterUnits="userSpaceOnUse"
        x={Q(geo.cx - geo.radius - coreMargin)}
        y={Q(geo.cy - geo.radius - coreMargin)}
        width={Q(geo.radius * 2 + coreMargin * 2)}
        height={Q(geo.radius * 2 + coreMargin * 2)}
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur stdDeviation={Math.max(1.2, coreW * 0.35)} />
        <feComponentTransfer>
          <feFuncA type="gamma" amplitude="1" exponent="0.7" offset="0" />
        </feComponentTransfer>
      </filter>

      {/* OFF shadow */}
      <filter id={`${ids.uid}_offShadow`} filterUnits="userSpaceOnUse" x={Q(cx - radius - 10)} y={Q(cy - radius - 10)} width={Q(radius * 2 + 20)} height={Q(radius * 2 + 20)}>
        <feGaussianBlur in="SourceGraphic" stdDeviation={offShadowBlur} />
      </filter>

      <filter id={`${ids.uid}_tintSoft`}>
        <feGaussianBlur stdDeviation="0.35" />
      </filter>

      {/* micro-grain for OFF glass */}
      <filter id={`${ids.uid}_grain`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="1" />
        </feComponentTransfer>
      </filter>

      {/* mask to confine fills to stroke thickness */}
      <mask id={`${ids.uid}_ringMask`} maskUnits="userSpaceOnUse">
        <rect x="0" y="0" width={geo.w} height={geo.h} fill="black" />
        <circle cx={geo.cx} cy={geo.cy} r={geo.radius} stroke="white" strokeWidth={stroke} fill="none" strokeLinecap="round" />
      </mask>

      {/* OFF glass radial */}
      <radialGradient id={`${ids.uid}_offGlassRG`} cx={geo.cx} cy={geo.cy} r={gradOuterR} gradientUnits="userSpaceOnUse">
        <stop offset={innerEdgePct} stopColor="#000" stopOpacity={0.25 * offGlassAlpha} />
        <stop offset={midPct} stopColor="#fff" stopOpacity={0.35 * offGlassAlpha} />
        <stop offset="100%" stopColor="#fff" stopOpacity={0.15 * offGlassAlpha} />
      </radialGradient>

      {/* Mounts filters/paints */}
      <filter id={`${ids.uid}_mountShadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation={mountShadowBlur} result="b" />
        <feOffset dx="0" dy="0" result="o" />
        <feComponentTransfer in="o">
          <feFuncA type="linear" slope={mountShadowOpacity} />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <linearGradient id={`${ids.uid}_steelDark`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4b5056" />
        <stop offset="0.5" stopColor="#6b7279" />
        <stop offset="1" stopColor="#353a40" />
      </linearGradient>

      <filter id={`${ids.uid}_metalGrain`} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="7" />
        <feColorMatrix type="saturate" values="0" />
        <feGaussianBlur stdDeviation="0.25" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.6" />
        </feComponentTransfer>
      </filter>

      <linearGradient id={`${ids.uid}_boltSteel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c4c9cf" />
        <stop offset="0.5" stopColor="#8a9097" />
        <stop offset="1" stopColor="#4a4f55" />
      </linearGradient>

      <radialGradient id={`${ids.uid}_washerSteel`} cx="50%" cy="50%" r="65%">
        <stop offset="0" stopColor="#c7ccd2" />
        <stop offset="0.6" stopColor="#8c9299" />
        <stop offset="0.82" stopColor="#5f656c" />
        <stop offset="1" stopColor="#2f3439" />
      </radialGradient>
    </defs>
  )
}

// =========================
// OFF state — glass, tint, rims, optional backdrop
// =========================
function OffGlass({
  stroke,
  offShadowOpacity,
  offTintColor,
  offTintOpacity,
  offRimOpacity,
  offInnerRimOpacity,
  offNoiseOpacity,
  offBackdrop,
  offBackdropOpacity,
  offBackdropBlur,
  offBackdropSaturate,
  offBackdropBrightness,
  offSpecAngle,
  offSpecArc,
  offSpecOpacity,
}: {
  stroke: number
  offShadowOpacity: number
  offTintColor: string
  offTintOpacity: number
  offRimOpacity: number
  offInnerRimOpacity: number
  offNoiseOpacity: number
  offBackdrop: boolean
  offBackdropOpacity: number
  offBackdropBlur: number
  offBackdropSaturate: number
  offBackdropBrightness: number
  offSpecAngle: number
  offSpecArc: number
  offSpecOpacity: number
}) {
  const { geo, ids, timing, Q, lightsOn } = useRing()
  const { cx, cy, radius, C } = geo

  const specLen = Q(Math.max(0, Math.min(1, offSpecArc)) * C)

  return (
    <g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="#000"
        fill="none"
        strokeOpacity={offShadowOpacity}
        strokeWidth={stroke + 3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#${ids.uid}_offShadow)`}
        initial={false}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      />

      <motion.rect
        x={Q(cx - (radius + stroke / 2))}
        y={Q(cy - (radius + stroke / 2))}
        width={Q((radius + stroke / 2) * 2)}
        height={Q((radius + stroke / 2) * 2)}
        fill={`url(#${ids.uid}_offGlassRG)`}
        mask={`url(#${ids.uid}_ringMask)`}
        initial={false}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      />

      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={offTintColor}
        strokeOpacity={offTintOpacity}
        fill="none"
        strokeWidth={Math.max(1, geo.radius > 0 ? stroke * 0.22 : 1)}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#${ids.uid}_tintSoft)`}
        initial={false}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      />

      {offBackdrop && (
        <motion.g initial={false} animate={{ opacity: lightsOn ? 0 : offBackdropOpacity }} transition={lightsOn ? timing.tOn : timing.tOff}>
          <foreignObject x={0} y={0} width={geo.w} height={geo.h} mask={`url(#${ids.uid}_ringMask)`} requiredExtensions="http://www.w3.org/1999/xhtml" style={{ pointerEvents: 'none' }}>
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

      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="#fff"
        strokeOpacity={offRimOpacity}
        fill="none"
        strokeWidth={Math.min(1.4, stroke * 0.42)}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ opacity: lightsOn ? 0 : offRimOpacity }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      />

      <motion.circle
        cx={cx}
        cy={cy}
        r={Q(Math.max(0, radius - Math.max(0.6, stroke * 0.3)))}
        stroke="#000"
        strokeOpacity={offInnerRimOpacity}
        fill="none"
        strokeWidth={Math.min(1.2, stroke * 0.36)}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ opacity: lightsOn ? 0 : offInnerRimOpacity }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      />

      <g transform={`rotate(${offSpecAngle} ${cx} ${cy})`}>
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#fff"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={`${specLen} ${Math.max(0, geo.C - specLen)}`}
          strokeWidth={Math.min(1.8, stroke * 0.6)}
          initial={false}
          animate={{ strokeOpacity: lightsOn ? 0 : offSpecOpacity }}
          transition={lightsOn ? timing.tOn : timing.tOff}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#fff"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={`${Q(specLen * 0.55)} ${Math.max(0, Q(geo.C - specLen * 0.55))}`}
          strokeWidth={Math.min(1.2, stroke * 0.42)}
          filter={`url(#${ids.uid}_tintSoft)`}
          initial={false}
          animate={{ opacity: lightsOn ? 0 : offSpecOpacity * 0.55 }}
          transition={lightsOn ? timing.tOn : timing.tOff}
        />
      </g>

      {offNoiseOpacity > 0 && (
        <motion.rect
          x={Q(cx - (radius + stroke / 2))}
          y={Q(cy - (radius + stroke / 2))}
          width={Q((radius + stroke / 2) * 2)}
          height={Q((radius + stroke / 2) * 2)}
          fill="white"
          mask={`url(#${ids.uid}_ringMask)`}
          filter={`url(#${ids.uid}_grain)`}
          style={{ mixBlendMode: 'soft-light' as any }}
          initial={false}
          animate={{ opacity: lightsOn ? 0 : offNoiseOpacity }}
          transition={lightsOn ? timing.tOn : timing.tOff}
        />
      )}
    </g>
  )}

// =========================
// ON state — neon halos
// =========================
function NeonGlow({ glowBlend, bgGlowPasses, glowWidthBoost, color, stroke }: { glowBlend: BlendMode; bgGlowPasses: Array<{ blur: number; opacity: number }>; glowWidthBoost: number; color: string; stroke: number }) {
  const { geo, ids, timing, lightsOn } = useRing()
  return (
    <motion.g style={{ mixBlendMode: glowBlend as any }} animate={lightsOn ? 'on' : 'off'} initial={false} variants={{ on: { opacity: 1 }, off: { opacity: 0 } }} transition={lightsOn ? timing.tOn : timing.tOff}>
      {bgGlowPasses.map((p, i) => (
        <g key={i} style={{ opacity: p.opacity }}>
          <circle cx={geo.cx} cy={geo.cy} r={geo.radius} stroke={color} fill="none" strokeWidth={stroke + glowWidthBoost} strokeLinecap="round" vectorEffect="non-scaling-stroke" filter={`url(#${ids.uid}_bg_${i})`} />
        </g>
      ))}
    </motion.g>
  )
}

// =========================
// Mounts — posts + washers + bolts
// =========================
export interface MountsProps {
  show: boolean
  mountAngles?: number[]
  mountCount: number
  mountStartDeg: number
  mountOutside: boolean
  mountPostLen: number
  mountPostWidth: number
  mountBaseRadius: number
  mountHeadRadius: number
  mountBaseColor: string
  mountHeadColor: string
  mountPostColor: string
  mountShineOpacity: number
  mountShadowBlur: number
  mountShadowOpacity: number
  color: string
}

function Mounts({
  show,
  mountAngles,
  mountCount,
  mountStartDeg,
  mountOutside,
  mountPostLen,
  mountPostWidth,
  mountBaseRadius,
  mountHeadRadius,
  mountBaseColor,
  mountHeadColor,
  mountPostColor,
  mountShineOpacity,
  mountShadowBlur,
  mountShadowOpacity,
  color,
}: MountsProps) {
  const { geo, ids, Q } = useRing()
  const { cx, cy, radius } = geo

  const toRadLocal = toRad
  const polarLocal = (deg: number, r: number) => polarQ(deg, r, cx, cy)

  const autoAngles = React.useMemo(
    () => Array.from({ length: mountCount }, (_, i) => mountStartDeg + (i * 360) / mountCount),
    [mountCount, mountStartDeg]
  )
  const angles = mountAngles && mountAngles.length ? mountAngles : autoAngles

  if (!show) return null

  return (
    <g filter={`url(#${ids.uid}_mountShadow)`}>
      {angles.map((a, i) => {
        const tube = polarLocal(a, radius)
        const baseR = mountOutside ? radius + mountPostLen : Math.max(0, radius - mountPostLen)
        const base = polarLocal(a, baseR)
        const nx = q(Math.cos(toRadLocal(a + 90)))
        const ny = q(Math.sin(toRadLocal(a + 90)))

        // sizes (smaller “glass” under tube; distinct ring under bolt)
        const tubeWasherR = Math.max(2, mountBaseRadius * 0.72)
        const boltWasherOuter = Math.max(2, tubeWasherR * 0.95)
        const boltWasherInner = Math.max(1, boltWasherOuter * 0.55)
        const boltR = Math.max(1.6, Math.min(mountHeadRadius, tubeWasherR))

        // metallic gradient across the post (perpendicular band, works at any angle)
        const half = Math.max(2, mountPostWidth * 1.3)
        const postGradId = `${ids.uid}_postSteel_${i}`

        return (
          <g key={`m${i}`}>
            <defs>
              <linearGradient id={postGradId} gradientUnits="userSpaceOnUse" x1={tube.x - nx * half} y1={tube.y - ny * half} x2={tube.x + nx * half} y2={tube.y + ny * half}>
                <stop offset="0" stopColor="#2f3439" />
                <stop offset="0.5" stopColor="#c4c9cf" />
                <stop offset="1" stopColor="#2f3439" />
              </linearGradient>
            </defs>

            {/* 1) POST — drawn first so it sits under washers & glass */}
            <line x1={base.x} y1={base.y} x2={tube.x} y2={tube.y} stroke={`url(#${postGradId})`} strokeWidth={mountPostWidth} strokeLinecap="round" />

            {/* 2) Small washer under the glass tube */}
            <circle cx={tube.x} cy={tube.y} r={tubeWasherR} fill={`url(#${ids.uid}_washerSteel)`} />
            <circle cx={tube.x} cy={tube.y} r={Math.max(1, tubeWasherR - 1)} fill="none" stroke="#000" strokeOpacity={0.25} />
            <motion.circle cx={tube.x} cy={tube.y} r={tubeWasherR * 1.08} fill={color} initial={false} animate={{ opacity: useLightsStore.getState().lightsOn ? 0.1 : 0 }} transition={{ duration: 0.26 }} style={{ mixBlendMode: 'screen' as any }} filter={`url(#${ids.uid}_tintSoft)`} />

            {/* 3) Distinct bolt washer (ring) at base */}
            <circle cx={base.x} cy={base.y} r={boltWasherOuter} fill={`url(#${ids.uid}_washerSteel)`} />
            <circle cx={base.x} cy={base.y} r={boltWasherInner} fill="#1f2327" />
            <circle cx={base.x} cy={base.y} r={boltWasherOuter} fill="none" stroke="#fff" strokeOpacity={0.14} />
            <circle cx={base.x} cy={base.y} r={boltWasherInner} fill="none" stroke="#000" strokeOpacity={0.35} />

            {/* 4) Bolt head */}
            <circle cx={base.x} cy={base.y} r={boltR} fill={`url(#${ids.uid}_boltSteel)`} />
            <circle cx={base.x} cy={base.y} r={Math.max(0.8, boltR - 0.6)} fill="none" stroke="#fff" strokeOpacity={0.25} />
            {/* slot */}
            <rect x={Q(base.x - boltR * 0.6)} y={Q(base.y - boltR * 0.11)} width={Q(boltR * 1.2)} height={Q(boltR * 0.22)} rx={Q(boltR * 0.11)} fill="#2a2e33" />
            <rect x={Q(base.x - boltR * 0.6)} y={Q(base.y - boltR * 0.11)} width={Q(boltR * 1.2)} height={Q(boltR * 0.22)} rx={Q(boltR * 0.11)} fill="none" stroke="#fff" strokeOpacity={0.18} />
          </g>
        )
      })}
    </g>
  )
}

// =========================
// Glass tube + hot core
// =========================
function Tube({ stroke, tubeColor, offGlassColor, offTubeAlpha, tubeOpacity }: { stroke: number; tubeColor: string; offGlassColor: string; offTubeAlpha: number; tubeOpacity: number }) {
  const { geo, timing, lightsOn } = useRing()
  return (
    <motion.circle
      cx={geo.cx}
      cy={geo.cy}
      r={geo.radius}
      fill="none"
      stroke={tubeColor}
      strokeWidth={stroke}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={false}
      animate={{ stroke: lightsOn ? tubeColor : offGlassColor, strokeOpacity: lightsOn ? tubeOpacity : offTubeAlpha, opacity: 1 }}
      transition={lightsOn ? timing.tOn : timing.tColorOff}
    />
  )
}

function HotCore({ coreW, coreOpacity }: { coreW: number; coreOpacity: number }) {
  const { geo, ids, timing, lightsOn } = useRing()
  return (
    <motion.circle
      cx={geo.cx}
      cy={geo.cy}
      r={geo.radius}
      stroke="#fff"
      fill="none"
      strokeOpacity={lightsOn ? coreOpacity : 0}
      strokeWidth={lightsOn ? coreW : 0}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      filter={`url(#${ids.uid}_coreBloom)`}
      initial={false}
      transition={lightsOn ? timing.tOn : timing.tOff}
    />
  )
}

// =========================
// Main composite component
// =========================
export function GlowRing({
  stroke = 8,
  color = '#ec4fb4',

  glowBlend = 'screen',
  bgGlowPasses = [
    { blur: 24, opacity: 0.65 },
    { blur: 64, opacity: 0.38 },
    { blur: 128, opacity: 0.18 },
  ],
  glowWidthBoost = 10,
  glowSpread = 2,
  coreOpacity = 0.95,
  tubeOpacity = 1,

  offGlassColor = '#a7adb4',
  offTintColor = 'hsl(215 14% 74%)',
  offTintOpacity = 0.02,
  offShadowBlur = 1.5,
  offShadowOpacity = 0.7,
  offRimOpacity = 0.26,
  offSpecAngle = 0,
  offSpecArc = 0,
  offSpecOpacity = 0,
  offTubeAlpha = 0.25,
  offBackdrop = true,
  offBackdropBlur = 2,
  offBackdropSaturate = 1.12,
  offBackdropBrightness = 1.05,
  offBackdropOpacity = 0.35,

  offInnerRimOpacity = 0.18,
  offGlassAlpha = 0.6,
  offNoiseOpacity = 0.05,

  onMs = 260,
  offMs = 220,
  offColorMs = 0,
  easing = 'easeInOut',

  showMounts = true,
  mountAngles,
  mountCount = 6,
  mountStartDeg = 0,
  mountOutside = true,
  mountPostLen, // default after stroke known
  mountPostWidth,
  mountBaseRadius,
  mountHeadRadius,
  mountBaseColor = '#2f3439',
  mountHeadColor = '#4b5056',
  mountPostColor = '#3f454b',
  mountShineOpacity = 0.3,
  mountShadowBlur = 2.5,
  mountShadowOpacity = 0.28,

  className,
  style,
  ...divProps
}: GlowRingProps) {
  const lightsOn = useLightsStore((s) => s.lightsOn)
  const { ref, size } = useMeasure()
  const uid = useUid('gr_')

  // geometry
  const w = Q(size.w)
  const h = Q(size.h)
  const cx = Q(w / 2)
  const cy = Q(h / 2)
  const _radius = Q(Math.max(0, Math.min(w, h) / 2 - stroke / 2))
  const C = Q(2 * Math.PI * Math.max(_radius, 0.0001))

  // timings
  const tOn = { duration: onMs / 1000, ease: easing as any }
  const tOff = { duration: offMs / 1000, ease: easing as any }
  const tColorOff = { duration: offColorMs / 1000, ease: easing as any }

  // derive pieces
  const coreW = Math.max(1.5, stroke * 0.55)
  const coreMargin = Q(Math.max(8, coreW * 6))

  // radial glass gradient stops across thickness
  const gradOuterR = Q(_radius + stroke / 2)
  const innerEdgeT = gradOuterR > 0 ? Math.max(0, (_radius - stroke / 2) / gradOuterR) : 0.8
  const innerEdgePct = `${(innerEdgeT * 100).toFixed(3)}%`
  const midT = innerEdgeT + (1 - innerEdgeT) * 0.45
  const midPct = `${(midT * 100).toFixed(3)}%`

  // defaults that depend on stroke
  const _mountPostLen = mountPostLen ?? Math.max(14, stroke * 1.25)
  const _mountPostWidth = mountPostWidth ?? Math.max(2, stroke * 0.18)
  const _mountBaseRadius = mountBaseRadius ?? Math.max(3.5, stroke * 0.48)
  const _mountHeadRadius = mountHeadRadius ?? Math.max(2.5, stroke * 0.34)

  const ctxValue = React.useMemo<RingContextValue>(
    () => ({
      geo: { w, h, cx, cy, radius: _radius, C },
      ids: { uid },
      timing: { tOn, tOff, tColorOff },
      Q,
      q,
      toRad,
      polarQ: (deg, r, _cx = cx, _cy = cy) => polarQ(deg, r, _cx, _cy),
      lightsOn,
    }),
    [w, h, cx, cy, _radius, C, uid, tOn, tOff, tColorOff, lightsOn]
  )

  return (
    <div ref={ref} className={cn('pointer-events-none absolute inset-0 overflow-visible [isolation:isolate]', className)} style={style} {...divProps}>
      <RingCtx.Provider value={ctxValue}>
        <motion.svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
          initial={false}
          suppressHydrationWarning
        >
          <Defs
            stroke={stroke}
            color={color}
            glowSpread={glowSpread}
            bgGlowPasses={bgGlowPasses}
            coreW={coreW}
            coreMargin={coreMargin}
            gradOuterR={gradOuterR}
            innerEdgePct={innerEdgePct}
            midPct={midPct}
            offShadowBlur={offShadowBlur}
            offGlassAlpha={offGlassAlpha}
            mountShadowBlur={mountShadowBlur}
            mountShadowOpacity={mountShadowOpacity}
          />

          {/* OFF state visuals */}
          <OffGlass
            stroke={stroke}
            offShadowOpacity={offShadowOpacity}
            offTintColor={offTintColor}
            offTintOpacity={offTintOpacity}
            offRimOpacity={offRimOpacity}
            offInnerRimOpacity={offInnerRimOpacity}
            offNoiseOpacity={offNoiseOpacity}
            offBackdrop={offBackdrop}
            offBackdropOpacity={offBackdropOpacity}
            offBackdropBlur={offBackdropBlur}
            offBackdropSaturate={offBackdropSaturate}
            offBackdropBrightness={offBackdropBrightness}
            offSpecAngle={offSpecAngle}
            offSpecArc={offSpecArc}
            offSpecOpacity={offSpecOpacity}
          />

          {/* ON glow halos */}
          <NeonGlow glowBlend={glowBlend} bgGlowPasses={bgGlowPasses} glowWidthBoost={glowWidthBoost} color={color} stroke={stroke} />

          {/* Mounts */}
          <Mounts
            show={showMounts}
            mountAngles={mountAngles}
            mountCount={mountCount}
            mountStartDeg={mountStartDeg}
            mountOutside={mountOutside}
            mountPostLen={_mountPostLen}
            mountPostWidth={_mountPostWidth}
            mountBaseRadius={_mountBaseRadius}
            mountHeadRadius={_mountHeadRadius}
            mountBaseColor={mountBaseColor}
            mountHeadColor={mountHeadColor}
            mountPostColor={mountPostColor}
            mountShineOpacity={mountShineOpacity}
            mountShadowBlur={mountShadowBlur}
            mountShadowOpacity={mountShadowOpacity}
            color={color}
          />

          {/* Glass tube & hot core */}
          <Tube stroke={stroke} tubeColor={color} offGlassColor={offGlassColor} offTubeAlpha={offTubeAlpha} tubeOpacity={tubeOpacity} />
          <HotCore coreW={coreW} coreOpacity={coreOpacity} />
        </motion.svg>
      </RingCtx.Provider>
    </div>
  )
}

// Optional: compound exports if you ever want custom composition
GlowRing.OffGlass = OffGlass as any
GlowRing.NeonGlow = NeonGlow as any
GlowRing.Mounts = Mounts as any
GlowRing.Tube = Tube as any
GlowRing.HotCore = HotCore as any
