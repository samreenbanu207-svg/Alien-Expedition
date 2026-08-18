import React from 'react';
import { TimeOfDay, WeatherType } from '../types';
import { Sun, Sunset, Moon, Sunrise, Wind, CloudLightning, CloudFog, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface TopBarProps {
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  audioMuted: boolean;
  onTimeChange: (time: TimeOfDay) => void;
  onWeatherChange: (weather: WeatherType) => void;
  onToggleAudio: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  timeOfDay,
  weather,
  audioMuted,
  onTimeChange,
  onWeatherChange,
  onToggleAudio,
}) => {
  return (
    <header className="h-14 w-full artistic-panel border-b border-[#222] px-6 flex items-center justify-between z-30 select-none bg-[#0c0c0c]">
      {/* Left: Brand Title with Artistic Flair Editorial Serif */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 bg-[#d4ff00] rotate-45 acid-glow" />
          <div className="flex items-baseline space-x-2">
            <span className="text-[11px] uppercase tracking-[0.35em] font-black text-[#d4ff00]">
              VANGUARD
            </span>
            <span className="text-sm font-serif-editorial italic tracking-wider text-[#f4f4f4]">
              // Planet A-07
            </span>
          </div>
        </div>
        <div className="hidden lg:block w-8 h-[1px] bg-white/10" />
        <span className="hidden xl:inline text-[9px] uppercase tracking-[0.3em] font-black text-white/40">
          SPATIAL RESEARCH GROUP
        </span>
      </div>

      {/* Center: System Coordinates */}
      <div className="hidden md:flex items-center space-x-3 text-xs font-mono tracking-tight text-white/50">
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">ORIGIN:</span>
        <span className="text-white/80 font-mono text-[11px] tracking-wider">
          48.8566° N, 2.3522° E // KEPLER-186X
        </span>
      </div>

      {/* Right: Environment Cycle & Procedural Controls */}
      <div className="flex items-center space-x-3">
        {/* Time of Day Cycle Switcher */}
        <div className="flex items-center bg-[#0a0a0a] border border-[#222] p-0.5">
          <button
            onClick={() => {
              soundFX.playClick();
              onTimeChange('DAWN');
            }}
            title="Dawn Lighting Cycle"
            className={`p-1.5 transition-colors ${
              timeOfDay === 'DAWN' ? 'bg-[#d4ff00] text-[#0c0c0c]' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sunrise className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onTimeChange('DAY');
            }}
            title="Daylight Solar Cycle"
            className={`p-1.5 transition-colors ${
              timeOfDay === 'DAY' ? 'bg-[#d4ff00] text-[#0c0c0c]' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onTimeChange('SUNSET');
            }}
            title="Dusk / Twilight Cycle"
            className={`p-1.5 transition-colors ${
              timeOfDay === 'SUNSET' ? 'bg-[#d4ff00] text-[#0c0c0c]' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onTimeChange('NIGHT');
            }}
            title="Nocturne Deep Scan Cycle"
            className={`p-1.5 transition-colors ${
              timeOfDay === 'NIGHT' ? 'bg-[#d4ff00] text-[#0c0c0c]' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Atmosphere Weather Switcher */}
        <div className="hidden sm:flex items-center bg-[#0a0a0a] border border-[#222] p-0.5">
          <button
            onClick={() => {
              soundFX.playClick();
              onWeatherChange('CLEAR');
            }}
            title="Clear Atmosphere"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              weather === 'CLEAR' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            CLEAR
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onWeatherChange('DUST');
            }}
            title="Aerosol Particulate"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              weather === 'DUST' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            AEROSOL
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onWeatherChange('ALIEN_STORM');
            }}
            title="Electro-Static Squall"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              weather === 'ALIEN_STORM' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            STORM
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onWeatherChange('MIST');
            }}
            title="Hydrocarbon Mist"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              weather === 'MIST' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            MIST
          </button>
        </div>

        {/* Audio Synthesizer */}
        <button
          onClick={onToggleAudio}
          title={audioMuted ? 'Unmute Synthesizer' : 'Mute Synthesizer'}
          className={`p-1.5 border transition-colors ${
            audioMuted ? 'border-[#222] text-white/30 bg-[#0a0a0a]' : 'border-[#d4ff00]/50 text-[#d4ff00] bg-[#d4ff00]/10 hover:bg-[#d4ff00]/20'
          }`}
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Active Status Terminal Indicator */}
        <div className="flex items-center space-x-2 pl-3 border-l border-[#222]">
          <div className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse acid-glow" />
          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#d4ff00] hidden md:inline">
            ACTIVE TERMINAL
          </span>
        </div>
      </div>
    </header>
  );
};
