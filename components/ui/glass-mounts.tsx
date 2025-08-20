'use client'

import * as React from 'react'
import { motion } from 'motion/react'

/** Reuse this in both components */
export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Shape = 'rect' | 'circle'

/** Minimal geom signature compatible with NeonLight's */
export type TubeGeom =
  | { kind: 'circle'; cx: number; cy: number; r: number; C?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; axis: 'horizontal' | 'vertical' }

const q = (n: number) => Math.round(n * 1000) / 1000
const Q = (n: number) => (Object.is(n, -0) ? 0 : q(n))
const crisp = (n: number) => Math.floor(n) + 0.5

/* -----------------------------
   Core single mount (exact look)
------------------------------*/
function DrawMount({
  uid,
  x,
  y,
  r,
  neonTint,
  lightsOn,
  shineOpacity,
}: {
  uid: string
  x: number
  y: number
  r: number
  neonTint?: string
  lightsOn?: boolean
  shineOpacity?: number
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
    <g>
      {/* contact AO on glass */}
      <circle
        cx={x}
        cy={y}
        r={headR + washerW * 0.6}
        fill="#000"
        opacity="0.28"
        filter={`url(#${uid}_contactAO)`}
      />

      {/* raised hardware (washer ring + cap) */}
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

      {/* optional neon "kiss" when used with NeonLight */}
      {neonTint && (
        <motion.circle
          cx={x}
          cy={y}
          r={Q(washerR * 1.08)}
          fill={neonTint}
          initial={false}
          animate={{ opacity: lightsOn ? (shineOpacity ?? 0.35) : 0 }}
          transition={{ duration: 0.26 }}
          style={{ mixBlendMode: 'screen' as any }}
          filter={`url(#${uid}_tintSoft)`}
        />
      )}
    </g>
  )
}

/* -----------------------------
   Frame-mode placement (Glass card)
------------------------------*/
function FrameCircle({
  w,
  h,
  uid,
  radius,
  circleCount,
  circleAngles,
  circleStartDeg = 0,
  circleInset,
}: {
  w: number
  h: number
  uid: string
  radius: number
  circleCount: number
  circleAngles?: number[]
  circleStartDeg?: number
  circleInset?: number
}) {
  const cx = w / 2,
    cy = h / 2
  const Rmax = Math.max(0, Math.min(w, h) / 2) - 1

  const washerW = Math.max(1.6, radius * 0.85)
  const autoInset = radius + washerW * 0.5 + 2
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
        return <DrawMount key={`c${i}`} uid={uid} x={x} y={y} r={radius} />
      })}
    </g>
  )
}

