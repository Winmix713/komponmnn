import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Link2Off } from 'lucide-react';
interface LockButtonProps {
  isLocked: boolean;
  onChange: (locked: boolean) => void;
  disabled?: boolean;
  size?: number;
}
// Hoisted out of the component — defined once, not on every render
const ICON_VARIANTS = {
  initial: {
    scale: 0.6,
    filter: 'blur(6px)',
    opacity: 0
  },
  animate: {
    scale: 1,
    filter: 'blur(0px)',
    opacity: 1
  },
  exit: {
    scale: 0.6,
    filter: 'blur(6px)',
    opacity: 0
  }
};
const ICON_TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20
};
export function LockButton({
  isLocked,
  onChange,
  disabled = false,
  size = 28
}: LockButtonProps) {
  const Icon = isLocked ? Link : Link2Off;
  const label = isLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio';
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!isLocked)}
      disabled={disabled}
      aria-pressed={isLocked}
      aria-label={label}
      title={label}
      style={{
        width: size,
        height: size
      }}
      className={[
      'flex items-center justify-center rounded-[var(--r-sm)] border transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
      isLocked ?
      'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.1)] text-[var(--text-hi)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]' :
      'bg-transparent border-transparent text-[var(--text-lo)] hover:text-[var(--text-mid)] hover:bg-[rgba(255,255,255,0.03)]',
      disabled && 'cursor-not-allowed opacity-50'].

      filter(Boolean).
      join(' ')}>
      
      <div className="relative w-3.5 h-3.5 flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={isLocked ? 'locked' : 'unlocked'}
            variants={ICON_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={ICON_TRANSITION}
            className="absolute">
            
            <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </div>
    </button>);

}