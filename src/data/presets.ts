import type { ColorPreset } from '../types/presets';

export const ALL_CATEGORIES = 'All Categories';

export const PRESET_CATEGORIES = [
ALL_CATEGORIES,
'Cyberpunk',
'Neon',
'Aurora',
'Luxury',
'Minimal',
'Glass'];


export const COLOR_PRESETS: ColorPreset[] = [
{
  id: 'cyber-neon',
  name: 'Cyber Neon',
  category: 'Cyberpunk',
  uses: 243,
  editorsPick: true,
  colors: {
    bg: '#0a0612',
    surface: '#160d24',
    glow: '#7D52FF',
    accent: '#A8FF50',
    text: '#EDE6FF'
  }
},
{
  id: 'acid-grid',
  name: 'Acid Grid',
  category: 'Cyberpunk',
  uses: 512,
  colors: {
    bg: '#050805',
    surface: '#0d160d',
    glow: '#FF00FF',
    accent: '#39FF14',
    text: '#E8FFE0'
  }
},
{
  id: 'synth-pink',
  name: 'Synth Pink',
  category: 'Neon',
  uses: 189,
  colors: {
    bg: '#0a0510',
    surface: '#1a0d1f',
    glow: '#3B82F6',
    accent: '#FF4FA3',
    text: '#FFE6F2'
  }
},
{
  id: 'electric-violet',
  name: 'Electric Violet',
  category: 'Neon',
  uses: 97,
  colors: {
    bg: '#08060f',
    surface: '#130d1f',
    glow: '#00CFFF',
    accent: '#BF5FFF',
    text: '#F0E6FF'
  }
},
{
  id: 'aurora-borealis',
  name: 'Aurora Borealis',
  category: 'Aurora',
  uses: 331,
  colors: {
    bg: '#040a0a',
    surface: '#0a1715',
    glow: '#06B6D4',
    accent: '#22C55E',
    text: '#E0FFF5'
  }
},
{
  id: 'nordic-light',
  name: 'Nordic Light',
  category: 'Aurora',
  uses: 274,
  colors: {
    bg: '#04090c',
    surface: '#0a1518',
    glow: '#00D9F5',
    accent: '#00F5A0',
    text: '#E0FFFA'
  }
},
{
  id: 'sunset-fire',
  name: 'Sunset Fire',
  category: 'Luxury',
  uses: 420,
  colors: {
    bg: '#0c0704',
    surface: '#1a0f08',
    glow: '#EF4444',
    accent: '#F59E0B',
    text: '#FFEFD9'
  }
},
{
  id: 'blood-moon',
  name: 'Blood Moon',
  category: 'Luxury',
  uses: 156,
  colors: {
    bg: '#0d0407',
    surface: '#1c080d',
    glow: '#F97316',
    accent: '#F43F5E',
    text: '#FFE0E6'
  }
},
{
  id: 'ocean-depth',
  name: 'Ocean Depth',
  category: 'Minimal',
  uses: 88,
  colors: {
    bg: '#040810',
    surface: '#0a1320',
    glow: '#8B5CF6',
    accent: '#06B6D4',
    text: '#E0F2FF'
  }
},
{
  id: 'ash-white',
  name: 'Ash White',
  category: 'Minimal',
  uses: 64,
  colors: {
    bg: '#0b0c0e',
    surface: '#16181c',
    glow: '#94A3B8',
    accent: '#E2E8F0',
    text: '#F8FAFC'
  }
},
{
  id: 'frost-glass',
  name: 'Frost Glass',
  category: 'Glass',
  uses: 201,
  colors: {
    bg: '#080a0e',
    surface: '#121620',
    glow: '#DDD6FE',
    accent: '#BAE6FD',
    text: '#F0F9FF'
  }
},
{
  id: 'smoke-mirror',
  name: 'Smoke Mirror',
  category: 'Glass',
  uses: 45,
  colors: {
    bg: '#0a0a0b',
    surface: '#161618',
    glow: '#6B7280',
    accent: '#9CA3AF',
    text: '#F4F4F5'
  }
}];