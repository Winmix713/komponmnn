import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
type SwitchSize = 'sm' | 'md' | 'lg';
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  ariaLabel?: string;
}
const SIZE_MAP: Record<
  SwitchSize,
  {
    track: string;
    knob: string;
    travel: number;
    check: number;
  }> =
{
  sm: {
    track: 'w-7 h-4',
    knob: 'w-3 h-3',
    travel: 12,
    check: 8
  },
  md: {
    track: 'w-9 h-5',
    knob: 'w-4 h-4',
    travel: 16,
    check: 10
  },
  lg: {
    track: 'w-11 h-6',
    knob: 'w-5 h-5',
    travel: 20,
    check: 12
  }
};
export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  ariaLabel
}: ToggleSwitchProps) {
  const dims = SIZE_MAP[size];
  return (
    <div className="flex items-center justify-end w-full">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
        'relative flex items-center rounded-full border transition-colors duration-300',
        dims.track,
        checked ?
        'bg-[var(--accent)] border-[var(--accent)]' :
        'bg-[rgba(0,0,0,0.3)] border-[var(--border-subtle)]',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent'].
        join(' ')}>
        
        <motion.div
          className={`absolute left-[2px] ${dims.knob} bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] flex items-center justify-center`}
          animate={{
            x: checked ? dims.travel : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}>
          
          <AnimatePresence mode="wait">
            {checked &&
            <motion.svg
              key="check"
              width={dims.check}
              height={dims.check}
              viewBox="0 0 10 10"
              fill="none"
              initial={{
                opacity: 0,
                rotate: -45,
                filter: 'blur(2px)'
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                filter: 'blur(0px)'
              }}
              exit={{
                opacity: 0,
                rotate: 45,
                filter: 'blur(2px)'
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut'
              }}
              aria-hidden="true">
              
                <motion.path
                d="M2 5L4 7L8 3"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{
                  pathLength: 0
                }}
                animate={{
                  pathLength: 1
                }}
                exit={{
                  pathLength: 0
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut'
                }} />
              
              </motion.svg>
            }
          </AnimatePresence>
        </motion.div>
      </button>
    </div>);

}