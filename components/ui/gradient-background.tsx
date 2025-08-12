'use client';
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  intensity?: number;
  blur?: number;
  speed?: number;
  colors?: string[];
  count?: number;
  seed?: number;
  className?: string;
  overscanPercent?: number; // travel beyond edges in container %
};

export default function SoftGradientBackground({
  children,
  intensity = 0.7,
  blur = 90,
  speed = 1,
  colors = ['#ffdfd3', '#fde4a9', '#d7e0ff', '#c9fff5'],
  count = 6,
  seed,
  className,
  overscanPercent = 10,
}: Props) {
  const rand = useMemo(() => {
    let t = (seed ?? 1337) >>> 0 || 1;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }, [seed]);

  const blobs = useMemo(() => {
    const out: any[] = [];
    const ov = overscanPercent;
    for (let i = 0; i < count; i++) {
      const startX = -ov + rand() * (100 + 2 * ov);
      const startY = -ov + rand() * (100 + 2 * ov);
      let endX = -ov + rand() * (100 + 2 * ov);
      let endY = -ov + rand() * (100 + 2 * ov);

      const minTravel = 25;
      if (Math.abs(endX - startX) + Math.abs(endY - startY) < minTravel) {
        endX = Math.min(100 + ov, Math.max(-ov, startX + (rand() < 0.5 ? -minTravel : minTravel)));
        endY = Math.min(100 + ov, Math.max(-ov, startY + (rand() < 0.5 ? -minTravel : minTravel)));
      }

      const size = 35 + rand() * 35; // % of container width
      const color = colors[i % colors.length];
      const scaleA = 0.9 + rand() * 0.25;
      const scaleB = 1.0 + rand() * 0.3;
      const rotA = (rand() * 16 - 8).toFixed(2);
      const rotB = (rand() * 24 - 12).toFixed(2);
      const baseDur = 32 + rand() * 36;
      const duration = baseDur / Math.max(0.1, speed);
      const delay = -(rand() * duration);
      const easing = rand() < 0.33 ? 'ease-in-out' : rand() < 0.5 ? 'ease' : 'cubic-bezier(.6,.1,.4,1)';
      const key = `blob_${i}_${Math.floor(rand() * 1e6)}`;

      out.push({ key, color, size, startX, startY, endX, endY, scaleA, scaleB, rotA, rotB, duration, delay, easing });
    }
    return out;
  }, [count, colors, overscanPercent, rand, speed]);

  return (
    <div className={cn('relative', className)}>
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{ opacity: Math.min(Math.max(intensity, 0), 1), filter: `blur(${blur}px)` }}
      >
        <style jsx>{`
          ${blobs
            .map(
              (b) => `
              @keyframes ${b.key} {
                0% {
                  top: ${b.startY}%;
                  left: ${b.startX}%;
                  transform: translate(-50%, -50%) scale(${b.scaleA}) rotate(${b.rotA}deg);
                }
                50% {
                  top: ${(b.startY + b.endY) / 2}%;
                  left: ${(b.startX + b.endX) / 2}%;
                  transform: translate(-50%, -50%) scale(${(b.scaleA + b.scaleB) / 2}) rotate(${((+b.rotA) + (+b.rotB)) / 2}deg);
                }
                100% {
                  top: ${b.endY}%;
                  left: ${b.endX}%;
                  transform: translate(-50%, -50%) scale(${b.scaleB}) rotate(${b.rotB}deg);
                }
              }
            `
            )
            .join('\n')}
          @media (prefers-reduced-motion: reduce) {
            ${blobs.map((b) => `.${b.key}{animation:none!important;}`).join('\n')}
          }
        `}</style>

        {blobs.map((b) => (
          <div
            key={b.key}
            className={cn('absolute rounded-full will-change-transform select-none', b.key)}
            style={{
              width: `${b.size}%`,
              aspectRatio: '1 / 1',
              background: `radial-gradient(50% 50% at 50% 50%, ${b.color} 0%, transparent 60%)`,
              animation: `${b.key} ${b.duration}s ${b.easing} ${b.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-0">{children}</div>
    </div>
  );
}