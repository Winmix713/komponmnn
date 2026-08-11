import React from 'react';
import type { PresetColors } from '../../types/presets';

interface PresetThumbnailProps {
  colors: PresetColors;
  size?: 'sm' | 'lg';
}

export function PresetThumbnail({ colors, size = 'sm' }: PresetThumbnailProps) {
  const large = size === 'lg';
  return (
    <div
      aria-hidden="true"
      className={`${large ? 'h-32' : 'h-16'} rounded-lg overflow-hidden relative p-2 flex flex-col gap-1.5`}
      style={{
        background: colors.bg
      }}>
      
      <div
        className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-40"
        style={{
          background: colors.glow
        }} />
      
      <div className="flex items-center gap-1.5 relative z-10">
        <div
          className="w-3 h-3 rounded-md shrink-0"
          style={{
            background: colors.accent
          }} />
        
        <div
          className="h-1.5 rounded-full"
          style={{
            width: large ? '40%' : '45%',
            background: colors.text,
            opacity: 0.45
          }} />
        
      </div>
      <div
        className="rounded-md flex-1 p-1.5 flex flex-col gap-1 justify-between relative z-10"
        style={{
          background: colors.surface
        }}>
        
        <div className="space-y-1">
          <div
            className="h-1 rounded-full"
            style={{
              width: '70%',
              background: colors.text,
              opacity: 0.5
            }} />
          
          <div
            className="h-1 rounded-full"
            style={{
              width: '50%',
              background: colors.text,
              opacity: 0.25
            }} />
          
        </div>
        <div className="flex items-center gap-1">
          <div
            className={`rounded px-1.5 ${large ? 'h-4' : 'h-3'} flex items-center`}
            style={{
              background: colors.accent
            }}>
            
            <div
              className="h-0.5 rounded-full"
              style={{
                width: large ? 18 : 12,
                background: colors.bg,
                opacity: 0.7
              }} />
            
          </div>
          <div
            className={`rounded ${large ? 'h-4' : 'h-3'} flex-1 border`}
            style={{
              borderColor: colors.glow,
              opacity: 0.6
            }} />
          
        </div>
      </div>
    </div>);

}