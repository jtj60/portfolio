import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

// ======================================================
// Types
// ======================================================
export type BlendMode = React.CSSProperties['mixBlendMode']
export type NeonLightOrientation = 'circle' | 'horizontal' | 'vertical'

export interface NeonLightProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: NeonLightOrientation
  stroke?: number
  color?: string
  lightsOn?: boolean

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
  offInnerRimOpacity?: number
  offGlassAlpha?: number
  offNoiseOpacity?: number
  offTubeAlpha?: number
  offBackdrop?: boolean
  offBackdropBlur?: number
  offBackdropSaturate?: number
  offBackdropBrightness?: number
  offBackdropOpacity?: number

  // Spec highlight (circle only)
  offSpecAngle?: number
  offSpecArc?: number
  offSpecOpacity?: number

  // Timings
  onMs?: number
  offMs?: number
  offColorMs?: number
  easing?: 'linear' | 'easeInOut' | 'easeOut'

  // Mounts (circle only)
  showMounts?: boolean
  mountAngles?: number[]
  mountCount?: number
  mountStartDeg?: number
  mountLinePadStart?: number
  mountLinePadEnd?: number
  mountBandSpan?: number
  mountBandWrap?: number
  mountBandCorner?: number

  /** Theme */
  mountSteelTheme?: 'bright' | 'dark'
}

// ======================================================
// Helpers
// ======================================================
const nz = (n: number) => (Object.is(n, -0) ? 0 : n)
const q = (n: number) => Math.round(n * 1000) / 1000
const Q = (n: number) => nz(q(n))
const toRad = (deg: number) => (deg * Math.PI) / 180
const polarQ = (deg: number, r: number, cx: number, cy: number) => ({
  x: Q(cx + r * Math.cos(toRad(deg))),
  y: Q(cy + r * Math.sin(toRad(deg))),
})

function useMeasure() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const lastSizeRef = React.useRef({ w: 0, h: 0 })

  React.useEffect(() => {
    if (!ref.current) return

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      const { width, height } = entry.contentRect
      const newW = Math.max(1, Math.round(width))
      const newH = Math.max(1, Math.round(height))

      if (lastSizeRef.current.w !== newW || lastSizeRef.current.h !== newH) {
        lastSizeRef.current = { w: newW, h: newH }
        setSize({ w: newW, h: newH })
      }
    })

    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return { ref, size }
}

function useUid(prefix = 'gt_') {
  const raw = React.useId()
  return React.useMemo(() => `${prefix}${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`, [prefix, raw])
}

// ======================================================
/** Geometry for circle or line */
type Geom =
  | {
      kind: 'circle'
      w: number
      h: number
      cx: number
      cy: number
      r: number
      C: number
    }
  | {
      kind: 'line'
      w: number
      h: number
      cx: number
      cy: number
      x1: number
      y1: number
      x2: number
      y2: number
      length: number
      axis: 'horizontal' | 'vertical'
      capPad: number
    }

function makeGeom(orientation: NeonLightOrientation, w: number, h: number, stroke: number): Geom {
  const cx = Q(w / 2)
  const cy = Q(h / 2)

  if (orientation === 'circle') {
    const r = Q(Math.max(0, Math.min(w, h) / 2 - stroke / 2))
    const C = Q(2 * Math.PI * Math.max(r, 0.0001))
    return { kind: 'circle', w, h, cx, cy, r, C }
  }

  const axis: 'horizontal' | 'vertical' = orientation
  const capPad = Math.ceil(stroke / 2) + 1
  const x1 = axis === 'horizontal' ? capPad : cx
  const y1 = axis === 'horizontal' ? cy : capPad
  const x2 = axis === 'horizontal' ? Math.max(capPad, w - capPad) : cx
  const y2 = axis === 'horizontal' ? cy : Math.max(capPad, h - capPad)
  const length = Math.max(0, axis === 'horizontal' ? x2 - x1 : y2 - y1)
  return { kind: 'line', w, h, cx, cy, x1, y1, x2, y2, length, axis, capPad }
}

