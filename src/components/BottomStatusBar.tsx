import React from 'react';
import { RoverState, CameraMode, RegionId } from '../types';
import { PLANETARY_REGIONS, getRegionAt } from '../utils/terrainNoise';
import { BatteryCharging, Battery, Wifi, Gauge, Compass, Lightbulb, Clock } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface BottomStatusBarProps {
  rover: RoverState;
  cameraMode: CameraMode;
  missionTime: string;
  onCameraChange: (mode: CameraMode) => void;
  onToggleHeadlights: () => void;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  rover,
  cameraMode,
  missionTime,
  onCameraChange,
  onToggleHeadlights,
}) => {
  const currentRegionId = getRegionAt(rover.x, rover.z);
  const region = PLANETARY_REGIONS[currentRegionId];

  return (
    <footer className="absolute bottom-0 left-0 right-0 h-14 artistic-panel border-t border-[#222] px-6 flex items-center justify-between z-30 select-none bg-[#0c0c0c]">
      {/* Left: Rover System Status & Location */}
      <div className="flex items-center space-x-6">
        {/* Rover Status */}
        <div className="flex items-center space-x-2">
          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/30 hidden sm:inline">
            ROVER:
          </span>
          <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 bg-[#d4ff00] rounded-full animate-pulse acid-glow" />
            <span>NOMINAL</span>
          </div>
        </div>

        {/* Location / Region with Serif Flair */}
        <div className="flex items-center space-x-2">
          <Compass className="w-3.5 h-3.5 text-[#d4ff00]" />
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30 leading-none">
              CURRENT SECTOR
            </span>
            <span className="text-xs font-serif-editorial italic font-bold text-[#ffffff] tracking-wider leading-none truncate max-w-[140px] sm:max-w-[220px] mt-0.5">
              {region.name}
            </span>
          </div>
        </div>

        {/* Mission Time */}
        <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-[#222]">
          <Clock className="w-3.5 h-3.5 text-white/40" />
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30 leading-none">
              MISSION TIME
            </span>
            <span className="text-xs font-mono font-bold text-[#ffffff] leading-none mt-0.5">
              {missionTime}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Kinematics & Power */}
      <div className="flex items-center space-x-5">
        {/* Speed */}
        <div className="flex items-center space-x-1.5">
          <Gauge className="w-3.5 h-3.5 text-[#d4ff00]" />
          <div className="flex items-baseline space-x-1">
            <span className="text-xs font-mono font-bold text-[#ffffff]">
              {Math.abs(rover.speed).toFixed(1)}
            </span>
            <span className="text-[9px] font-mono text-white/40">km/h</span>
          </div>
        </div>

        {/* Power / Battery */}
        <div className="flex items-center space-x-1.5">
          {rover.solarCharging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-[#d4ff00]" />
          ) : (
            <Battery className="w-3.5 h-3.5 text-white/40" />
          )}
          <div className="flex items-baseline space-x-1">
            <span className="text-xs font-mono font-bold text-[#ffffff]">
              {Math.round(rover.battery)}%
            </span>
            <span className="text-[9px] font-mono text-[#d4ff00] hidden sm:inline font-bold">SOLAR</span>
          </div>
        </div>

        {/* Uplink */}
        <div className="hidden md:flex items-center space-x-1.5">
          <Wifi className="w-3.5 h-3.5 text-[#d4ff00]" />
          <div className="flex items-baseline space-x-1 text-xs font-mono">
            <span className="text-[9px] text-white/30 uppercase">LINK:</span>
            <span className="font-bold text-[#d4ff00]">
              {rover.uplinkStatus} ({rover.signalQuality}%)
            </span>
          </div>
        </div>
      </div>

      {/* Right: Camera Modes & Headlights Switch */}
      <div className="flex items-center space-x-2">
        {/* Headlight Switch */}
        <button
          onClick={onToggleHeadlights}
          title={rover.headlights ? 'Headlights: ACTIVE' : 'Headlights: OFF'}
          className={`flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono border transition-all ${
            rover.headlights
              ? 'bg-[#d4ff00] text-[#0c0c0c] border-[#d4ff00] font-black acid-glow'
              : 'bg-[#0a0a0a] text-white/40 border-[#222] hover:text-white'
          }`}
        >
          <Lightbulb className="w-3 h-3" />
          <span className="hidden sm:inline uppercase tracking-wider">LIGHTS</span>
        </button>

        {/* Camera Mode Selector */}
        <div className="flex items-center bg-[#0a0a0a] border border-[#222] p-0.5">
          <button
            onClick={() => onCameraChange('ROVER_FOLLOW')}
            title="Follow Camera (3rd Person)"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              cameraMode === 'ROVER_FOLLOW' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            FOLLOW
          </button>
          <button
            onClick={() => onCameraChange('ROVER_FRONT')}
            title="Cockpit / Front Cam"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              cameraMode === 'ROVER_FRONT' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            HOOD
          </button>
          <button
            onClick={() => onCameraChange('ROVER_REAR')}
            title="Rear Camera"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              cameraMode === 'ROVER_REAR' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            REAR
          </button>
          <button
            onClick={() => onCameraChange('TOP_VIEW')}
            title="Overhead Satellite Cam"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              cameraMode === 'TOP_VIEW' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            TOP
          </button>
          <button
            onClick={() => onCameraChange('FREE')}
            title="Free Orbit Camera"
            className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
              cameraMode === 'FREE' ? 'bg-[#d4ff00] text-[#0c0c0c] font-black' : 'text-white/40 hover:text-white'
            }`}
          >
            FREE
          </button>
        </div>
      </div>
    </footer>
  );
};
