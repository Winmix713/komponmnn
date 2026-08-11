import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
type Theme = 'light' | 'dark';
interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}
const OPTIONS: Array<{
  id: Theme;
  label: string;
  Icon: typeof Sun;
}> = [
{
  id: 'light',
  label: 'Light',
  Icon: Sun
},
{
  id: 'dark',
  label: 'Dark',
  Icon: Moon
}];

interface ThemeOptionProps {
  id: Theme;
  label: string;
  Icon: typeof Sun;
  isActive: boolean;
  onSelect: (id: Theme) => void;
}
function ThemeOption({
  id,
  label,
  Icon,
  isActive,
  onSelect
}: ThemeOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-label={label}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(id)}
      className={[
      'flex-1 flex items-center justify-center gap-1.5 h-7 rounded-[var(--r-sm)]',
      'text-[11px] font-medium transition-all duration-200 relative',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
      isActive ?
      'text-[var(--text-hi)] shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.08)]' :
      'text-[var(--text-lo)] hover:text-[var(--text-mid)] border border-transparent'].
      join(' ')}>
      
      {/* Both icons always in DOM — cross-fade via opacity/scale/blur */}
      <span className="relative w-3.5 h-3.5 flex items-center justify-center">
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.6,
            filter: isActive ? 'blur(0px)' : 'blur(6px)'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
          aria-hidden="true">
          
          <Icon size={14} strokeWidth={2.5} />
        </motion.span>
      </span>
      {label}
    </button>);

}
export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(theme === 'light' ? 'dark' : 'light');
    }
  };
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      onKeyDown={handleKeyDown}
      className="flex items-center gap-1 w-full p-0.5 bg-[rgba(0,0,0,0.2)] rounded-[var(--r-md)] border border-[var(--border-subtle)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
      
      {OPTIONS.map((opt) =>
      <ThemeOption
        key={opt.id}
        id={opt.id}
        label={opt.label}
        Icon={opt.Icon}
        isActive={theme === opt.id}
        onSelect={onChange} />

      )}
    </div>);

}