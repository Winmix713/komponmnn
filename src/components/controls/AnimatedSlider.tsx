import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  memo } from
'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SliderVariant =
'accent' |
'amber' |
'success' |
'warning' |
'danger' |
'purple' |
'pink';

export type DotColor = 'pulse' | 'mid' | 'full';

export interface AnimatedSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  variant?: SliderVariant;
  dotColor?: DotColor;
  showTicks?: boolean;
  tickCount?: number;
  showTooltip?: boolean;
  label?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const VARIANT_FILL: Record<SliderVariant, string> = {
  accent: 'bg-[var(--accent)]',
  amber: 'bg-[var(--amber)]',
  success: 'bg-emerald-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500'
};

const VARIANT_FOCUS: Record<SliderVariant, string> = {
  accent: 'focus-visible:ring-[var(--accent)]',
  amber: 'focus-visible:ring-[var(--amber)]',
  success: 'focus-visible:ring-emerald-500',
  warning: 'focus-visible:ring-yellow-500',
  danger: 'focus-visible:ring-red-500',
  purple: 'focus-visible:ring-violet-500',
  pink: 'focus-visible:ring-pink-500'
};

const VARIANT_DOT: Record<SliderVariant, string> = {
  accent: 'bg-[var(--accent)]',
  amber: 'bg-[var(--amber)]',
  success: 'bg-emerald-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  purple: 'bg-violet-500',
  pink: 'bg-pink-500'
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function safePercentage(value: number, min: number, max: number): number {
  const range = Math.max(1, max - min);
  return clamp((value - min) / range * 100, 0, 100);
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SliderTrackProps {
  children: React.ReactNode;
  trackRef: React.RefObject<HTMLDivElement>;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  disabled: boolean;
}

const SliderTrack = memo(function SliderTrack({
  children,
  trackRef,
  onPointerDown,
  disabled
}: SliderTrackProps) {
  return (
    <div
      ref={trackRef}
      role="presentation"
      className={[
      'relative h-2.5 rounded-full',
      'bg-[rgba(255,255,255,0.06)]',
      'shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]',
      'group-hover:bg-[rgba(255,255,255,0.09)]',
      'transition-colors duration-150',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'].
      join(' ')}
      onPointerDown={disabled ? undefined : onPointerDown}>
      
      {children}
    </div>);

});

interface SliderFillProps {
  percentage: number;
  variant: SliderVariant;
  disabled: boolean;
}

const SliderFill = memo(function SliderFill({
  percentage,
  variant,
  disabled
}: SliderFillProps) {
  return (
    <div
      aria-hidden="true"
      className={[
      'absolute left-0 top-0 bottom-0 rounded-full',
      VARIANT_FILL[variant],
      'transition-[width] duration-75 ease-out',
      disabled ? 'opacity-50' : ''].
      join(' ')}
      style={{ width: `${percentage}%` }} />);


});

interface SliderThumbProps {
  percentage: number;
  isDragging: boolean;
  isFocused: boolean;
  disabled: boolean;
}

const SliderThumb = memo(function SliderThumb({
  percentage,
  isDragging,
  isFocused,
  disabled
}: SliderThumbProps) {
  const scale = isDragging ? 1.2 : isFocused ? 1.1 : 1;
  return (
    <div
      aria-hidden="true"
      className={[
      'absolute top-1/2 w-3.5 h-3.5 rounded-full',
      'bg-[var(--bg-thumb)]',
      'shadow-[var(--sh-thumb)]',
      'border border-[rgba(255,255,255,0.12)]',
      'transition-transform duration-75 ease-out',
      'pointer-events-none',
      disabled ? 'opacity-50' : ''].
      join(' ')}
      style={{
        left: `${percentage}%`,
        transform: `translate(-50%, -50%) scale(${scale})`
      }} />);


});

interface SliderTooltipProps {
  value: number;
  unit: string;
  percentage: number;
  visible: boolean;
}

const SliderTooltip = memo(function SliderTooltip({
  value,
  unit,
  percentage,
  visible
}: SliderTooltipProps) {
  return (
    <div
      aria-hidden="true"
      className={[
      'absolute -top-8 pointer-events-none',
      'flex items-center justify-center',
      'min-w-[36px] px-1.5 py-0.5 rounded',
      'bg-[rgba(255,255,255,0.12)] backdrop-blur-sm',
      'text-[10px] font-medium text-white/80',
      'border border-[rgba(255,255,255,0.1)]',
      'transition-opacity duration-100',
      visible ? 'opacity-100' : 'opacity-0'].
      join(' ')}
      style={{
        left: `${percentage}%`,
        transform: 'translateX(-50%)'
      }}>
      
      {value}
      {unit}
    </div>);

});

interface SliderTicksProps {
  tickCount: number;
  min: number;
  max: number;
  unit: string;
}

const SliderTicks = memo(function SliderTicks({
  tickCount,
  min,
  max,
  unit
}: SliderTicksProps) {
  const ticks = useMemo(() => {
    return Array.from({ length: tickCount }, (_, i) => {
      const pct = i / (tickCount - 1) * 100;
      const val = Math.round(min + i / (tickCount - 1) * (max - min));
      return { pct, val };
    });
  }, [tickCount, min, max]);

  return (
    <div
      aria-hidden="true"
      className="relative flex justify-between mt-1.5 px-0 select-none pointer-events-none">
      
      {ticks.map(({ pct, val }) =>
      <div
        key={pct}
        className="flex flex-col items-center gap-0.5"
        style={{
          position: 'absolute',
          left: `${pct}%`,
          transform: 'translateX(-50%)'
        }}>
        
          <div className="w-px h-1 bg-[rgba(255,255,255,0.15)]" />
          <span className="text-[8px] text-[var(--text-lo)] font-medium">
            {val}
            {unit}
          </span>
        </div>
      )}
    </div>);

});

// ─── AnimatedBadge (inline, self-contained version) ──────────────────────────

const DOT_VARIANT: Record<DotColor, string> = {
  pulse: 'animate-pulse',
  mid: '',
  full: ''
};

const DOT_OPACITY: Record<DotColor, string> = {
  pulse: 'opacity-100',
  mid: 'opacity-50',
  full: 'opacity-100'
};

interface AnimatedBadgeProps {
  value: number;
  unit: string;
  dotColor: DotColor;
  variant: SliderVariant;
}

const AnimatedBadge = memo(function AnimatedBadge({
  value,
  unit,
  dotColor,
  variant
}: AnimatedBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 min-w-[56px] justify-end shrink-0">
      <div
        className={[
        'w-1.5 h-1.5 rounded-full',
        VARIANT_DOT[variant],
        DOT_OPACITY[dotColor],
        DOT_VARIANT[dotColor]].
        join(' ')} />
      
      <span className="text-[11px] font-medium tabular-nums text-[var(--text-lo)] tracking-tight">
        {value}
        <span className="text-[var(--text-lo)] opacity-60 ml-0.5">{unit}</span>
      </span>
    </div>);

});

// ─── Main Component ───────────────────────────────────────────────────────────

export const AnimatedSlider = memo(function AnimatedSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  unit = 'px',
  variant = 'accent',
  dotColor = 'mid',
  showTicks = false,
  tickCount = 5,
  showTooltip = true,
  label,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby
}: AnimatedSliderProps) {
  const id = useId();
  const labelId = `slider-label-${id}`;

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const percentage = useMemo(
    () => safePercentage(value, min, max),
    [value, min, max]
  );

  // ── value calculation from pointer position ──────────────────────────────
  const calcValue = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + pos * Math.max(1, max - min);
      return clamp(roundToStep(raw, step), min, max);
    },
    [min, max, step, value]
  );

  // ── Pointer Capture approach ─────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      onChange(calcValue(e.clientX));
    },
    [disabled, calcValue, onChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || disabled) return;
      onChange(calcValue(e.clientX));
    },
    [isDragging, disabled, calcValue, onChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      setIsDragging(false);
    },
    []
  );

  // ── Keyboard Navigation ──────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const range = Math.max(1, max - min);
      const largeStep = Math.max(step, Math.round(range / 10));

      const map: Record<string, number> = {
        ArrowRight: step,
        ArrowUp: step,
        ArrowLeft: -step,
        ArrowDown: -step,
        PageUp: largeStep,
        PageDown: -largeStep,
        Home: min - value,
        End: max - value
      };

      if (!(e.key in map)) return;
      e.preventDefault();
      const delta = map[e.key];
      const next = clamp(roundToStep(value + delta, step), min, max);
      if (next !== value) onChange(next);
    },
    [disabled, min, max, step, value, onChange]
  );

  // ── Memory leak safety: cleanup on unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  // ── ARIA label resolution ────────────────────────────────────────────────
  const resolvedAriaLabel =
  ariaLabel ?? (label ? undefined : `Slider ${min}–${max} ${unit}`);
  const resolvedAriaLabelledby =
  ariaLabelledby ?? (label ? labelId : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label &&
      <div className="flex items-center justify-between mb-0.5">
          <label
          id={labelId}
          className="text-[11px] font-medium text-[var(--text-lo)] select-none">
          
            {label}
          </label>
        </div>
      }

      <div className="flex items-center gap-3 w-full group">
        {/* ── Slider Root ──────────────────────────────────────────────── */}
        <div
          ref={thumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`}
          aria-label={resolvedAriaLabel}
          aria-labelledby={resolvedAriaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled}
          className={[
          'flex-1 flex flex-col justify-center relative outline-none rounded-sm',
          'focus-visible:ring-2 focus-visible:ring-offset-2',
          VARIANT_FOCUS[variant],
          'focus-visible:ring-offset-[var(--bg-base,#000)]'].
          join(' ')}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}>
          
          <SliderTrack
            trackRef={trackRef}
            onPointerDown={handlePointerDown}
            disabled={disabled}>
            
            <SliderFill
              percentage={percentage}
              variant={variant}
              disabled={disabled} />
            
            <SliderThumb
              percentage={percentage}
              isDragging={isDragging}
              isFocused={isFocused}
              disabled={disabled} />
            
            {showTooltip &&
            <SliderTooltip
              value={value}
              unit={unit}
              percentage={percentage}
              visible={isDragging || isFocused} />

            }
          </SliderTrack>

          {showTicks ?
          <SliderTicks
            tickCount={tickCount}
            min={min}
            max={max}
            unit={unit} /> :


          <div className="flex justify-between mt-1.5 px-0.5 text-[9px] text-[var(--text-lo)] font-medium select-none pointer-events-none">
              <span>{min} {unit}</span>
              <span>{max} {unit}</span>
            </div>
          }
        </div>

        {/* ── Value Badge ──────────────────────────────────────────────── */}
        <AnimatedBadge
          value={value}
          unit={unit}
          dotColor={dotColor}
          variant={variant} />
        
      </div>
    </div>);

});

export default AnimatedSlider;