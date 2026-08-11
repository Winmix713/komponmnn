export interface PresetColors {
  bg: string;
  surface: string;
  glow: string;
  accent: string;
  text: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  category: string;
  uses: number;
  editorsPick?: boolean;
  colors: PresetColors;
}