import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  Component } from
'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform } from
'framer-motion';
import {
  Sun,
  Moon,
  Palette,
  Droplets,
  Eye,
  EyeOff,
  Square,
  Layers,
  ArrowLeftRight,
  ArrowUpDown,
  Maximize2,
  LayoutGrid,
  Monitor,
  Smartphone,
  Tablet,
  ChevronRight,
  Plus,
  Minus,
  AlignJustify,
  Scissors } from
'lucide-react';
import { PresetLibraryPanel } from './PresetLibraryPanel';
import { CloudsSlider } from './controls/CloudsSlider';
// ─── Constants ───────────────────────────────────────────────────────────────
const ACCENT = '#3D6AFF';
const COLOR_PALETTE = [
{
  id: 'neutral',
  value: '#2A2835'
},
{
  id: 'red',
  value: '#FF7474'
},
{
  id: 'orange',
  value: '#FFA502'
},
{
  id: 'yellow',
  value: '#FFFA65'
},
{
  id: 'green',
  value: '#2ECC71'
},
{
  id: 'lavender',
  value: '#DEB4F6'
},
{
  id: 'purple',
  value: '#B4AAFF'
}];

type Theme = 'light' | 'dark';
type Preset = 'mobile' | 'tablet';
interface DesignState {
  selectedColor: string;
  theme: Theme;
  blur: number;
  opacity: number;
  radius: number;
  shadow: number;
  width: number;
  height: number;
  padding: number;
  gap: number;
  preset: Preset;
  visible: boolean;
  overflow: boolean;
  hue: number;
}
// ─── Primitive Components ─────────────────────────────────────────────────────
function Panel({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <div
      className={`rounded-[22px] overflow-hidden ${className}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: 'rgba(10,12,20,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow:
        'inset 2px 4px 16px rgba(248,248,248,0.04), 0 24px 48px -12px rgba(0,0,0,0.5)'
      }}>
      
      {children}
    </div>);

}
function ControlRow({
  icon: Icon,
  label,
  children




}: {icon: React.ElementType;label: string;children: React.ReactNode;}) {
  return (
    <div
      className="flex items-center h-[40px] px-2 rounded-[11px] group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.065)',
        transition: 'background 0.15s ease'
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background =
        'rgba(255,255,255,0.045)';
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background =
        'rgba(255,255,255,0.03)';
      }}>
      
      {/* Icon container */}
      <div
        className="flex items-center justify-center w-[22px] h-[22px] rounded-[7px] shrink-0"
        style={{
          background: 'rgba(255,255,255,0.07)'
        }}>
        
        <Icon
          size={13}
          style={{
            color: 'rgba(255,255,255,0.52)'
          }} />
        
      </div>

      {/* Label */}
      <span
        className="ml-2 text-[11px] font-medium w-[58px] shrink-0"
        style={{
          color: 'rgba(255,255,255,0.92)'
        }}>
        
        {label}
      </span>

      {/* Vertical divider */}
      <div
        className="w-px h-[16px] shrink-0 mx-2"
        style={{
          background:
          'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
        }} />
      

      {/* Control */}
      <div className="flex-1 flex items-center">{children}</div>
    </div>);

}
function NumberStepper({
  value,
  onChange,
  unit = 'px'




}: {value: number;onChange: (v: number) => void;unit?: string;}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex items-center rounded-[7px] overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.22)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
        }}>
        
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-[28px] h-[26px] flex items-center justify-center transition-all duration-100 hover:bg-white/5 active:bg-white/10"
          style={{
            color: 'rgba(255,255,255,0.52)'
          }}
          aria-label="Decrease">
          
          <Minus size={9} />
        </button>
        <div
          className="w-px h-[14px]"
          style={{
            background: 'rgba(255,255,255,0.1)'
          }} />
        
        <div className="w-[50px] h-[26px] flex items-center justify-center">
          <span
            className="text-[11px] font-medium"
            style={{
              color: 'rgba(255,255,255,0.72)'
            }}>
            
            {value}
          </span>
        </div>
        <div
          className="w-px h-[14px]"
          style={{
            background: 'rgba(255,255,255,0.1)'
          }} />
        
        <button
          onClick={() => onChange(value + 1)}
          className="w-[28px] h-[26px] flex items-center justify-center transition-all duration-100 hover:bg-white/5 active:bg-white/10"
          style={{
            color: 'rgba(255,255,255,0.52)'
          }}
          aria-label="Increase">
          
          <Plus size={9} />
        </button>
      </div>
      <div
        className="flex items-center justify-center px-2 h-[24px] rounded-[7px]"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.07)'
        }}>
        
        <span
          className="text-[10px] font-medium tracking-[0.5px]"
          style={{
            color: 'rgba(255,255,255,0.22)'
          }}>
          
          {unit}
        </span>
      </div>
    </div>);

}
function Toggle({
  checked,
  onChange



}: {checked: boolean;onChange: (v: boolean) => void;}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="relative flex-shrink-0 w-[36px] h-[20px] rounded-full"
      style={{
        background: checked ? ACCENT : 'rgba(255,255,255,0.1)',
        border: `1px solid ${checked ? ACCENT : 'rgba(255,255,255,0.12)'}`,
        transition: 'background 0.2s ease, border-color 0.2s ease',
        boxShadow: checked ? `0 0 10px ${ACCENT}50` : 'none'
      }}>
      
      <motion.div
        className="absolute top-[1px] w-[16px] h-[16px] rounded-full bg-white"
        animate={{
          left: checked ? 17 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 35
        }}
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }} />
      
    </button>);

}
// ─── Premium: VisibleToggle ──────────────────────────────────────────────────
// Eye/EyeOff morph inside a glowing knob. The track also reveals an active
// pulse halo when visible.
function VisibleToggle({
  checked,
  onChange



}: {checked: boolean;onChange: (v: boolean) => void;}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label="Toggle visibility"
      className="relative flex-shrink-0 w-[44px] h-[22px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        background: checked ?
        `linear-gradient(135deg, ${ACCENT} 0%, #5680ff 100%)` :
        'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: checked ?
        `0 0 18px ${ACCENT}55, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 1px rgba(0,0,0,0.35)` :
        'inset 0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)',
        transition:
        'background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
      }}>
      
      {/* Inner pulse halo when on */}
      <AnimatePresence>
        {checked &&
        <motion.span
          aria-hidden
          initial={{
            opacity: 0,
            scale: 0.6
          }}
          animate={{
            opacity: [0.5, 0, 0.5],
            scale: [0.9, 1.1, 0.9]
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-[3px] rounded-full pointer-events-none"
          style={{
            background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.28), transparent 70%)'
          }} />

        }
      </AnimatePresence>

      {/* Knob */}
      <motion.div
        className="absolute top-[1px] w-[18px] h-[18px] rounded-full flex items-center justify-center"
        animate={{
          left: checked ? 23 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 520,
          damping: 32
        }}
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #e6e9f2 100%)',
          boxShadow:
          '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.1)'
        }}>
        
        <AnimatePresence mode="wait" initial={false}>
          {checked ?
          <motion.span
            key="eye-on"
            initial={{
              opacity: 0,
              scale: 0.6,
              rotate: -12
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.6,
              rotate: 12
            }}
            transition={{
              duration: 0.18
            }}
            className="flex items-center justify-center">
            
              <Eye
              size={10}
              strokeWidth={2.4}
              style={{
                color: ACCENT
              }} />
            
            </motion.span> :

          <motion.span
            key="eye-off"
            initial={{
              opacity: 0,
              scale: 0.6,
              rotate: 12
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.6,
              rotate: -12
            }}
            transition={{
              duration: 0.18
            }}
            className="flex items-center justify-center">
            
              <EyeOff
              size={10}
              strokeWidth={2.4}
              style={{
                color: 'rgba(20,22,32,0.55)'
              }} />
            
            </motion.span>
          }
        </AnimatePresence>
      </motion.div>
    </button>);

}
// ─── Premium: OverflowToggle ─────────────────────────────────────────────────
// Animated "clip" metaphor — when ON, content gets clipped (scissors close);
// when OFF, content overflows the boundary (dotted ghost line).
function OverflowToggle({
  checked,
  onChange,
  disabled = false




}: {checked: boolean;onChange: (v: boolean) => void;disabled?: boolean;}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label="Toggle overflow clipping"
      className="relative flex-shrink-0 w-[44px] h-[22px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      style={{
        background: checked ?
        `linear-gradient(135deg, ${ACCENT} 0%, #5680ff 100%)` :
        'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: checked ?
        `0 0 16px ${ACCENT}50, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 1px rgba(0,0,0,0.35)` :
        'inset 0 1px 2px rgba(0,0,0,0.4)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.25s ease, box-shadow 0.25s ease'
      }}>
      
      {/* Track texture — dotted ghost line when off, clean when on */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-[6px] right-[6px] flex items-center pointer-events-none">
        
        <span
          className="w-full h-px"
          style={{
            background: checked ?
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' :
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 5px)',
            transition: 'background 0.25s ease'
          }} />
        
      </span>

      {/* Knob with scissor icon */}
      <motion.div
        className="absolute top-[1px] w-[18px] h-[18px] rounded-full flex items-center justify-center"
        animate={{
          left: checked ? 23 : 1,
          rotate: checked ? 0 : -12
        }}
        transition={{
          type: 'spring',
          stiffness: 520,
          damping: 30
        }}
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #e6e9f2 100%)',
          boxShadow:
          '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.1)'
        }}>
        
        <motion.span
          animate={{
            scale: checked ? 1 : 0.92,
            opacity: checked ? 1 : 0.6
          }}
          transition={{
            duration: 0.2
          }}
          className="flex items-center justify-center">
          
          <Scissors
            size={9}
            strokeWidth={2.4}
            style={{
              color: checked ? ACCENT : 'rgba(20,22,32,0.55)'
            }} />
          
        </motion.span>
      </motion.div>
    </button>);

}
// ─── Premium: Spectrum (interactive hue picker) ──────────────────────────────
function Spectrum({
  hue,
  onChange



}: {hue: number; // 0–360
  onChange: (h: number) => void;}) {const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pct = hue / 360 * 100;
  const currentColor = `hsl(${hue}, 92%, 58%)`;
  const calc = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      onChange(Math.round(ratio * 360));
    },
    [onChange]
  );
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    calc(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    calc(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p
          className="text-[9px] font-semibold uppercase tracking-[0.9px]"
          style={{
            color: 'rgba(255,255,255,0.28)'
          }}>
          
          Spectrum
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="w-[8px] h-[8px] rounded-full"
            style={{
              background: currentColor,
              boxShadow: `0 0 8px ${currentColor}, inset 0 0 0 1px rgba(255,255,255,0.4)`
            }} />
          
          <span
            className="text-[9px] font-mono tabular-nums tracking-wider"
            style={{
              color: 'rgba(255,255,255,0.55)'
            }}>
            
            {Math.round(hue)}°
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hue)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onChange(Math.max(0, hue - 4));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onChange(Math.min(360, hue + 4));
          } else if (e.key === 'Home') {
            e.preventDefault();
            onChange(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            onChange(360);
          }
        }}
        className="relative h-[14px] w-full cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        style={{
          background:
          'linear-gradient(90deg, #FF0000 0%, #FF7F00 17%, #FFFF00 33%, #00FF00 50%, #00FFFF 67%, #0000FF 83%, #8B00FF 100%)',
          boxShadow:
          'inset 0 1px 3px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)'
        }}>
        
        {/* Reflective sheen */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[5px] rounded-t-full pointer-events-none"
          style={{
            background:
            'linear-gradient(180deg, rgba(255,255,255,0.32), transparent)'
          }} />
        

        {/* Active value tooltip */}
        <AnimatePresence>
          {(isDragging || isHovered) &&
          <motion.div
            aria-hidden
            initial={{
              opacity: 0,
              y: 4,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 4,
              scale: 0.9
            }}
            transition={{
              duration: 0.14
            }}
            className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded-md pointer-events-none"
            style={{
              left: `${pct}%`,
              background: 'rgba(18,18,22,0.92)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)'
            }}>
            
              <span
              className="text-[9px] font-mono tabular-nums tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.85)'
              }}>
              
                {Math.round(hue)}°
              </span>
            </motion.div>
          }
        </AnimatePresence>

        {/* Handle */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          animate={{
            scale: isDragging ? 1.15 : isHovered ? 1.05 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 28
          }}
          style={{
            left: `${pct}%`,
            width: 18,
            height: 18,
            background: '#ffffff',
            border: `2px solid ${currentColor}`,
            boxShadow: `0 2px 6px rgba(0,0,0,0.5), 0 0 12px ${currentColor}80, inset 0 0 0 1px rgba(255,255,255,0.6)`
          }}>
          
          <span
            className="absolute inset-[3px] rounded-full"
            style={{
              background: currentColor
            }} />
          
        </motion.div>
      </div>
    </div>);

}
// ─── Color Picker Sidebar ─────────────────────────────────────────────────────
function ColorPickerSidebar({
  selectedColor,
  onColorSelect,
  radius,
  opacity,
  blur,
  shadow,
  hue,
  onHueChange









}: {selectedColor: string;onColorSelect: (c: string) => void;radius: number;opacity: number;blur: number;shadow: number;hue: number;onHueChange: (h: number) => void;}) {
  const previewRadius = Math.max(4, Math.min(radius, 40));
  return (
    <Panel className="w-[240px] flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-3"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
        
        {/* Avatar gradient circle */}
        <div
          className="relative w-[44px] h-[44px] rounded-full shrink-0 overflow-hidden"
          style={{
            background:
            'linear-gradient(160deg, rgba(128,74,255,0.55) 0%, rgba(61,106,255,0.3) 40%, rgba(120,120,120,0.8) 100%)'
          }}>
          
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
              'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.15), transparent 60%)'
            }} />
          
          {/* Status dot */}
          <div
            className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full"
            style={{
              background:
              'linear-gradient(180deg, rgba(248,248,248,0.92), rgba(248,248,248,0.35))',
              border: '2px solid rgba(10,12,20,0.96)',
              boxShadow: '0 0 6px rgba(255,255,255,0.3)'
            }} />
          
        </div>

        {/* Text */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="text-[14px] font-medium leading-5 truncate"
            style={{
              color: 'rgba(248,248,248,0.95)'
            }}>
            
            Select Icon
          </span>
          <span
            className="text-[12px] truncate"
            style={{
              color: 'rgba(248,248,248,0.45)'
            }}>
            
            color picker
          </span>
        </div>

        {/* Chevron button */}
        <button
          className="flex items-center justify-center w-[24px] h-[24px] rounded-full shrink-0 transition-all duration-150 hover:bg-white/10"
          style={{
            background: 'rgba(63,63,63,0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: 'inset 2px 4px 16px rgba(248,248,248,0.06)'
          }}
          aria-label="Open">
          
          <ChevronRight
            size={12}
            style={{
              color: 'rgba(248,248,248,0.8)'
            }} />
          
        </button>
      </div>

      {/* Live preview box */}
      <div className="px-3 pt-3">
        <div
          className="w-full h-[88px] relative overflow-hidden flex items-center justify-center"
          style={{
            borderRadius: `${previewRadius}px`,
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
          
          {/* Checkerboard backdrop for opacity */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
              'linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)',
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
            }} />
          
          {/* Colored fill */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 35% 40%, ${selectedColor}, ${selectedColor}cc 60%, ${selectedColor}66)`,
              opacity: opacity / 100,
              filter: blur > 0 ? `blur(${blur * 0.08}px)` : undefined,
              boxShadow:
              shadow > 0 ?
              `0 ${shadow * 0.2}px ${shadow * 0.5}px rgba(0,0,0,${shadow / 100 * 0.6})` :
              undefined
            }} />
          
          {/* Hex pill */}
          <div
            className="relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.38)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)'
            }}>
            
            <div
              className="w-[7px] h-[7px] rounded-full"
              style={{
                background: selectedColor
              }} />
            
            <span
              className="text-[9px] font-mono tracking-wider uppercase"
              style={{
                color: 'rgba(255,255,255,0.72)'
              }}>
              
              {selectedColor}
            </span>
          </div>
        </div>
      </div>

      {/* Palette section */}
      <div className="px-3 pt-3 pb-3 flex flex-col gap-3">
        <div>
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.9px] mb-2"
            style={{
              color: 'rgba(255,255,255,0.28)'
            }}>
            
            Palette
          </p>
          <div className="flex items-center gap-[7px] flex-wrap">
            {/* Spectrum swatch */}
            <button
              className="relative overflow-hidden flex-shrink-0 transition-transform active:scale-90"
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background:
                'conic-gradient(from 0deg, #FF7474, #FFA502, #FFFA65, #2ECC71, #B4AAFF, #DEB4F6, #FF7474)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
              aria-label="Open color spectrum">
              
              <div
                className="absolute inset-[5px] rounded-[3px]"
                style={{
                  background: 'rgba(10,12,20,0.85)'
                }} />
              
            </button>

            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <motion.button
                  key={color.id}
                  onClick={() => onColorSelect(color.value)}
                  whileTap={{
                    scale: 0.85
                  }}
                  className="flex-shrink-0"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: color.value,
                    outline: isSelected ? `2px solid ${color.value}` : 'none',
                    outlineOffset: isSelected ? '2.5px' : '0',
                    boxShadow: isSelected ?
                    `0 0 16px ${color.value}60, inset 0 1px 0 rgba(255,255,255,0.3)` :
                    'inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition:
                    'outline 0.1s ease, outline-offset 0.1s ease, box-shadow 0.15s ease'
                  }}
                  aria-label={color.id}
                  aria-pressed={isSelected} />);


            })}
          </div>
        </div>

        {/* Interactive Spectrum */}
        <Spectrum hue={hue} onChange={onHueChange} />
      </div>
    </Panel>);

}
// ─── Appearance Panel ─────────────────────────────────────────────────────────
function AppearancePanel({
  theme,
  setTheme,
  selectedColor,
  setSelectedColor,
  blur,
  setBlur,
  opacity,
  setOpacity,
  radius,
  setRadius,
  shadow,
  setShadow













}: {theme: Theme;setTheme: (v: Theme) => void;selectedColor: string;setSelectedColor: (v: string) => void;blur: number;setBlur: (v: number) => void;opacity: number;setOpacity: (v: number) => void;radius: number;setRadius: (v: number) => void;shadow: number;setShadow: (v: number) => void;}) {
  return (
    <Panel className="w-[320px]">
      <div
        className="px-4 pt-4 pb-3"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
        
        <h2
          className="text-[13px] font-semibold tracking-[0.325px]"
          style={{
            color: 'rgba(255,255,255,0.92)'
          }}>
          
          Appearance
        </h2>
      </div>
      <div className="px-4 pt-3 pb-4 flex flex-col gap-[7px]">
        {/* Theme */}
        <ControlRow icon={theme === 'dark' ? Moon : Sun} label="Theme">
          <div
            className="flex p-[3px] rounded-[11px]"
            style={{
              background: 'rgba(0,0,0,0.22)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}>
            
            {(['light', 'dark'] as const).map((t) =>
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="flex items-center gap-1.5 px-3 py-[5px] rounded-[7px] text-[11px] font-medium transition-all duration-150"
              style={{
                background:
                theme === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                border:
                theme === t ?
                '1px solid rgba(255,255,255,0.06)' :
                '1px solid transparent',
                color:
                theme === t ?
                'rgba(255,255,255,0.92)' :
                'rgba(255,255,255,0.22)',
                boxShadow:
                theme === t ? '0 2px 4px rgba(0,0,0,0.35)' : 'none'
              }}
              aria-pressed={theme === t}>
              
                {t === 'light' ? <Sun size={11} /> : <Moon size={11} />}
                {t === 'light' ? 'Light' : 'Dark'}
              </button>
            )}
          </div>
        </ControlRow>

        {/* Color */}
        <ControlRow icon={Palette} label="Color">
          <div className="flex items-center gap-[5px] w-full min-w-0 justify-between pr-0.5">
            {/* Spectrum circle */}
            <button
              className="relative overflow-hidden flex-shrink-0 transition-transform active:scale-90"
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background:
                'conic-gradient(from 0deg, #FF7474, #FFA502, #FFFA65, #2ECC71, #B4AAFF, #DEB4F6, #FF7474)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
              }}
              aria-label="Open color spectrum">
              
              <div
                className="absolute inset-[3px] rounded-full"
                style={{
                  background: 'rgba(10,12,20,0.95)'
                }} />
              
            </button>

            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <motion.button
                  key={color.id}
                  onClick={() => setSelectedColor(color.value)}
                  whileTap={{
                    scale: 0.82
                  }}
                  whileHover={{
                    scale: 1.12
                  }}
                  className="flex-shrink-0 rounded-full relative"
                  style={{
                    width: 18,
                    height: 18,
                    background: color.value,
                    boxShadow: isSelected ?
                    `0 0 0 1.5px rgba(10,12,20,1), 0 0 0 3px ${color.value}, 0 0 10px ${color.value}66, inset 0 1px 0 rgba(255,255,255,0.28)` :
                    'inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.22)',
                    transition: 'box-shadow 0.18s ease'
                  }}
                  aria-label={color.id}
                  aria-pressed={isSelected} />);


            })}
          </div>
        </ControlRow>

        {/* Blur */}
        <CloudsSlider
          label="Blur"
          icon={Droplets}
          value={blur}
          min={0}
          max={100}
          onChange={setBlur}
          unit="px" />
        

        {/* Opacity */}
        <CloudsSlider
          label="Opacity"
          icon={Eye}
          value={opacity}
          min={0}
          max={100}
          onChange={setOpacity}
          unit="%" />
        

        {/* Radius */}
        <CloudsSlider
          label="Radius"
          icon={Square}
          value={radius}
          min={0}
          max={64}
          onChange={setRadius}
          unit="px" />
        

        {/* Shadow */}
        <CloudsSlider
          label="Shadow"
          icon={Layers}
          value={shadow}
          min={0}
          max={100}
          onChange={setShadow}
          unit="px" />
        
      </div>
    </Panel>);

}
// ─── Layout Panel ─────────────────────────────────────────────────────────────
function LayoutPanel({
  width,
  setWidth,
  height,
  setHeight,
  padding,
  setPadding,
  gap,
  setGap,
  preset,
  setPreset,
  visible,
  setVisible,
  overflow,
  setOverflow















}: {width: number;setWidth: (v: number) => void;height: number;setHeight: (v: number) => void;padding: number;setPadding: (v: number) => void;gap: number;setGap: (v: number) => void;preset: Preset;setPreset: (v: Preset) => void;visible: boolean;setVisible: (v: boolean) => void;overflow: boolean;setOverflow: (v: boolean) => void;}) {
  const PRESETS: {
    id: Preset;
    label: string;
    Icon: React.ElementType;
  }[] = [
  {
    id: 'mobile',
    label: 'Mobile',
    Icon: Smartphone
  },
  {
    id: 'tablet',
    label: 'Tablet',
    Icon: Tablet
  }];

  return (
    <div
      className="w-[320px] rounded-[20px] p-[10px]"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: '#181818',
        boxShadow:
        '0 32px 64px -12px rgba(0,0,0,0.55), 0 2.15px 0.5px -2px rgba(0,0,0,0.25), 0 24px 24px -16px rgba(8,8,8,0.28), 0 6px 13px rgba(8,8,8,0.22)'
      }}>
      
      <div
        className="rounded-[16px] px-[5px] pb-[12px]"
        style={{
          background: '#101010',
          border: '2px solid #1D1D1D'
        }}>
        
        {/* Header band */}
        <div className="h-[41px] px-[4px] flex items-end pb-[7px]">
          <h2
            className="text-[13px] font-semibold tracking-[0.325px]"
            style={{
              color: 'rgba(255,255,255,0.92)'
            }}>
            
            Layout
          </h2>
        </div>

        <div className="flex flex-col gap-[7px]">
          {/* Width */}
          <ControlRow icon={ArrowLeftRight} label="Width">
            <NumberStepper value={width} onChange={setWidth} unit="px" />
          </ControlRow>

          {/* Height */}
          <ControlRow icon={ArrowUpDown} label="Height">
            <NumberStepper value={height} onChange={setHeight} unit="px" />
          </ControlRow>

          {/* Padding + Gap sliders, each labelled above the bar */}
          <div className="mt-[6px] flex flex-col gap-px">
            <p className="text-[11px] font-medium leading-[16px] text-white">
              Padding
            </p>
            <CloudsSlider
              label="Padding"
              icon={Maximize2}
              variant="row"
              hideLabel
              value={padding}
              min={0}
              max={100}
              onChange={setPadding}
              unit="px" />
            
            <p className="text-[11px] font-medium leading-[16px] text-white mt-px">
              Gap
            </p>
            <CloudsSlider
              label="Gap"
              icon={LayoutGrid}
              variant="row"
              hideLabel
              value={gap}
              min={0}
              max={100}
              onChange={setGap}
              unit="px" />
            
          </div>

          {/* Preset */}
          <div className="mt-[6px]">
            <ControlRow icon={Monitor} label="Preset">
              <div className="flex items-center gap-1.5">
                {PRESETS.map(({ id, label, Icon }) => {
                  const isActive = preset === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setPreset(id)}
                      className="flex items-center justify-center gap-1.5 w-[72px] h-[28px] rounded-[7px] text-[11px] font-medium transition-all duration-150"
                      style={{
                        background: isActive ?
                        'rgba(255,255,255,0.08)' :
                        'rgba(0,0,0,0.2)',
                        border: isActive ?
                        '1px solid rgba(255,255,255,0.1)' :
                        '1px solid rgba(255,255,255,0.07)',
                        color: isActive ?
                        'rgba(255,255,255,0.92)' :
                        'rgba(255,255,255,0.52)',
                        boxShadow: isActive ?
                        '0 2px 4px rgba(0,0,0,0.35)' :
                        'none'
                      }}
                      aria-pressed={isActive}>
                      
                      <Icon
                        size={11}
                        style={{
                          color: isActive ? ACCENT : undefined
                        }} />
                      
                      {label}
                    </button>);

                })}
              </div>
            </ControlRow>
          </div>

          {/* Visible + Overflow share one row */}
          <div
            className="mt-[6px] flex items-center h-[40px] px-[8px] rounded-[11px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.067)'
            }}>
            
            <span
              aria-hidden="true"
              className="flex items-center justify-center w-[22px] h-[22px] rounded-[7px] shrink-0"
              style={{
                background: 'rgba(255,255,255,0.07)'
              }}>
              
              {visible ?
              <Eye
                size={13}
                style={{
                  color: 'rgba(255,255,255,0.52)'
                }} /> :


              <EyeOff
                size={13}
                style={{
                  color: 'rgba(255,255,255,0.52)'
                }} />

              }
            </span>
            <span
              className="ml-[8px] text-[11px] font-medium shrink-0"
              style={{
                color: 'rgba(255,255,255,0.92)'
              }}>
              
              Visible
            </span>
            <span className="ml-[14px] flex items-center shrink-0">
              <VisibleToggle checked={visible} onChange={setVisible} />
            </span>
            <span className="ml-[9px] flex items-center shrink-0">
              <OverflowToggle
                checked={overflow}
                onChange={setOverflow}
                disabled={!visible} />
              
            </span>
            <span
              className="ml-[13px] text-[11px] font-medium shrink-0"
              style={{
                color: 'rgba(255,255,255,0.92)'
              }}>
              
              Overflow
            </span>
            <span
              aria-hidden="true"
              className="ml-auto flex items-center justify-center w-[22px] h-[22px] rounded-[7px] shrink-0"
              style={{
                background: 'rgba(255,255,255,0.07)'
              }}>
              
              <AlignJustify
                size={13}
                style={{
                  color: 'rgba(255,255,255,0.52)'
                }} />
              
            </span>
          </div>
        </div>
      </div>
    </div>);

}
// ─── Main Export ──────────────────────────────────────────────────────────────
export function DesignInspector() {
  const [state, setState] = useState<DesignState>({
    selectedColor: '#B4AAFF',
    theme: 'dark',
    blur: 55,
    opacity: 100,
    radius: 16,
    shadow: 24,
    width: 320,
    height: 240,
    padding: 16,
    gap: 8,
    preset: 'mobile',
    visible: true,
    overflow: false,
    hue: 248
  });
  const update = (partial: Partial<DesignState>) =>
  setState((s) => ({
    ...s,
    ...partial
  }));
  const panels = [
  <ColorPickerSidebar
    key="color"
    selectedColor={state.selectedColor}
    onColorSelect={(v) =>
    update({
      selectedColor: v
    })
    }
    radius={state.radius}
    opacity={state.opacity}
    blur={state.blur}
    shadow={state.shadow}
    hue={state.hue}
    onHueChange={(h) =>
    update({
      hue: h
    })
    } />,

  <AppearancePanel
    key="appearance"
    theme={state.theme}
    setTheme={(v) =>
    update({
      theme: v
    })
    }
    selectedColor={state.selectedColor}
    setSelectedColor={(v) =>
    update({
      selectedColor: v
    })
    }
    blur={state.blur}
    setBlur={(v) =>
    update({
      blur: v
    })
    }
    opacity={state.opacity}
    setOpacity={(v) =>
    update({
      opacity: v
    })
    }
    radius={state.radius}
    setRadius={(v) =>
    update({
      radius: v
    })
    }
    shadow={state.shadow}
    setShadow={(v) =>
    update({
      shadow: v
    })
    } />,

  <LayoutPanel
    key="layout"
    width={state.width}
    setWidth={(v) =>
    update({
      width: v
    })
    }
    height={state.height}
    setHeight={(v) =>
    update({
      height: v
    })
    }
    padding={state.padding}
    setPadding={(v) =>
    update({
      padding: v
    })
    }
    gap={state.gap}
    setGap={(v) =>
    update({
      gap: v
    })
    }
    preset={state.preset}
    setPreset={(v) =>
    update({
      preset: v
    })
    }
    visible={state.visible}
    setVisible={(v) =>
    update({
      visible: v
    })
    }
    overflow={state.overflow}
    setOverflow={(v) =>
    update({
      overflow: v
    })
    } />,

  <PresetLibraryPanel key="presets" />];

  return (
    <div className="flex items-start gap-4 p-8 flex-wrap justify-center">
      {panels.map((panel, i) =>
      <motion.div
        key={i}
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
          delay: i * 0.09
        }}>
        
          {panel}
        </motion.div>
      )}
    </div>);

}