// ======================================================
// Defs (filters/gradients/masks) — shape-aware
// ======================================================
/*** REPLACE YOUR Defs WITH THIS VERSION (unchanged API) ***/
function Defs({
  uid,
  geom,
  stroke,
  color,
  glowSpread,
  bgGlowPasses,
  coreW,
  coreMargin,
  offShadowBlur,
  offGlassAlpha,
  mountSteelTheme,
}: {
  uid: string
  geom: Geom
  stroke: number
  color: string
  glowSpread: number
  bgGlowPasses: Array<{ blur: number; opacity: number }>
  coreW: number
  coreMargin: number
  offShadowBlur: number
  offGlassAlpha: number
  mountSteelTheme: 'bright' | 'dark'
}) {
  const isCircle = geom.kind === 'circle'

  // put these near the existing `steel` const
  const hardware =
    mountSteelTheme === 'dark'
      ? { hi: '#b1b8bf', mid: '#6f757c', lo: '#2f353b', xlo: '#181c20' }
      : { hi: '#c9ced3', mid: '#8a9097', lo: '#3f454c', xlo: '#20252b' }

  const steel =
    mountSteelTheme === 'dark'
      ? { hi: '#b8c0c7', mid: '#80878e', lo: '#3d4349' }
      : { hi: '#d7dce1', mid: '#9aa1a8', lo: '#5a6168' }

  const glowFilters = bgGlowPasses.map((p, i) => {
    const margin = Q(p.blur * 4 + glowSpread * 2 + 8)
    if (isCircle) {
      const { cx, cy, r } = geom
      return (
        <filter
          key={i}
          id={`${uid}_bg_${i}`}
          filterUnits="userSpaceOnUse"
          x={Q(cx - r - margin)}
          y={Q(cy - r - margin)}
          width={Q(r * 2 + margin * 2)}
          height={Q(r * 2 + margin * 2)}
          colorInterpolationFilters="sRGB"
        >
          {glowSpread > 0 && (
            <feMorphology in="SourceGraphic" operator="dilate" radius={glowSpread} result="d" />
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
    } else {
      const { w, h, cx, cy, axis } = geom
      const fx = axis === 'horizontal' ? -margin : cx - margin
      const fy = axis === 'horizontal' ? cy - margin : -margin
      const fw = axis === 'horizontal' ? w + margin * 2 : margin * 2
      const fh = axis === 'horizontal' ? margin * 2 : h + margin * 2
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
            <feMorphology in="SourceGraphic" operator="dilate" radius={glowSpread} result="d" />
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
    }
  })

  const coreBloomFilter = (() => {
    if (isCircle) {
      const { cx, cy, r } = geom
      return (
        <filter
          id={`${uid}_coreBloom`}
          filterUnits="userSpaceOnUse"
          x={Q(cx - r - coreMargin)}
          y={Q(cy - r - coreMargin)}
          width={Q(r * 2 + coreMargin * 2)}
          height={Q(r * 2 + coreMargin * 2)}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={Math.max(1.2, coreW * 0.35)} />
          <feComponentTransfer>
            <feFuncA type="gamma" amplitude="1" exponent="0.7" offset="0" />
          </feComponentTransfer>
        </filter>
      )
    }
    const { w, h, cx, cy, axis } = geom
    return (
      <filter
        id={`${uid}_coreBloom`}
        filterUnits="userSpaceOnUse"
        x={axis === 'horizontal' ? -coreMargin : cx - coreMargin}
        y={axis === 'horizontal' ? cy - coreMargin : -coreMargin}
        width={axis === 'horizontal' ? w + coreMargin * 2 : coreMargin * 2}
        height={axis === 'horizontal' ? coreMargin * 2 : h + coreMargin * 2}
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur stdDeviation={Math.max(1.2, coreW * 0.35)} />
        <feComponentTransfer>
          <feFuncA type="gamma" amplitude="1" exponent="0.7" offset="0" />
        </feComponentTransfer>
      </filter>
    )
  })()

  const offShadowFilter = (() => {
    if (isCircle) {
      const { cx, cy, r } = geom
      return (
        <filter
          id={`${uid}_offShadow`}
          filterUnits="userSpaceOnUse"
          x={Q(cx - r - 10)}
          y={Q(cy - r - 10)}
          width={Q(r * 2 + 20)}
          height={Q(r * 2 + 20)}
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={offShadowBlur} />
        </filter>
      )
    }
    const { w, h } = geom
    const shadowPad = Math.max(12, stroke * 2)
    return (
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
    )
  })()

  const maskAndGlass = (() => {
    if (isCircle) {
      const g = geom
      const gradOuterR = Q(g.r + stroke / 2)
      const innerEdgeT = gradOuterR > 0 ? Math.max(0, (g.r - stroke / 2) / gradOuterR) : 0.8
      const innerEdgePct = `${(innerEdgeT * 100).toFixed(3)}%`
      const midT = innerEdgeT + (1 - innerEdgeT) * 0.45
      const midPct = `${(midT * 100).toFixed(3)}%`

      return (
        <>
          <mask id={`${uid}_tubeMask`} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={g.w} height={g.h} fill="black" />
            <circle
              cx={g.cx}
              cy={g.cy}
              r={g.r}
              stroke="white"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
            />
          </mask>

          <radialGradient
            id={`${uid}_offGlassPaint`}
            cx={g.cx}
            cy={g.cy}
            r={gradOuterR}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={innerEdgePct} stopColor="#000" stopOpacity={0.25 * offGlassAlpha} />
            <stop offset={midPct} stopColor="#fff" stopOpacity={0.35 * offGlassAlpha} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0.15 * offGlassAlpha} />
          </radialGradient>
        </>
      )
    } else {
      const g = geom
      const gradX1 = 0
      const gradY1 = g.axis === 'horizontal' ? g.cy - stroke / 2 : 0
      const gradX2 = g.axis === 'horizontal' ? 0 : g.cx + stroke / 2
      const gradY2 = g.axis === 'horizontal' ? g.cy + stroke / 2 : 0

      return (
        <>
          <mask id={`${uid}_tubeMask`} maskUnits="userSpaceOnUse">
            <rect
              x={-g.capPad}
              y={-g.capPad}
              width={g.w + g.capPad * 2}
              height={g.h + g.capPad * 2}
              fill="black"
            />
            <line
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              stroke="white"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          </mask>

          <linearGradient
            id={`${uid}_offGlassPaint`}
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
        </>
      )
    }
  })()

  return (
    <defs>
      {glowFilters}
      {coreBloomFilter}
      {offShadowFilter}

      <filter id={`${uid}_tintSoft`}>
        <feGaussianBlur stdDeviation="0.35" />
      </filter>

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

      {maskAndGlass}

      {/* --- hardware paints --- */}
      <linearGradient id={`${uid}_boltSteel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c4c9cf" />
        <stop offset="0.5" stopColor="#8a9097" />
        <stop offset="1" stopColor="#4a4f55" />
      </linearGradient>

      <radialGradient id={`${uid}_washerSteel`} cx="50%" cy="50%" r="65%">
        <stop offset="0" stopColor={steel.hi} />
        <stop offset="0.60" stopColor={steel.mid} />
        <stop offset="0.85" stopColor={steel.lo} />
        <stop offset="1" stopColor={steel.lo} />
      </radialGradient>

      <linearGradient
        id={`${uid}_faceAxial`}
        x1="0"
        y1="0"
        x2="1"
        y2="1"
        gradientTransform="rotate(35)"
      >
        <stop offset="0" stopColor={steel.lo} />
        <stop offset="0.35" stopColor={steel.hi} />
        <stop offset="0.65" stopColor={steel.mid} />
        <stop offset="1" stopColor={steel.lo} />
      </linearGradient>

      <radialGradient id={`${uid}_edgeVignette`} cx="50%" cy="50%" r="60%">
        <stop offset="65%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
      </radialGradient>

      <linearGradient id={`${uid}_glint`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.65" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>

      {/* grounding & light elevation */}
      <filter id={`${uid}_contactAO`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b" />
        <feOffset in="b" dx="0" dy="0.6" result="o" />
        <feComponentTransfer in="o" result="ao">
          <feFuncA type="linear" slope="0.45" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="ao" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter
        id={`${uid}_elev`}
        x="-70%"
        y="-70%"
        width="240%"
        height="240%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b1" />
        <feOffset in="b1" dx="0" dy="1.0" result="o1" />
        <feFlood floodColor="rgb(0 0 0)" floodOpacity="0.82" result="c1" />
        <feComposite in="c1" in2="o1" operator="in" result="s1" />

        <feGaussianBlur in="SourceAlpha" stdDeviation="2.8" result="b2" />
        <feOffset in="b2" dx="0" dy="3.6" result="o2" />
        <feFlood floodColor="rgb(0 0 0)" floodOpacity="0.18" result="c2" />
        <feComposite in="c2" in2="o2" operator="in" result="s2" />

        <feMerge>
          <feMergeNode in="s1" />
          <feMergeNode in="s2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* strap paints */}
      <linearGradient id={`${uid}_bandCross`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.60" />
        <stop offset="0.15" stopColor="#000" stopOpacity="0.25" />
        <stop offset="0.50" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="0.85" stopColor="#000" stopOpacity="0.25" />
        <stop offset="1" stopColor="#000" stopOpacity="0.60" />
      </linearGradient>

      {/* tube darkening at strap edges */}
      <linearGradient id={`${uid}_underEdge`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`${uid}_underEdgeFlip`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.55" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>

      <filter id={`${uid}_bandAO`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
  )
}

// ======================================================
// Shape primitives
// ======================================================
type ShapeStrokeProps = React.SVGAttributes<SVGElement> & { geom: Geom }

function ShapeStroke({ geom, ...rest }: ShapeStrokeProps) {
  if (geom.kind === 'circle') {
    const { cx, cy, r } = geom
    return <circle cx={cx} cy={cy} r={r} {...rest} />
  }
  const { x1, y1, x2, y2 } = geom
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...rest} />
}

// ======================================================
// OFF state visuals (shape-aware)
// ======================================================
function OffGlass({
  uid,
  geom,
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
  w,
  h,
  timing,
  lightsOn,
}: {
  uid: string
  geom: Geom
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
  w: number
  h: number
  timing: { tOn: any; tOff: any }
  lightsOn: boolean
}) {
  const isCircle = geom.kind === 'circle'
  const C = isCircle ? geom.C : 0
  const specLen = isCircle ? Q(Math.max(0, Math.min(1, offSpecArc)) * C) : 0

  return (
    <g>
      {/* shadow */}
      <motion.g
        initial={false}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      >
        <ShapeStroke
          geom={geom as any}
          stroke="#000"
          fill="none"
          strokeOpacity={offShadowOpacity}
          strokeWidth={stroke + 3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${uid}_offShadow)`}
        />
      </motion.g>

      {/* glass fill clipped to tube */}
      <motion.g
        initial={false}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      >
        <ShapeStroke
          geom={geom as any}
          stroke={`url(#${uid}_offGlassPaint)`}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.g>

      {/* subtle tint */}
      <motion.g
        initial={false}
        animate={{ opacity: lightsOn ? 0 : 1 }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      >
        <ShapeStroke
          geom={geom as any}
          stroke={offTintColor}
          strokeOpacity={offTintOpacity}
          fill="none"
          strokeWidth={Math.max(1, stroke * 0.22)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${uid}_tintSoft)`}
        />
      </motion.g>

      {/* backdrop blur clipped to tube */}
      {offBackdrop && (
        <motion.g
          initial={false}
          animate={{ opacity: lightsOn ? 0 : offBackdropOpacity }}
          transition={lightsOn ? timing.tOn : timing.tOff}
        >
          <foreignObject
            x={0}
            y={0}
            width={w}
            height={h}
            mask={`url(#${uid}_tubeMask)`}
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

      {/* outer/inner rims */}
      <motion.g
        initial={false}
        animate={{ opacity: lightsOn ? 0 : offRimOpacity }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      >
        <ShapeStroke
          geom={geom as any}
          stroke="#fff"
          fill="none"
          strokeWidth={Math.min(1.4, stroke * 0.42)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: lightsOn ? 0 : offInnerRimOpacity }}
        transition={lightsOn ? timing.tOn : timing.tOff}
      >
        {/* inner rim sits slightly inside: emulate with thinner stroke */}
        <ShapeStroke
          geom={geom as any}
          stroke="#000"
          fill="none"
          strokeWidth={Math.min(1.2, stroke * 0.36)}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </motion.g>

      {/* specular arcs (circle only) */}
      {isCircle && offSpecOpacity > 0 && (
        <g transform={`rotate(${offSpecAngle} ${geom.cx} ${geom.cy})`}>
          <motion.circle
            cx={geom.cx}
            cy={geom.cy}
            r={geom.r}
            stroke="#fff"
            fill="none"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={`${specLen} ${Math.max(0, geom.C - specLen)}`}
            strokeWidth={Math.min(1.8, stroke * 0.6)}
            initial={false}
            animate={{ strokeOpacity: lightsOn ? 0 : offSpecOpacity }}
            transition={lightsOn ? timing.tOn : timing.tOff}
          />
          <motion.circle
            cx={geom.cx}
            cy={geom.cy}
            r={geom.r}
            stroke="#fff"
            fill="none"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={`${Q(specLen * 0.55)} ${Math.max(0, Q(geom.C - specLen * 0.55))}`}
            strokeWidth={Math.min(1.2, stroke * 0.42)}
            filter={`url(#${uid}_tintSoft)`}
            initial={false}
            animate={{ opacity: lightsOn ? 0 : offSpecOpacity * 0.55 }}
            transition={lightsOn ? timing.tOn : timing.tOff}
          />
        </g>
      )}

      {/* tiny grain over glass */}
      {offNoiseOpacity > 0 && (
        <motion.rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill="white"
          mask={`url(#${uid}_tubeMask)`}
          filter={`url(#${uid}_grain)`}
          style={{ mixBlendMode: 'soft-light' as any }}
          initial={false}
          animate={{ opacity: lightsOn ? 0 : offNoiseOpacity }}
          transition={lightsOn ? timing.tOn : timing.tOff}
        />
      )}
    </g>
  )
}

// ======================================================
// ON: halos, tube, hot core (shape-aware)
// ======================================================
function NeonGlow({
  geom,
  uid,
  glowBlend,
  bgGlowPasses,
  glowWidthBoost,
  color,
  stroke,
  timing,
  lightsOn,
}: {
  geom: Geom
  uid: string
  glowBlend: BlendMode
  bgGlowPasses: Array<{ blur: number; opacity: number }>
  glowWidthBoost: number
  color: string
  stroke: number
  timing: { tOn: any; tOff: any }
  lightsOn: boolean
}) {
  return (
    <motion.g
      style={{ mixBlendMode: glowBlend as any }}
      animate={lightsOn ? 'on' : 'off'}
      initial={false}
      variants={{ on: { opacity: 1 }, off: { opacity: 0 } }}
      transition={lightsOn ? timing.tOn : timing.tOff}
    >
      {bgGlowPasses.map((p, i) => (
        <g key={i} style={{ opacity: p.opacity }}>
          <ShapeStroke
            geom={geom as any}
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
  )
}

function TubeStroke({
  geom,
  color,
  offGlassColor,
  offTubeAlpha,
  tubeOpacity,
  stroke,
  timing,
  lightsOn,
}: {
  geom: Geom
  color: string
  offGlassColor: string
  offTubeAlpha: number
  tubeOpacity: number
  stroke: number
  timing: { tOn: any; tColorOff: any }
  lightsOn: boolean
}) {
  return (
    <motion.g initial={false}>
      <ShapeStroke
        geom={geom as any}
        fill="none"
        stroke={lightsOn ? color : offGlassColor}
        strokeOpacity={lightsOn ? tubeOpacity : offTubeAlpha}
        strokeWidth={stroke}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </motion.g>
  )
}

function HotCore({
  geom,
  uid,
  coreW,
  coreOpacity,
  timing,
  lightsOn,
}: {
  geom: Geom
  uid: string
  coreW: number
  coreOpacity: number
  timing: { tOn: any; tOff: any }
  lightsOn: boolean
}) {
  return (
    <motion.g initial={false} transition={lightsOn ? timing.tOn : timing.tOff}>
      <ShapeStroke
        geom={geom as any}
        stroke="#fff"
        fill="none"
        strokeOpacity={lightsOn ? coreOpacity : 0}
        strokeWidth={lightsOn ? coreW : 0}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        filter={`url(#${uid}_coreBloom)`}
      />
    </motion.g>
  )
}

// ======================================================
// Mounts
// ======================================================
function Mounts({
  lightsOn,
  geom,
  stroke,
  uid,
  show,
  mountAngles,
  mountCount,
  mountStartDeg,
  color,
  linePadStart,
  linePadEnd,
  bandSpan,
  bandWrap,
  bandCorner,
}: {
  lightsOn: boolean
  geom: Geom
  stroke: number
  uid: string
  show: boolean
  mountAngles?: number[]
  mountCount: number
  mountStartDeg: number
  color: string
  linePadStart?: number
  linePadEnd?: number
  bandSpan: number
  bandWrap: number
  bandCorner: number
}) {
  if (!show) return null

  function rectPath(
    x: number,
    y: number,
    w: number,
    h: number,
    tl: number,
    tr: number,
    br: number,
    bl: number
  ) {
    tl = Math.max(0, Math.min(tl, w / 2, h / 2))
    tr = Math.max(0, Math.min(tr, w / 2, h / 2))
    br = Math.max(0, Math.min(br, w / 2, h / 2))
    bl = Math.max(0, Math.min(bl, w / 2, h / 2))

    return [
      `M ${x + tl} ${y}`,
      `H ${x + w - tr}`,
      tr ? `A ${tr} ${tr} 0 0 1 ${x + w} ${y + tr}` : `L ${x + w} ${y}`,
      `V ${y + h - br}`,
      br ? `A ${br} ${br} 0 0 1 ${x + w - br} ${y + h}` : `L ${x + w} ${y + h}`,
      `H ${x + bl}`,
      bl ? `A ${bl} ${bl} 0 0 1 ${x} ${y + h - bl}` : `L ${x} ${y + h}`,
      `V ${y + tl}`,
      tl ? `A ${tl} ${tl} 0 0 1 ${x + tl} ${y}` : `L ${x} ${y}`,
      `Z`,
    ].join(' ')
  }
  const drawBand = (x: number, y: number, angleDeg: number, key: string) => {
    const WAcross = Math.max(stroke + bandWrap * 2, stroke + 2)
    const W = WAcross
    const H = Math.max(3, bandSpan)

    const gap = 0
    const plateW = W / 2.3
    const plateH = H - 1.6
    const plateR = bandCorner

    const edgeLen = Math.max(2, stroke * 0.7)
    const underW = W * 1.75

    const Flange = ({ side }: { side: -1 | 1 }) => {
      const cx = side * (W / 2 + gap + plateW / 2)
      const x = cx - plateW / 2
      const y = -plateH / 2

      const hexPoints = (cx: number, cy: number, r: number) =>
        Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i + Math.PI / 6
          return `${Q(cx + r * Math.cos(a))},${Q(cy + r * Math.sin(a))}`
        }).join(' ')

      const boltHead = stroke * 0.25
      const bevelRadius = boltHead * 0.6

      const radii =
        side === -1
          ? { tl: plateR, tr: 0, br: 0, bl: plateR }
          : { tl: 0, tr: plateR, br: plateR, bl: 0 }

      const platePath = rectPath(x, y, plateW, plateH, radii.tl, radii.tr, radii.br, radii.bl)

      return (
        <g>
          <path d={platePath} fill={`url(#${uid}_faceAxial)`} />
          <path d={platePath} fill={`url(#${uid}_edgeVignette)`} />
          <path
            d={`M ${cx - plateW * 0.35} ${-plateH * 0.2} L ${cx + plateW * 0.35} ${-plateH * 0.2}`}
            stroke={`url(#${uid}_glint)`}
            strokeWidth={Math.max(0.6, plateH * 0.1)}
            strokeLinecap="round"
            opacity="0.45"
          />

          <g filter={`url(#${uid}_elev)`}>
            <polygon
              points={hexPoints(cx, 0, boltHead)}
              fill={`url(#${uid}_faceAxial)`}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth={boltHead * 0.1}
              vectorEffect="non-scaling-stroke"
            />

            <circle
              cx={cx}
              cy={0}
              r={bevelRadius}
              fill={`url(#${uid}_edgeVignette)`}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth={bevelRadius * 0.1}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      )
    }

    return (
      <g key={key} transform={`translate(${Q(x)} ${Q(y)}) rotate(${Q(angleDeg)})`}>
        <Flange side={-1} />
        <Flange side={+1} />

        <rect
          x={-underW / 2}
          y={-H / 2 - edgeLen}
          width={underW}
          height={edgeLen}
          fill={`url(#${uid}_underEdge)`}
          mask={`url(#${uid}_tubeMask)`}
          opacity={0.65}
          filter={`url(#${uid}_bandAO)`}
        />
        <rect
          x={-underW / 2}
          y={H / 2}
          width={underW}
          height={edgeLen}
          fill={`url(#${uid}_underEdgeFlip)`}
          mask={`url(#${uid}_tubeMask)`}
          opacity={0.65}
          filter={`url(#${uid}_bandAO)`}
        />

        <rect
          x={-W / 2}
          y={-H / 2}
          width={W}
          height={H}
          rx={bandCorner}
          ry={bandCorner}
          fill={`url(#${uid}_faceAxial)`}
        />
        <rect
          x={-W / 2}
          y={-H / 2}
          width={W}
          height={H}
          rx={bandCorner}
          ry={bandCorner}
          fill={`url(#${uid}_bandCross)`}
          opacity="0.9"
        />
        <rect
          x={-W / 2}
          y={-H / 2}
          width={W}
          height={H}
          rx={bandCorner}
          ry={bandCorner}
          fill={`url(#${uid}_edgeVignette)`}
          opacity="0.5"
        />
        <path
          d={`M ${-W * 0.35} ${-H * 0.25} L ${W * 0.35} ${-H * 0.25}`}
          stroke={`url(#${uid}_glint)`}
          strokeWidth={Math.max(0.6, H * 0.12)}
          strokeLinecap="round"
          opacity="0.55"
        />
        <motion.rect
          x={-W / 2}
          y={-H / 2}
          width={W}
          height={H}
          rx={bandCorner}
          ry={bandCorner}
          fill={color}
          initial={false}
          animate={{ opacity: lightsOn ? 0.12 : 0 }}
          transition={{ duration: 0.24 }}
          style={{ mixBlendMode: 'screen' as any }}
          filter={`url(#${uid}_tintSoft)`}
        />
      </g>
    )
  }

  if (geom.kind === 'circle') {
    const { cx, cy, r } = geom
    const angles = mountAngles?.length
      ? mountAngles
      : Array.from({ length: mountCount }, (_, i) => mountStartDeg + (i * 360) / mountCount)
    return (
      <g>
        {angles.map((a, i) => {
          const p = polarQ(a, r, cx, cy)
          const angle = a + 180 // tangent
          return drawBand(p.x, p.y, angle, `band_c_${i}`)
        })}
      </g>
    )
  }

  const { x1, y1, x2, y2, axis } = geom
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.max(1, Math.hypot(dx, dy))
  const padStartF = Math.max(0, Math.min(0.49, (linePadStart ?? 0) / len))
  const padEndF = Math.max(0, Math.min(0.49, (linePadEnd ?? linePadStart ?? 0) / len))
  const usable = Math.max(0, 1 - padStartF - padEndF)

  const baseTs = mountAngles?.length
    ? (mountAngles as number[])
    : mountCount <= 1
    ? [0.5]
    : Array.from({ length: mountCount }, (_, i) => i / (mountCount - 1))

  const positions = baseTs.map((t) => Q(padStartF + t * usable))
  const angle = axis === 'horizontal' ? 90 : 0

  return (
    <g>
      {positions.map((t, i) => {
        const x = Q(x1 + dx * t)
        const y = Q(y1 + dy * t)
        return drawBand(x, y, angle, `band_l_${i}`)
      })}
    </g>
  )
}

// ======================================================
// Main
// ======================================================
export function NeonLight({
  orientation = 'circle',
  stroke = 8,
  color = '#ec4fb4',
  lightsOn = true,

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
  offTintOpacity = 0.08,
  offShadowBlur = 1.5,
  offShadowOpacity = 0.7,
  offRimOpacity = 0.26,
  offInnerRimOpacity = 0.18,
  offGlassAlpha = 0.6,
  offNoiseOpacity = 0.05,
  offTubeAlpha = 0.25,
  offBackdrop = true,
  offBackdropBlur = 2,
  offBackdropSaturate = 1.12,
  offBackdropBrightness = 1.05,
  offBackdropOpacity = 0.35,

  offSpecAngle = 0,
  offSpecArc = 0,
  offSpecOpacity = 0,

  onMs = 260,
  offMs = 220,
  offColorMs = 0,
  easing = 'easeInOut',

  showMounts = true,
  mountAngles,
  mountCount = 6,
  mountStartDeg = 0,
  mountLinePadStart = 0,
  mountLinePadEnd = 0,
  mountBandSpan = 12,
  mountBandWrap,
  mountBandCorner,

  mountSteelTheme = 'dark',

  className,
  style,
  ...divProps
}: NeonLightProps) {
  const { ref, size } = useMeasure()
  const uid = useUid('gt_')

  const w = Q(size.w)
  const h = Q(size.h)
  const geom = React.useMemo(() => makeGeom(orientation, w, h, stroke), [orientation, w, h, stroke])

  const tOn = { duration: onMs / 1000, ease: easing as any }
  const tOff = { duration: offMs / 1000, ease: easing as any }
  const tColorOff = { duration: offColorMs / 1000, ease: easing as any }

  const coreW = Math.max(1.5, stroke * 0.55)
  const coreMargin = Q(Math.max(stroke, coreW) * 6)

  const bandSpan = mountBandSpan ?? Math.max(3, Math.min(8, stroke * 0.55)) // height along tube axis
  const bandWrap = mountBandWrap ?? Math.max(1, Math.min(4, stroke * 0.25)) // how far past tube each side
  const bandCorner = mountBandCorner ?? Math.min(bandSpan * 0.25, 1.6)

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none absolute inset-0 overflow-visible [isolation:isolate]',
        className
      )}
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
        suppressHydrationWarning
      >
        <Defs
          uid={uid}
          geom={geom}
          stroke={stroke}
          color={color}
          glowSpread={glowSpread}
          bgGlowPasses={bgGlowPasses}
          coreW={coreW}
          coreMargin={coreMargin}
          offShadowBlur={offShadowBlur}
          offGlassAlpha={offGlassAlpha}
          /** NEW */
          mountSteelTheme={mountSteelTheme}
        />

        <OffGlass
          uid={uid}
          geom={geom}
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
          w={w}
          h={h}
          timing={{ tOn, tOff }}
          lightsOn={lightsOn}
        />

        <NeonGlow
          geom={geom}
          uid={uid}
          glowBlend={glowBlend}
          bgGlowPasses={bgGlowPasses}
          glowWidthBoost={glowWidthBoost}
          color={color}
          stroke={stroke}
          timing={{ tOn, tOff }}
          lightsOn={lightsOn}
        />

        <TubeStroke
          geom={geom}
          color={color}
          offGlassColor={offGlassColor}
          offTubeAlpha={offTubeAlpha}
          tubeOpacity={tubeOpacity}
          stroke={stroke}
          timing={{ tOn, tColorOff }}
          lightsOn={lightsOn}
        />
        <HotCore
          geom={geom}
          uid={uid}
          coreW={coreW}
          coreOpacity={coreOpacity}
          timing={{ tOn, tOff }}
          lightsOn={lightsOn}
        />

        <Mounts
          lightsOn={lightsOn}
          geom={geom}
          stroke={stroke}
          uid={uid}
          show={showMounts}
          mountAngles={mountAngles}
          mountCount={mountCount}
          mountStartDeg={mountStartDeg}
          color={color}
          linePadStart={mountLinePadStart}
          linePadEnd={mountLinePadEnd}
          bandSpan={bandSpan}
          bandWrap={bandWrap}
          bandCorner={bandCorner}
        />
      </motion.svg>
    </div>
  )
}