function FrameRect({
  w,
  h,
  uid,
  radius,
  rectMode = 'corners',
  cornerInset = 14,
  rectSides = ['left', 'right'],
  rectStops = [0.24, 0.76],
}: {
  w: number
  h: number
  uid: string
  radius: number
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

  return (
    <g>
      {pts.map(({ x, y, key }) => (
        <DrawMount key={key} uid={uid} x={x} y={y} r={radius} />
      ))}
    </g>
  )
}

/* -----------------------------
   Tube-mode placement (Neon)
------------------------------*/
function TubeMounts({
  uid,
  geom,
  headRadius,
  mountAngles,
  mountCount,
  mountStartDeg,
  linePadStart,
  linePadEnd,
  neonTint,
  lightsOn,
  shineOpacity,
}: {
  uid: string
  geom: TubeGeom
  headRadius: number
  mountAngles?: number[]
  mountCount?: number
  mountStartDeg?: number
  linePadStart?: number
  linePadEnd?: number
  neonTint?: string
  lightsOn?: boolean
  shineOpacity?: number
}) {
  // circle tube: place by degrees
  if (geom.kind === 'circle') {
    const { cx, cy, r } = geom
    const count = Math.max(1, mountCount ?? 6)
    const base = mountAngles?.length
      ? mountAngles
      : Array.from({ length: count }, (_, i) => i * (360 / count))
    const degs = (mountStartDeg != null ? base.map((d) => d + mountStartDeg) : base)
    return (
      <g>
        {degs.map((a, i) => {
          const t = (a * Math.PI) / 180
          const x = Q(cx + r * Math.cos(t))
          const y = Q(cy + r * Math.sin(t))
          return (
            <DrawMount
              key={`mc_${i}`}
              uid={uid}
              x={x}
              y={y}
              r={headRadius}
              neonTint={neonTint}
              lightsOn={lightsOn}
              shineOpacity={shineOpacity}
            />
          )
        })}
      </g>
    )
  }

  // line tube: distribute along the span (0..1), honor paddings
  const { x1, y1, x2, y2 } = geom
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.max(1, Math.hypot(dx, dy))

  const toFrac = (n?: number) =>
    n == null ? 0 : n <= 0.5 ? Math.max(0, n) : Math.min(0.49, n / len)

  const padStartF = toFrac(linePadStart)
  const padEndF = toFrac(linePadEnd ?? linePadStart)
  const usable = Math.max(0, 1 - padStartF - padEndF)

  const baseTs =
    mountAngles && mountAngles.every((v) => v >= 0 && v <= 1)
      ? mountAngles
      : (mountCount ?? 6) <= 1
      ? [0.5]
      : Array.from({ length: mountCount ?? 6 }, (_, i) => i / ((mountCount ?? 6) - 1))

  const positions = baseTs.map((t) => Q(padStartF + t * usable))

  return (
    <g>
      {positions.map((t, i) => {
        const x = Q(x1 + dx * t)
        const y = Q(y1 + dy * t)
        return (
          <DrawMount
            key={`ml_${i}`}
            uid={uid}
            x={x}
            y={y}
            r={headRadius}
            neonTint={neonTint}
            lightsOn={lightsOn}
            shineOpacity={shineOpacity}
          />
        )
      })}
    </g>
  )
}

/* -----------------------------
   Public component
------------------------------*/
type FrameModeProps = {
  mode: 'frame'
  uid: string
  w: number
  h: number
  shape: Shape
  radius?: number
  // circle frame
  circleCount?: number
  circleAngles?: number[]
  circleStartDeg?: number
  circleInset?: number
  // rect frame
  rectMode?: 'corners' | 'sides'
  cornerInset?: number
  rectSides?: Side[]
  rectStops?: number[]
}

type TubeModeProps = {
  mode: 'tube'
  uid: string
  geom: TubeGeom
  headRadius?: number
  mountAngles?: number[]
  mountCount?: number
  mountStartDeg?: number
  linePadStart?: number
  linePadEnd?: number
  neonTint?: string
  lightsOn?: boolean
  shineOpacity?: number
}

export type GlassHardwareMountsProps = (FrameModeProps | TubeModeProps) & {
  show?: boolean
}

export function GlassHardwareMounts(props: GlassHardwareMountsProps) {
  if (props.show === false) return null

  if (props.mode === 'frame') {
    const {
      uid,
      w,
      h,
      shape,
      radius = 3,
      circleCount = 6,
      circleAngles,
      circleStartDeg = 60,
      circleInset = 3,
      rectMode = 'corners',
      cornerInset = 20,
      rectSides = ['left', 'right'],
      rectStops = [0.24, 0.76],
    } = props

    return shape === 'circle' ? (
      <FrameCircle
        w={w}
        h={h}
        uid={uid}
        radius={radius}
        circleCount={circleCount}
        circleAngles={circleAngles}
        circleStartDeg={circleStartDeg}
        circleInset={circleInset}
      />
    ) : (
      <FrameRect
        w={w}
        h={h}
        uid={uid}
        radius={radius}
        rectMode={rectMode}
        cornerInset={cornerInset}
        rectSides={rectSides}
        rectStops={rectStops}
      />
    )
  }

  const {
    uid,
    geom,
    headRadius = 6,
    mountAngles,
    mountCount = 6,
    mountStartDeg = 0,
    linePadStart = 0,
    linePadEnd = 0,
    neonTint,
    lightsOn,
    shineOpacity = 0.35,
  } = props

  return (
    <TubeMounts
      uid={uid}
      geom={geom}
      headRadius={headRadius}
      mountAngles={mountAngles}
      mountCount={mountCount}
      mountStartDeg={mountStartDeg}
      linePadStart={linePadStart}
      linePadEnd={linePadEnd}
      neonTint={neonTint}
      lightsOn={lightsOn}
      shineOpacity={shineOpacity}
    />
  )
}
