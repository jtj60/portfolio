'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect } from 'react';
import { cn } from '@/lib/utils'

export interface MenuIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isOpen: boolean;
  strokeWidth?: number;
}

const lineVariants: Variants = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1,
  },
  animate: (custom: number) => ({
    rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
    y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
    opacity: custom === 2 ? 0 : 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  }),
};

const MenuIcon = forwardRef<HTMLDivElement, MenuIconProps>(
  ({ isOpen, className, size = 28, strokeWidth, ...props }, ref) => {
    const controls = useAnimation();

    // Call animation immediately when prop changes
    useEffect(() => {
      controls.start(isOpen ? 'animate' : 'normal');
    }, [isOpen]);

    return (
      <div
        ref={ref}
        className={cn(
          `cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center`,
          className
        )}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth || "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.line
            x1="4"
            y1="6"
            x2="20"
            y2="6"
            initial="normal"
            variants={lineVariants}
            animate={controls}
            custom={1}
            className="will-change-transform"
          />
          <motion.line
            x1="4"
            y1="12"
            x2="20"
            y2="12"
            initial="normal"
            variants={lineVariants}
            animate={controls}
            custom={2}
            className="will-change-transform"
          />
          <motion.line
            x1="4"
            y1="18"
            x2="20"
            y2="18"
            initial="normal"
            variants={lineVariants}
            animate={controls}
            custom={3}
            className="will-change-transform"
          />
        </svg>
      </div>
    );
  }
);

MenuIcon.displayName = 'MenuIcon';

export { MenuIcon };
