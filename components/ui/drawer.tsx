import { createPortal } from 'react-dom'
import { FC, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

type Anchor = 'left' | 'right'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  children: ReactNode
  anchor?: Anchor
}

const Drawer: FC<Props> = ({ open, setOpen, children, anchor = 'right' }) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-white/20 dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className={cn("drawer-layout backdrop-blur-xs", anchor === 'right' ? 'right-0' : 'left-0')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body as HTMLElement
  )
}

export default Drawer
