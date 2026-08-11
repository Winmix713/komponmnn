import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { ColorPreset } from '../../types/presets';
import { PresetThumbnail } from './PresetThumbnail';

interface PresetCardProps {
  preset: ColorPreset;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export function PresetCard({
  preset,
  isActive,
  isFavorite,
  onSelect,
  onToggleFavorite
}: PresetCardProps) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.96
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      exit={{
        opacity: 0,
        scale: 0.96
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{
        y: -2,
        scale: 1.02
      }}
      className={[
      'preset-sweep group relative rounded-xl border p-2 overflow-hidden transition-colors duration-300',
      isActive ?
      'border-[rgba(61,106,255,0.5)] bg-[rgba(255,255,255,0.05)] shadow-[0_10px_24px_-12px_rgba(61,106,255,0.5)]' :
      'border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]'].
      join(' ')}>
      
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg">
        
        <PresetThumbnail colors={preset.colors} />
        <div className="mt-2 pr-6">
          <p
            className={`text-xs font-semibold truncate transition-colors ${isActive ? 'text-white' : 'text-white/85 group-hover:text-white'}`}>
            
            {preset.name}
          </p>
          <p className="font-mono text-[9px] text-white/30 truncate">
            {preset.category} · {preset.uses}
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
        isFavorite ?
        `Remove ${preset.name} from favorites` :
        `Add ${preset.name} to favorites`
        }
        className={`absolute bottom-2 right-2 w-5 h-5 rounded-md flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isFavorite ? 'text-[var(--amber)]' : 'text-white/25 hover:text-white/70'}`}>
        
        <Star
          size={13}
          strokeWidth={1.5}
          fill={isFavorite ? 'currentColor' : 'none'}
          aria-hidden="true" />
        
      </button>
    </motion.div>);

}