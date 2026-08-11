import React from 'react';
import { motion } from 'framer-motion';
import { DesignInspector } from './components/DesignInspector';
export function App() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-page)] text-[var(--text-hi)] font-sans overflow-hidden flex flex-col items-center justify-center py-16 px-4 selection:bg-[var(--accent)] selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        {/* Orbs */}
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--teal)] opacity-20 blur-[120px] mix-blend-screen"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />
        
        <motion.div
          className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--violet)] opacity-20 blur-[100px] mix-blend-screen"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />
        
        <motion.div
          className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[var(--amber)] opacity-10 blur-[150px] mix-blend-screen"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }} />
        

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
          }} />
        
      </div>

      <main className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-10">
        <DesignInspector />
      </main>
    </div>);

}