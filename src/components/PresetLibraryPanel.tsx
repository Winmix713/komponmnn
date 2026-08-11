import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wand2, PlusCircle, Search, Star, Ghost } from 'lucide-react';
import {
  ALL_CATEGORIES,
  COLOR_PRESETS,
  PRESET_CATEGORIES } from
'../data/presets';
import { CategoryDropdown } from './presets/CategoryDropdown';
import { FeaturedPreset } from './presets/FeaturedPreset';
import { PresetCard } from './presets/PresetCard';

export function PresetLibraryPanel() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [selectedId, setSelectedId] = useState(COLOR_PRESETS[0].id);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!applied) return;
    const t = window.setTimeout(() => setApplied(false), 1500);
    return () => window.clearTimeout(t);
  }, [applied]);

  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(t);
  }, [saved]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {
      [ALL_CATEGORIES]: COLOR_PRESETS.length
    };
    for (const preset of COLOR_PRESETS) {
      map[preset.category] = (map[preset.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COLOR_PRESETS.filter((preset) => {
      const matchesCategory =
      category === ALL_CATEGORIES || preset.category === category;
      const matchesQuery =
      q.length === 0 ||
      preset.name.toLowerCase().includes(q) ||
      preset.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const selected =
  COLOR_PRESETS.find((preset) => preset.id === selectedId) ?? COLOR_PRESETS[0];
  const showFeatured = query.trim().length === 0;

  const toggleFavorite = (id: string) =>
  setFavorites((f) =>
  f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
  );

  return (
    <section
      aria-label="Preset library"
      className="w-[344px] h-[680px] flex flex-col min-h-0 rounded-[22px] overflow-hidden"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: 'rgba(10,12,20,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow:
        'inset 2px 4px 16px rgba(248,248,248,0.04), 0 24px 48px -12px rgba(0,0,0,0.5)'
      }}>
      
      <header
        className="p-4 pb-3 flex items-center justify-between shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}>
        
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
            <Wand2
              size={15}
              strokeWidth={1.5}
              className="text-amber-400"
              aria-hidden="true" />
            
          </span>
          <div className="flex flex-col leading-none gap-0.5 min-w-0">
            <h2 className="text-[13px] font-semibold tracking-tight text-[var(--text-hi)]">
              Preset Library
            </h2>
            <span className="font-mono text-[10px] text-white/35 truncate">
              {saved ? 'Saved to library' : `${COLOR_PRESETS.length} design systems`}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSaved(true)}
          title="Save current colors as preset"
          aria-label="Save current colors as preset"
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] shrink-0">
          
          <PlusCircle size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </header>

      <div className="px-4 pt-3 pb-2 shrink-0 space-y-2">
        <div className="relative">
          <Search
            size={14}
            strokeWidth={1.5}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
          
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search presets"
            aria-label="Search presets"
            className="w-full h-9 pl-9 pr-12 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] text-xs text-white/90 placeholder:text-white/30 outline-none transition-colors focus:border-[rgba(61,106,255,0.5)] focus:bg-[rgba(0,0,0,0.4)]" />
          
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-white/30 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
        <CategoryDropdown
          categories={PRESET_CATEGORIES}
          value={category}
          counts={counts}
          onChange={setCategory} />
        
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin px-4 pb-4">
        <AnimatePresence initial={false}>
          {showFeatured &&
          <motion.div
            key="featured"
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="overflow-hidden">
            
              <div className="pt-1 pb-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 mb-2">
                  Featured Preset
                </p>
                <FeaturedPreset
                preset={selected}
                isFavorite={favorites.includes(selected.id)}
                isApplied={applied}
                onToggleFavorite={() => toggleFavorite(selected.id)}
                onApply={() => setApplied(true)} />
              
              </div>
            </motion.div>
          }
        </AnimatePresence>

        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            All Presets
          </p>
          <span className="font-mono text-[10px] text-white/30">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {filtered.length > 0 ?
        <div className="grid grid-cols-2 gap-2.5 content-start">
            <AnimatePresence initial={false}>
              {filtered.map((preset) =>
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={preset.id === selectedId}
              isFavorite={favorites.includes(preset.id)}
              onSelect={() => setSelectedId(preset.id)}
              onToggleFavorite={() => toggleFavorite(preset.id)} />

            )}
            </AnimatePresence>
          </div> :

        <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Ghost
              size={22}
              strokeWidth={1.5}
              className="text-white/30"
              aria-hidden="true" />
            
            </span>
            <div>
              <p className="text-xs font-semibold text-white/70">
                No presets found
              </p>
              <p className="text-[11px] text-white/35 mt-1 leading-relaxed">
                Try another keyword or
                <br />
                select a different category.
              </p>
            </div>
          </div>
        }

        {favorites.length > 0 &&
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-white/30">
            <Star
            size={10}
            strokeWidth={2}
            fill="currentColor"
            aria-hidden="true"
            className="text-[var(--amber)]" />
          
            {favorites.length} favorited
          </p>
        }
      </div>
    </section>);

}