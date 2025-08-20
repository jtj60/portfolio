'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/* ---------------------------------------------
   helpers
----------------------------------------------*/
function useMeasure() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      if (!e) return

      const bb = Array.isArray(e.borderBoxSize) ? e.borderBoxSize[0] : e.borderBoxSize
      if (bb && typeof bb.inlineSize === 'number') {
        setSize({
          w: Math.max(1, Math.round(bb.inlineSize)),
          h: Math.max(1, Math.round(bb.blockSize)),
        })
        return
      }

      const rect = el.getBoundingClientRect()
      setSize({
        w: Math.max(1, Math.round(rect.width)),
        h: Math.max(1, Math.round(rect.height)),
      })
    })

    ro.observe(el, { box: 'border-box' })
    return () => ro.disconnect()
  }, [])

  return { ref, size }
}

function useUid(prefix = 'gm_') {
  const raw = React.useId()
  return React.useMemo(() => `${prefix}${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`, [prefix, raw])
}

type Side = 'top' | 'right' | 'bottom' | 'left'
type Shape = 'auto' | 'rect' | 'circle'

type GlassMountCardProps = React.HTMLAttributes<HTMLDivElement> & {
  shape?: Shape

  // Tint/Backdrop
  showTint?: boolean
  tint?: string
  tintBlend?: React.CSSProperties['mixBlendMode']
  blur?: number
  saturate?: number
  brightness?: number
  tintClassName?: string

  elevation?: number // controls drop shadow intensity
  shadowBlend?: React.CSSProperties['mixBlendMode']
  shadowColor?: string

  // Rim
  showRim?: boolean
  rimWidth?: number
  rimColor?: string
  borderOpacity?: number
  rimBoxShadow?: string
  rimClassName?: string

  // Specular
  showSpec?: boolean
  specGradient?: string
  specClassName?: string

  // mounts config
  showMounts?: boolean
  mountRadius?: number

  rectMode?: 'corners' | 'sides'
  cornerInset?: number
  rectSides?: Side[]
  rectStops?: number[]

  circleCount?: number
  circleAngles?: number[]
  circleStartDeg?: number
  circleInset?: number

  steelTheme?: 'bright' | 'dark'
}

