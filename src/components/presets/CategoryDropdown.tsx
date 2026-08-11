import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Layers,
  Cpu,
  Zap,
  Sparkles,
  Gem,
  Minus,
  Droplets,
  ChevronDown,
  Check } from
'lucide-react';
import { ALL_CATEGORIES } from '../../data/presets';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  [ALL_CATEGORIES]: Layers,
  Cyberpunk: Cpu,
  Neon: Zap,
  Aurora: Sparkles,
  Luxury: Gem,
  Minimal: Minus,
  Glass: Droplets
};

interface CategoryDropdownProps {
  categories: string[];
  value: string;
  counts: Record<string, number>;
  onChange: (category: string) => void;
}

export function CategoryDropdown({
  categories,
  value,
  counts,
  onChange
}: CategoryDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ActiveIcon = CATEGORY_ICONS[value] ?? Layers;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full h-9 px-3 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] flex items-center justify-between text-xs text-white/80 transition-colors hover:border-[rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
        
        <span className="flex items-center gap-2 min-w-0">
          <ActiveIcon
            size={14}
            strokeWidth={1.5}
            className="text-white/50 shrink-0"
            aria-hidden="true" />
          
          <span className="truncate">{value}</span>
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        
      </button>
      <AnimatePresence>
        {open &&
        <motion.div
          role="listbox"
          aria-label="Preset categories"
          initial={{
            opacity: 0,
            y: -4,
            scale: 0.98
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -4,
            scale: 0.98
          }}
          transition={{
            duration: 0.16,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute z-30 mt-1.5 w-full rounded-xl bg-[rgba(28,28,32,0.96)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] p-1.5 max-h-72 overflow-y-auto scrollbar-thin">
          
            {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category] ?? Layers;
            const isActive = category === value;
            return (
              <button
                key={category}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(category);
                  setOpen(false);
                }}
                className={`w-full h-8 px-2 rounded-lg flex items-center gap-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}>
                
                  <Icon
                  size={13}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={isActive ? 'text-white/80' : 'text-white/40'} />
                
                  <span className="truncate flex-1 text-left">{category}</span>
                  <span className="font-mono text-[9px] text-white/30">
                    {counts[category] ?? 0}
                  </span>
                  {isActive &&
                <Check
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-[var(--accent-light)]" />

                }
                </button>);

          })}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}