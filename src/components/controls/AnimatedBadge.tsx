import React, { useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type BadgeStatus = 'idle' | 'info' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';
type CharacterKind = 'digit' | 'separator' | 'sign' | 'symbol';

export interface AnimatedBadgeProps {
  value: number;
  unit?: string;
  status?: BadgeStatus;
  size?: BadgeSize;
  locale?: string | string[];
  formatOptions?: Intl.NumberFormatOptions;
  pulse?: boolean;
  maxDigits?: number;
  className?: string;
  ariaLabel?: string;
}

interface CharacterSlotData {
  char: string;
  kind: CharacterKind;
  slotKey: string;
}

interface CharacterSlotProps {
  char: string;
  kind: CharacterKind;
  size: BadgeSize;
  reducedMotion: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const SIZE_STYLES: Record<
  BadgeSize,
  {
    root: string;
    dot: string;
    value: string;
    unit: string;
    gap: string;
  }> =
{
  sm: {
    root: 'h-7 rounded-[10px] px-2.5',
    dot: 'size-1.5',
    value: 'text-[13px]',
    unit: 'text-[10px]',
    gap: 'gap-1.5'
  },
  md: {
    root: 'h-8 rounded-[12px] px-3',
    dot: 'size-2',
    value: 'text-[14px]',
    unit: 'text-[10px]',
    gap: 'gap-2'
  },
  lg: {
    root: 'h-10 rounded-[14px] px-3.5',
    dot: 'size-2.5',
    value: 'text-[15px]',
    unit: 'text-[11px]',
    gap: 'gap-2.5'
  }
};

const STATUS_STYLES: Record<BadgeStatus, string> = {
  idle: 'bg-white/35',
  info: 'bg-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.55)]',
  success: 'bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.45)]',
  warning: 'bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.5)]',
  danger: 'bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.5)]'
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function mapPartType(type: Intl.NumberFormatPart['type']): CharacterKind {
  if (type === 'integer' || type === 'fraction') return 'digit';
  if (type === 'minusSign' || type === 'plusSign') return 'sign';
  if (
  type === 'group' ||
  type === 'decimal' ||
  type === 'literal')
  {
    return 'separator';
  }

  return 'symbol';
}

function buildCharacterSlots(
formatter: Intl.NumberFormat,
value: number)
: CharacterSlotData[] {
  const parts = formatter.formatToParts(value);

  const flattened = parts.flatMap((part) =>
  Array.from(part.value).map((char) => ({
    char,
    kind: mapPartType(part.type)
  }))
  );

  return flattened.map((item, index, array) => ({
    ...item,
    slotKey: `slot-${array.length - index - 1}`
  }));
}

function buildWidthTemplate(
formatter: Intl.NumberFormat,
value: number,
maxDigits?: number)
{
  if (!maxDigits) return formatter.format(value);

  const safeMaxDigits = Math.max(1, Math.min(maxDigits, 12));
  const fractionLength = formatter.
  formatToParts(value).
  filter((part) => part.type === 'fraction').
  reduce((total, part) => total + Array.from(part.value).length, 0);

  const integerTemplate = '8'.repeat(safeMaxDigits);
  const fractionTemplate =
  fractionLength > 0 ? `.${'8'.repeat(fractionLength)}` : '';
  const templateNumber = Number(`${integerTemplate}${fractionTemplate}`);

  if (!Number.isFinite(templateNumber)) {
    return formatter.format(value);
  }

  return formatter.format(templateNumber);
}

function CharacterSlot({
  char,
  kind,
  size,
  reducedMotion
}: CharacterSlotProps) {
  const widthClass =
  kind === 'digit' ?
  size === 'lg' ?
  'min-w-[0.72em]' :
  'min-w-[0.68em]' :
  kind === 'sign' ?
  'min-w-[0.56em]' :
  kind === 'separator' ?
  'min-w-[0.34em]' :
  'min-w-[0.5em]';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid h-[1em] place-items-center overflow-hidden',
        widthClass
      )}>
      
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          initial={
          reducedMotion ?
          { opacity: 0 } :
          { y: '26%', opacity: 0, scale: 0.96 }
          }
          animate={
          reducedMotion ?
          { opacity: 1 } :
          { y: '0%', opacity: 1, scale: 1 }
          }
          exit={
          reducedMotion ?
          { opacity: 0 } :
          {
            y: '-26%',
            opacity: 0,
            scale: 0.96,
            position: 'absolute'
          }
          }
          transition={
          reducedMotion ?
          { duration: 0.12 } :
          { duration: 0.42, ease: EASE }
          }
          className="col-start-1 row-start-1 will-change-transform">
          
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      </AnimatePresence>
    </span>);

}

export function AnimatedBadge({
  value,
  unit,
  status = 'idle',
  size = 'md',
  locale,
  formatOptions,
  pulse = false,
  maxDigits,
  className,
  ariaLabel
}: AnimatedBadgeProps) {
  const reducedMotion = useReducedMotion();
  const safeValue = Number.isFinite(value) ? value : 0;

  const localeKey = Array.isArray(locale) ? locale.join('|') : locale ?? 'default';
  const optionsKey = JSON.stringify(formatOptions ?? {});

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [localeKey, optionsKey]
  );

  const formattedValue = useMemo(
    () => formatter.format(safeValue),
    [formatter, safeValue]
  );

  const slots = useMemo(
    () => buildCharacterSlots(formatter, safeValue),
    [formatter, safeValue]
  );

  const widthTemplate = useMemo(
    () => buildWidthTemplate(formatter, safeValue, maxDigits),
    [formatter, safeValue, maxDigits]
  );

  const label = ariaLabel ?? [formattedValue, unit].filter(Boolean).join(' ');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={label}
      data-status={status}
      className={cn(
        'relative inline-flex select-none items-center justify-end overflow-hidden border',
        'border-[color:var(--border-subtle,rgba(255,255,255,0.08))]',
        'bg-[color:var(--bg-badge,rgba(15,23,42,0.72))]',
        'text-[color:var(--text-hi,#f8fafc)]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.24)]',
        'supports-[backdrop-filter]:backdrop-blur-md',
        SIZE_STYLES[size].root,
        className
      )}>
      
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_38%,transparent)]" />
      

      <div
        className={cn(
          'relative z-10 flex w-full items-center justify-end',
          SIZE_STYLES[size].gap
        )}>
        
        <span
          aria-hidden="true"
          className={cn(
            'mr-auto shrink-0 rounded-full',
            SIZE_STYLES[size].dot,
            STATUS_STYLES[status],
            pulse && !reducedMotion && 'animate-pulse'
          )} />
        

        <span
          aria-hidden="true"
          className={cn(
            'grid items-center justify-end font-mono tabular-nums leading-none tracking-[-0.02em]',
            SIZE_STYLES[size].value
          )}>
          
          <span className="invisible col-start-1 row-start-1 whitespace-pre">
            {widthTemplate}
          </span>

          <span className="col-start-1 row-start-1 flex items-center justify-end">
            {slots.map((slot) =>
            <CharacterSlot
              key={slot.slotKey}
              char={slot.char}
              kind={slot.kind}
              size={size}
              reducedMotion={Boolean(reducedMotion)} />

            )}
          </span>
        </span>

        {unit ?
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 font-sans font-medium uppercase tracking-[0.14em] text-[color:var(--text-lo,rgba(255,255,255,0.68))]',
            SIZE_STYLES[size].unit
          )}>
          
            {unit}
          </span> :
        null}
      </div>
    </div>);

}