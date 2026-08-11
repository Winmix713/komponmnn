import React, { useCallback, useEffect, useState, useRef, memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  unit?: string;
  step?: number;
  disabled?: boolean;
}
export function Stepper({
  value,
  min,
  max,
  onChange,
  unit = 'px',
  step = 1,
  disabled = false
}: StepperProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isError, setIsError] = useState(false);
  const controls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);
  // Race-safe shake: every shake call gets a unique token. Only the most
  // recent shake clears isError, so back-to-back clamp events don't desync.
  const shakeTokenRef = useRef(0);
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);
  const triggerShake = useCallback(() => {
    const token = ++shakeTokenRef.current;
    setIsError(true);
    controls.
    start({
      x: [0, -6, 6, -6, 6, 0],
      transition: {
        duration: 0.4,
        ease: [0.36, 0.07, 0.19, 0.97]
      }
    }).
    then(() => {
      // Only clear if this is still the latest shake
      if (shakeTokenRef.current === token) setIsError(false);
    });
  }, [controls]);
  const handleCommit = useCallback(
    (newVal: number) => {
      if (newVal < min || newVal > max) {
        triggerShake();
        const clamped = Math.max(min, Math.min(max, newVal));
        onChange(clamped);
        setInputValue(clamped.toString());
      } else {
        onChange(newVal);
        setInputValue(newVal.toString());
      }
    },
    [min, max, onChange, triggerShake]
  );
  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) {
      setInputValue(value.toString());
    } else {
      handleCommit(parsed);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleCommit(value + step);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleCommit(value - step);
    }
  };
  // Guard against divide-by-zero when min === max
  const range = max - min;
  const percentage = range > 0 ? (value - min) / range * 100 : 0;
  const decrementLabel = `Decrease by ${step}`;
  const incrementLabel = `Increase by ${step}`;
  return (
    <div className="flex items-center gap-2 w-full">
      <motion.div
        animate={controls}
        className={[
        'flex-1 flex items-center h-7 bg-[rgba(0,0,0,0.2)] rounded-[var(--r-sm)]',
        'border border-[var(--border-subtle)] relative overflow-hidden',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]',
        disabled && 'opacity-50 pointer-events-none'].

        filter(Boolean).
        join(' ')}>
        
        <div
          aria-hidden="true"
          className={`absolute left-0 top-0 bottom-0 opacity-20 transition-colors duration-200 ${isError ? 'bg-red-500' : 'bg-[var(--violet)]'}`}
          style={{
            width: `${percentage}%`
          }} />
        

        <button
          type="button"
          aria-label={decrementLabel}
          disabled={disabled || value <= min}
          onClick={() => handleCommit(value - step)}
          className="w-7 h-full flex items-center justify-center text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:hover:bg-transparent transition-colors z-10">
          
          <span aria-hidden="true">−</span>
        </button>

        <div
          className="w-px h-3.5 bg-[var(--border-mid)] z-10"
          aria-hidden="true" />
        

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-label={`Value in ${unit}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="flex-1 min-w-[44px] w-full h-full bg-transparent text-center text-[12px] font-mono text-[var(--text-hi)] outline-none z-10 px-1" />
        

        <div
          className="w-px h-3.5 bg-[var(--border-mid)] z-10"
          aria-hidden="true" />
        

        <button
          type="button"
          aria-label={incrementLabel}
          disabled={disabled || value >= max}
          onClick={() => handleCommit(value + step)}
          className="w-7 h-full flex items-center justify-center text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:hover:bg-transparent transition-colors z-10">
          
          <span aria-hidden="true">+</span>
        </button>
      </motion.div>

      <UnitBadge unit={unit} />
    </div>);

}
// Memoized so unit pill doesn't re-render on every keystroke
const UnitBadge = memo(function UnitBadge({ unit }: {unit: string;}) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center h-6 px-1.5 bg-[var(--bg-badge)] rounded-[var(--r-sm)] border border-[var(--border-subtle)] text-[10px] font-medium text-[var(--text-lo)] uppercase tracking-wider">
      
      {unit}
    </div>);

});