import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Wand2, Check } from 'lucide-react';
import type { ColorPreset } from '../../types/presets';
import { PresetThumbnail } from './PresetThumbnail';

interface FeaturedPresetProps {
  preset: ColorPreset;
  isFavorite: boolean;
  isApplied: boolean;
  onToggleFavorite: () => void;
  onApply: () => void;
}

export function FeaturedPreset({
  preset,
  isFavorite,
  isApplied,
  onToggleFavorite,
  onApply
}: FeaturedPresetProps) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.3)] p-3 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={preset.id}
          initial={{
            opacity: 0,
            y: 6
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -6
          }}
          transition={{
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1]
          }}>
          
          <PresetThumbnail colors={preset.colors} size="lg" />
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-white truncate">
            {preset.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {preset.editorsPick ?
            <span className="font-mono text-[9px] uppercase tracking-wider text-amber-300/80 bg-amber-400/10 border border-amber-400/20 rounded-full px-1.5 py-0.5">
                Editor's Pick
              </span> :

            <span className="font-mono text-[9px] uppercase tracking-wider text-white/45 bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5">
                {preset.category}
              </span>
            }
            <span className="font-mono text-[10px] text-white/30">
              {preset.uses} uses
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
            isFavorite ?
            `Remove ${preset.name} from favorites` :
            `Add ${preset.name} to favorites`
            }
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isFavorite ? 'text-[var(--amber)]' : 'text-white/40 hover:text-white'}`}>
            
            <Star
              size={15}
              strokeWidth={1.5}
              fill={isFavorite ? 'currentColor' : 'none'}
              aria-hidden="true" />
            
          </button>
          <motion.button
            type="button"
            onClick={onApply}
            whileTap={{
              scale: 0.96
            }}
            className="h-7 px-3 rounded-lg bg-white text-neutral-900 text-[11px] font-semibold flex items-center gap-1 hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0c14]">
            
            {isApplied ?
            <Check size={13} strokeWidth={2} aria-hidden="true" /> :

            <Wand2 size={13} strokeWidth={1.5} aria-hidden="true" />
            }
            {isApplied ? 'Applied' : 'Apply'}
          </motion.button>
        </div>
      </div>
    </div>);

}