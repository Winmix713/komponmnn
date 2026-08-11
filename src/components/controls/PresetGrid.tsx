import React, { useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Tablet,
  Monitor,
  SlidersHorizontal,
  BoxIcon } from
'lucide-react';
export interface Preset {
  id: string;
  label: string;
  w: number | null;
  h: number | null;
  icon?: BoxIcon;
}
export const DEFAULT_PRESETS: Preset[] = [
{
  id: 'mobile',
  label: 'Mobile',
  w: 320,
  h: 640,
  icon: Smartphone
},
{
  id: 'tablet',
  label: 'Tablet',
  w: 768,
  h: 1024,
  icon: Tablet
},
{
  id: 'desktop',
  label: 'Desktop',
  w: 1440,
  h: 900,
  icon: Monitor
},
{
  id: 'custom',
  label: 'Custom',
  w: null,
  h: null,
  icon: SlidersHorizontal
}];

interface PresetGridProps {
  activeId: string;
  onChange: (id: string, w: number | null, h: number | null) => void;
  presets?: Preset[];
  columns?: 2 | 3 | 4;
}
const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4'
};
export function PresetGrid({
  activeId,
  onChange,
  presets = DEFAULT_PRESETS,
  columns = 2
}: PresetGridProps) {
  return (
    <div
      role="group"
      aria-label="Size presets"
      className={`grid ${COLUMN_CLASS[columns]} gap-1.5 w-full`}>
      
      {presets.map((preset) =>
      <PresetButton
        key={preset.id}
        preset={preset}
        isActive={activeId === preset.id}
        onClick={() => onChange(preset.id, preset.w, preset.h)} />

      )}
    </div>);

}
interface PresetButtonProps {
  preset: Preset;
  isActive: boolean;
  onClick: () => void;
}
function PresetButton({ preset, isActive, onClick }: PresetButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState('center center');
  const Icon = preset.icon;
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setOrigin(`${x}px ${y}px`);
  }, []);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setOrigin('center center');
    }
  }, []);
  return (
    <motion.button
      ref={ref}
      type="button"
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={preset.label}
      whileTap={{
        scale: 0.96,
        transition: {
          duration: 0.1
        }
      }}
      style={{
        transformOrigin: origin
      }}
      className={[
      'flex items-center justify-start gap-2 h-7 px-2 rounded-[var(--r-sm)] border',
      'text-[11px] font-medium transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
      isActive ?
      'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.1)] text-[var(--text-hi)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]' :
      'bg-[rgba(0,0,0,0.2)] border-[var(--border-subtle)] text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:bg-[rgba(255,255,255,0.03)]'].
      join(' ')}>
      
      {Icon ?
      <Icon
        size={12}
        strokeWidth={2}
        aria-hidden="true"
        className={`shrink-0 transition-colors duration-200 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-lo)]'}`} /> :


      <span
        aria-hidden="true"
        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${isActive ? 'bg-[var(--accent)] shadow-[0_0_6px_rgba(61,106,255,0.7)]' : 'bg-[rgba(255,255,255,0.25)]'}`} />

      }
      <span className="truncate">{preset.label}</span>
    </motion.button>);

}