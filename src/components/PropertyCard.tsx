import React, { useId } from 'react';
interface PropertyCardProps {
  title: string;
  accentColor?: 'teal' | 'violet';
  /** Optional override for the accent tint — overrides accentColor preset */
  accentClass?: string;
  /** Max width of the card (default 320px) */
  maxWidth?: number | string;
  /** Extra classes for the outer article */
  className?: string;
  children: React.ReactNode;
}
const ACCENT_TINTS: Record<
  NonNullable<PropertyCardProps['accentColor']>,
  string> =
{
  teal: 'bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.15)_0%,transparent_50%)]',
  violet:
  'bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15)_0%,transparent_50%)]'
};
export function PropertyCard({
  title,
  accentColor = 'teal',
  accentClass,
  maxWidth = 320,
  className,
  children
}: PropertyCardProps) {
  const titleId = `property-card-title-${useId().replace(/:/g, '')}`;
  const tintClass = accentClass ?? ACCENT_TINTS[accentColor];
  return (
    <article
      aria-labelledby={titleId}
      style={{
        maxWidth
      }}
      className={[
      'relative w-full bg-[var(--bg-card)] rounded-[var(--r-xl)]',
      'shadow-[var(--sh-card)] border border-[var(--border-panel)]',
      'overflow-hidden backdrop-blur-xl',
      className].

      filter(Boolean).
      join(' ')}>
      
      {/* Accent Tint */}
      <div
        className={`absolute inset-0 pointer-events-none ${tintClass}`}
        aria-hidden="true" />
      

      {/* Inner Highlight */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[var(--r-xl)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        aria-hidden="true" />
      

      <div className="relative z-10 p-4 flex flex-col gap-4">
        <h2
          id={titleId}
          className="text-[13px] font-semibold text-[var(--text-hi)] tracking-wide m-0">
          
          {title}
        </h2>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </article>);

}