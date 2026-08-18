import React from 'react';
import { RoverState } from '../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Radar } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface RoverControlsOverlayProps {
  rover: RoverState;
  onSetInput: (key: 'forward' | 'backward' | 'left' | 'right', value: boolean) => void;
  onTriggerScan: () => void;
  onToggleHeadlights: () => void;
}

export const RoverControlsOverlay: React.FC<RoverControlsOverlayProps> = ({
  rover,
  onSetInput,
  onTriggerScan,
  onToggleHeadlights,
}) => {
  return (
    <div className="absolute left-6 bottom-16 z-20 select-none flex items-end space-x-3">
      {/* On-Screen D-Pad for Driving */}
      <div className="artistic-panel p-2.5 flex flex-col items-center bg-[#0c0c0c] border border-[#222]">
        <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30 mb-1.5">
          DRIVE CONTROLS
        </div>

        {/* D-Pad Buttons */}
        <div className="grid grid-cols-3 gap-1 w-28">
          <div />
          <button
            onPointerDown={() => {
              soundFX.init();
              onSetInput('forward', true);
            }}
            onPointerUp={() => onSetInput('forward', false)}
            onPointerLeave={() => onSetInput('forward', false)}
            className="h-8 bg-[#0a0a0a] active:bg-[#d4ff00] active:text-[#0c0c0c] border border-[#222] text-white flex flex-col items-center justify-center transition-colors"
            title="Drive Forward [W / Up]"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[7px] font-mono text-white/30 leading-none">W</span>
          </button>
          <div />

          <button
            onPointerDown={() => {
              soundFX.init();
              onSetInput('left', true);
            }}
            onPointerUp={() => onSetInput('left', false)}
            onPointerLeave={() => onSetInput('left', false)}
            className="h-8 bg-[#0a0a0a] active:bg-[#d4ff00] active:text-[#0c0c0c] border border-[#222] text-white flex flex-col items-center justify-center transition-colors"
            title="Steer Left [A / Left]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[7px] font-mono text-white/30 leading-none">A</span>
          </button>

          <button
            onPointerDown={() => {
              soundFX.init();
              onSetInput('backward', true);
            }}
            onPointerUp={() => onSetInput('backward', false)}
            onPointerLeave={() => onSetInput('backward', false)}
            className="h-8 bg-[#0a0a0a] active:bg-[#d4ff00] active:text-[#0c0c0c] border border-[#222] text-white flex flex-col items-center justify-center transition-colors"
            title="Drive Reverse [S / Down]"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="text-[7px] font-mono text-white/30 leading-none">S</span>
          </button>

          <button
            onPointerDown={() => {
              soundFX.init();
              onSetInput('right', true);
            }}
            onPointerUp={() => onSetInput('right', false)}
            onPointerLeave={() => onSetInput('right', false)}
            className="h-8 bg-[#0a0a0a] active:bg-[#d4ff00] active:text-[#0c0c0c] border border-[#222] text-white flex flex-col items-center justify-center transition-colors"
            title="Steer Right [D / Right]"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="text-[7px] font-mono text-white/30 leading-none">D</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => {
            soundFX.init();
            onTriggerScan();
          }}
          className="px-3.5 py-2.5 bg-[#d4ff00] hover:bg-[#b5db00] text-[#0c0c0c] font-display font-black text-xs tracking-widest uppercase flex items-center space-x-2 transition-all acid-glow"
        >
          <Radar className="w-4 h-4" />
          <span>RADAR SCAN</span>
        </button>

        {rover.isAutopilot && (
          <div className="px-2.5 py-1 bg-[#0c0c0c] border border-[#d4ff00]/40 text-[#d4ff00] text-[9px] font-mono flex items-center space-x-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-[#d4ff00] rounded-full" />
            <span>AUTOPILOT: {rover.targetDestination?.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