export function GlassMountCard({
  shape = 'auto',

  showTint = true,
  tint = 'rgba(255 255 255 / 0.03)',
  tintBlend,
  blur = 10,
  saturate = 1.05,
  brightness = 1.09,
  tintClassName,

  elevation = 0.35,
  shadowBlend = 'multiply',
  shadowColor = '0 0 0',

  showRim = true,
  rimWidth = 1,
  rimColor,
  borderOpacity = 0.12,
  rimBoxShadow,
  rimClassName,

  showSpec = true,
  specGradient = 'radial-gradient(120% 120% at 50% 0%, rgba(255 255 255 / 0.10), rgba(255 255 255 / 0) 55%)',
  specClassName,

  showMounts = true,
  mountRadius = 3,

  rectMode = 'corners',
  cornerInset = 20,
  rectSides = ['left', 'right'],
  rectStops = [0.24, 0.76],

  circleCount = 6,
  circleAngles,
  circleStartDeg = 60,
  circleInset = 3,

  steelTheme = 'dark',

  className,
  children,
  style,
  ...rest
}: GlassMountCardProps) {
  const { ref, size } = useMeasure()
  const uid = useUid()
  const w = size.w,
    h = size.h

  const computedShape: Shape = React.useMemo(() => {
    if (shape !== 'auto') return shape
    if (!ref.current || w < 2 || h < 2) return 'rect'
    const br = parseFloat(getComputedStyle(ref.current).borderTopLeftRadius) || 0
    return br >= Math.min(w, h) * 0.48 ? 'circle' : 'rect'
  }, [shape, w, h])

  const r = mountRadius
  const steel =
    steelTheme === 'dark'
      ? { hi: '#b8c0c7', mid: '#80878e', lo: '#3d4349' }
      : { hi: '#d7dce1', mid: '#9aa1a8', lo: '#5a6168' }

  const styleWithVars = { ['--glass-tint' as any]: tint, ...style }

  const computedRimShadow =
    rimBoxShadow ?? `inset 0 0 0 ${rimWidth}px ${rimColor ?? `rgba(255,255,255,${borderOpacity})`}`

  const E = Math.max(0, elevation)

  const shadowStack = [
    `0 ${Math.round(2 * E)}px ${Math.round(6 * E)}px rgba(${shadowColor} / 0.35)`,
    `0 ${Math.round(12 * E)}px ${Math.round(24 * E)}px rgba(${shadowColor} / 0.40)`,
    `0 ${Math.round(32 * E)}px ${Math.round(60 * E)}px rgba(${shadowColor} / 0.42)`,
  ].join(', ')

  return (
    <div
      ref={ref}
      className={cn('relative isolate rounded-xl shadow-2xl', className)}
      style={styleWithVars}
      {...rest}
    >
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none" aria-hidden>
        {showTint && (
          <div
            className={cn('absolute inset-0 rounded-[inherit]', tintClassName)}
            style={{
              background: 'var(--glass-tint, rgba(255 255 255 / 0.03))',
              mixBlendMode: tintBlend,
              boxShadow: shadowStack,
              backdropFilter: `blur(${blur}px) saturate(${saturate}) brightness(${brightness})`,
              WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}) brightness(${brightness})`,
            }}
          />
        )}

        {showRim && (
          <div
            className={cn('absolute inset-0 rounded-[inherit]', rimClassName)}
            style={{ boxShadow: computedRimShadow }}
          />
        )}

        {showSpec && (
          <div
            className={cn('absolute inset-0 rounded-[inherit]', specClassName)}
            style={{ background: specGradient }}
          />
        )}
      </div>

      <div className="relative w-full h-full">{children}</div>

      {showMounts && w > 0 && h > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* diagonal brushed steel for the CAP face */}
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

            {/* subtle darkening toward the edge to imply bevel/chamfer (no inner ring) */}
            <radialGradient id={`${uid}_edgeVignette`} cx="50%" cy="50%" r="60%">
              <stop offset="65%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
            </radialGradient>

            {/* small glint arc along the top-left edge */}
            <linearGradient id={`${uid}_glint`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.65" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* contact shadow on glass (AO) */}
            <filter id={`${uid}_contactAO`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feOffset dx="0" dy="0.6" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.45" />
              </feComponentTransfer>
            </filter>

            {/* raised drop shadow for hardware */}
            <filter id={`${uid}_elev`} x="-70%" y="-70%" width="240%" height="240%">
              <feDropShadow
                dx="0"
                dy="1.0"
                stdDeviation="1.2"
                floodColor={`rgb(${shadowColor})`}
                floodOpacity="0.32"
              />
              <feDropShadow
                dx="0"
                dy="3.6"
                stdDeviation="2.8"
                floodColor={`rgb(${shadowColor})`}
                floodOpacity="0.5"
              />
            </filter>
          </defs>

          {computedShape === 'circle'
            ? renderCircleMounts({
                w,
                h,
                r,
                uid,
                circleCount,
                circleAngles,
                circleStartDeg,
                circleInset,
              })
            : renderRectMounts({
                w,
                h,
                r,
                uid,
                rectMode,
                cornerInset,
                rectSides,
                rectStops,
              })}
        </svg>
      )}
    </div>
  )
}

const crisp = (n: number) => Math.floor(n) + 0.5

/* ---------------------------------------------
   Mount renderers (updated drawing)
----------------------------------------------*/
function renderCircleMounts({
  w,
  h,
  r,
  uid,
  circleCount,
  circleAngles,
  circleStartDeg = 0,
  circleInset,
}: {
  w: number
  h: number
  r: number
  uid: string
  circleCount: number
  circleAngles?: number[]
  circleStartDeg?: number
  circleInset?: number
}) {
  const cx = w / 2,
    cy = h / 2
  const Rmax = Math.max(0, Math.min(w, h) / 2) - 1

  const washerW = Math.max(1.6, r * 0.85)
  const autoInset = r + washerW * 0.5 + 2
  const inset = Math.max(0, circleInset ?? autoInset)

  const R = Math.max(0, Rmax - inset)

  const base = circleAngles?.length
    ? circleAngles
    : Array.from({ length: circleCount }, (_, i) => (i * 360) / circleCount)

  const degs = base.map((d) => d + circleStartDeg)

  return (
    <g>
      {degs.map((a, i) => {
        const t = (a * Math.PI) / 180
        const x = Math.floor(cx + R * Math.cos(t)) + 0.5
        const y = Math.floor(cy + R * Math.sin(t)) + 0.5
        return drawMount({ x, y, r, uid, key: `c${i}` })
      })}
    </g>
  )
}

function renderRectMounts({
  w,
  h,
  r,
  uid,
  rectMode = 'corners',
  cornerInset = 14,
  rectSides = ['left', 'right'],
  rectStops = [0.24, 0.76],
}: {
  w: number
  h: number
  r: number
  uid: string
  rectMode?: 'corners' | 'sides'
  cornerInset?: number
  rectSides?: Side[]
  rectStops?: number[]
}) {
  const pts: Array<{ x: number; y: number; key: string }> = []

  if (rectMode === 'corners') {
    const s = cornerInset
    pts.push(
      { x: crisp(s), y: crisp(s), key: 'tl' },
      { x: crisp(w - s), y: crisp(s), key: 'tr' },
      { x: crisp(w - s), y: crisp(h - s), key: 'br' },
      { x: crisp(s), y: crisp(h - s), key: 'bl' }
    )
  } else {
    const clamp01 = (t: number) => Math.max(0, Math.min(1, t))
    const edgePoint = (side: Side, t: number) =>
      side === 'left'
        ? { x: 0, y: t * h }
        : side === 'right'
        ? { x: w, y: t * h }
        : side === 'top'
        ? { x: t * w, y: 0 }
        : { x: t * w, y: h }

    rectSides.forEach((side) => {
      rectStops.forEach((t, ti) => {
        const p = edgePoint(side, clamp01(t))
        pts.push({ x: Math.round(p.x), y: Math.round(p.y), key: `${side}_${ti}` })
      })
    })
  }

  return <g>{pts.map(({ x, y, key }) => drawMount({ x, y, r, uid, key }))}</g>
}

/* ---------------------------------------------
   Single mount drawing (washer + head + shadows)
----------------------------------------------*/
function drawMount({
  x,
  y,
  r,
  uid,
  key,
}: {
  x: number
  y: number
  r: number
  uid: string
  key: string
}) {
  const headR = r
  const washerW = Math.max(1.6, r * 0.85)
  const washerR = headR + washerW * 0.5 + 0.8

  const glintR = headR - 0.6
  const a1 = (-130 * Math.PI) / 180
  const a2 = (-40 * Math.PI) / 180
  const gx1 = x + glintR * Math.cos(a1)
  const gy1 = y + glintR * Math.sin(a1)
  const gx2 = x + glintR * Math.cos(a2)
  const gy2 = y + glintR * Math.sin(a2)
  const large = Math.abs(a2 - a1) > Math.PI ? 1 : 0

  return (
    <g key={key}>
      <circle
        cx={x}
        cy={y}
        r={headR + washerW * 0.6}
        fill="#000"
        opacity="0.28"
        filter={`url(#${uid}_contactAO)`}
      />

      <g filter={`url(#${uid}_elev)`}>
        <circle
          cx={x}
          cy={y}
          r={washerR}
          fill="none"
          stroke={`url(#${uid}_washerSteel)`}
          strokeWidth={washerW}
          strokeLinecap="round"
        />

        <circle cx={x} cy={y} r={headR} fill={`url(#${uid}_faceAxial)`} />
        <circle cx={x} cy={y} r={headR} fill={`url(#${uid}_edgeVignette)`} />

        <path
          d={`M ${gx1} ${gy1} A ${glintR} ${glintR} 0 ${large} 1 ${gx2} ${gy2}`}
          stroke={`url(#${uid}_glint)`}
          strokeWidth={Math.max(0.8, headR * 0.18)}
          strokeLinecap="round"
          fill="none"
          opacity={0.75}
        />
      </g>
    </g>
  )
}
