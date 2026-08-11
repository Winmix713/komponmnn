import React, { useCallback, useRef, useState } from 'react';

type CloudsSliderVariant = 'glass' | 'row';

interface CloudsSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ElementType;
  /**
   * 'glass' — standalone dark glass bar with the label inside (default).
   * 'row'   — matches the inspector row surface; label is rendered outside.
   */
  variant?: CloudsSliderVariant;
  /** Hide the inline label (used when the label sits above the bar). */
  hideLabel?: boolean;
}

/**
 * Clouds Slider (286×40)
 * Full-width bar with tick marks, a 3px grip, an inline value readout and
 * pointer / keyboard control.
 */
export function CloudsSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  icon: Icon,
  variant = 'glass',
  hideLabel = false
}: CloudsSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);
  const isRow = variant === 'row';

  const clamp = useCallback(
    (raw: number) => {
      const snapped = Math.round(raw / step) * step;
      return Math.min(max, Math.max(min, snapped));
    },
    [min, max, step]
  );

  const commitFromPointer = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      onChange(clamp(min + ratio * (max - min)));
    },
    [clamp, min, max, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    ref.current?.setPointerCapture(e.pointerId);
    setGrabbing(true);
    commitFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current?.hasPointerCapture(e.pointerId)) return;
    commitFromPointer(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const big = step * 10;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = value + step;else
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = value - step;else
    if (e.key === 'Home') next = min;else
    if (e.key === 'End') next = max;else
    if (e.key === 'PageUp') next = value + big;else
    if (e.key === 'PageDown') next = value - big;
    if (next === null) return;
    e.preventDefault();
    onChange(clamp(next));
  };

  const pct = max === min ? 0 : (value - min) / (max - min);
  const display = `${Math.round(value)}${unit}`;

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-valuetext={display}
      aria-orientation="horizontal"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setGrabbing(false)}
      onPointerCancel={() => setGrabbing(false)}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-[40px] overflow-hidden cursor-ew-resize select-none touch-none transition-transform duration-[120ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010] ${isRow ? 'rounded-[11px]' : 'rounded-[20px]'} ${grabbing ? 'scale-[1.015] motion-reduce:scale-100' : ''}`}
      style={
      isRow ?
      {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.067)'
      } :
      {
        background: 'rgba(10, 18, 32, 0.68)',
        backdropFilter: 'blur(22px) saturate(1.7)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.7)',
        boxShadow:
        'inset 0 0 0 1px rgba(255,255,255,0.09), 0 14px 32px rgba(8,20,38,0.2)'
      }
      }>
      
      {/* Fill */}
      <div
        aria-hidden="true"
        className={`absolute top-[3px] bottom-[3px] left-[3px] ${isRow ? 'rounded-[7px]' : 'rounded-[17px]'}`}
        style={{
          width: `calc((100% - 6px) * ${pct})`,
          background: isRow ?
          'rgba(255,255,255,0.05)' :
          'rgba(255,255,255,0.085)',
          border: isRow ? '1px solid rgba(255,255,255,0.07)' : undefined,
          boxShadow: isRow ?
          undefined :
          'inset 0 0 0 1px rgba(255,255,255,0.16)'
        }} />
      

      {/* Ticks */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-between px-[4%] pointer-events-none">
        
        {Array.from({
          length: 10
        }).map((_, i) =>
        <i
          key={i}
          className="w-px h-[6px] block"
          style={{
            background: 'rgba(255,255,255,0.2)'
          }} />

        )}
      </div>

      {/* Grip */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 w-[3px] h-[18px] -mt-[9px] rounded-[2px] bg-white pointer-events-none"
        style={{
          left: `calc(3px + (100% - 6px) * ${pct} - 1.5px)`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }} />
      

      {/* Icon, label + value */}
      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-between gap-1.5 px-[14px] ${isRow ? '' : 'text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]'}`}
        style={
        isRow ?
        {
          color: 'rgba(255,255,255,0.92)'
        } :
        undefined
        }>
        
        <span className="flex-1 min-w-0 flex items-center gap-1.5 text-[11px] font-medium opacity-90">
          {Icon ?
          <Icon
            size={12}
            strokeWidth={2}
            aria-hidden="true"
            className="shrink-0 opacity-80" /> :

          null}
          {!hideLabel && <span className="truncate">{label}</span>}
        </span>
        <span
          className={`shrink-0 tabular-nums ${isRow ? 'text-[11px] font-medium' : 'text-[12px] font-semibold'}`}>
          
          {display}
        </span>
      </div>
    </div>);

}