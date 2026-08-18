import React from 'react';
import { PlanetaryConditions, RoverState } from '../types';
import { Thermometer, Gauge, Wind, Eye, ShieldAlert, Navigation, Mountain, Signal } from 'lucide-react';

interface TelemetryHUDProps {
  conditions: PlanetaryConditions;
  rover: RoverState;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ conditions, rover }) => {
  return (
    <aside className="absolute right-6 top-20 z-20 w-56 md:w-60 select-none flex flex-col space-y-2">
      <div className="artistic-panel p-3.5 bg-[#0c0c0c] border border-[#222]">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#d4ff00]" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-black text-white/50">
              ENVIRONMENT
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#d4ff00] font-black tracking-widest animate-pulse">
            LIVE
          </span>
        </div>

        {/* Telemetry Grid */}
        <div className="flex flex-col space-y-2.5 text-xs font-mono">
          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Thermometer className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">TEMP</span>
            </div>
            <span className="font-bold text-[#ffffff]">
              {conditions.temperature > 0 ? `+${conditions.temperature}` : conditions.temperature} °C
            </span>
          </div>

          {/* Gravity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Gauge className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">GRAVITY</span>
            </div>
            <span className="font-bold text-[#ffffff]">{conditions.gravity.toFixed(2)} G</span>
          </div>

          {/* Atmospheric Pressure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Gauge className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">PRESSURE</span>
            </div>
            <span className="font-bold text-[#ffffff]">{conditions.atmosphericPressure.toFixed(2)} ATM</span>
          </div>

          {/* Wind */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Wind className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">WIND</span>
            </div>
            <span className="font-bold text-[#ffffff]">{conditions.windSpeed} km/h</span>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Eye className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">VISIBILITY</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-[#ffffff]">{conditions.visibility}%</span>
              <div className="w-10 h-1 bg-[#1a1a1a] border border-[#333] overflow-hidden">
                <div
                  className="h-full bg-[#d4ff00]"
                  style={{ width: `${conditions.visibility}%` }}
                />
              </div>
            </div>
          </div>

          {/* Radiation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <ShieldAlert className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">RADIATION</span>
            </div>
            <span
              className={`font-bold px-1.5 py-0.2 text-[9px] border tracking-wider uppercase ${
                conditions.radiation === 'LOW'
                  ? 'text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/10'
                  : conditions.radiation === 'MODERATE'
                  ? 'text-[#ffbb00] border-[#ffbb00]/40 bg-[#ffbb00]/10'
                  : 'text-[#ff4433] border-[#ff4433]/40 bg-[#ff4433]/10'
              }`}
            >
              {conditions.radiation}
            </span>
          </div>

          {/* Elevation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Mountain className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">ELEVATION</span>
            </div>
            <span className="font-bold text-[#ffffff]">{conditions.elevation} m</span>
          </div>

          {/* Odometer */}
          <div className="flex items-center justify-between border-t border-[#222] pt-2">
            <div className="flex items-center space-x-2 text-white/40">
              <Navigation className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">ODOMETER</span>
            </div>
            <span className="font-bold text-[#d4ff00]">{rover.distanceTraveled.toFixed(2)} km</span>
          </div>

          {/* Distance to Base */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/40">
              <Signal className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-[10px] tracking-wider uppercase">DIST TO BASE</span>
            </div>
            <span className="font-bold text-[#ffffff]">{rover.distanceToBase} km</span>
          </div>
        </div>

        {/* Subtle decorative bottom line */}
        <div className="mt-3 pt-2 border-t border-[#222] flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest">
          <span>K-01 TELEMETRY</span>
          <div className="w-4 h-[1px] bg-white/20" />
        </div>
      </div>
    </aside>
  );
};
