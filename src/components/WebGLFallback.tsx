import React from 'react';
import { AlertOctagon } from 'lucide-react';

export const WebGLFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0c0c0c] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="artistic-panel p-8 max-w-md border border-[#ff4433]/40 flex flex-col items-center shadow-2xl bg-[#080808]">
        <AlertOctagon className="w-12 h-12 text-[#ff4433] mb-4 animate-pulse" />
        <div className="font-serif-editorial italic text-2xl font-bold tracking-widest text-white uppercase mb-2">
          3D RENDERING UNAVAILABLE
        </div>
        <p className="text-xs text-white/60 leading-relaxed mb-6 font-sans">
          WebGL hardware acceleration could not be initialized. Please verify your browser has WebGL 2.0 enabled or try using a modern Chromium / Firefox / Safari browser.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-[#d4ff00] hover:bg-[#b5db00] text-[#0c0c0c] font-display font-black text-xs tracking-widest uppercase transition-colors acid-glow"
        >
          RETRY INITIALIZATION
        </button>
      </div>
    </div>
  );
};
