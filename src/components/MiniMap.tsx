import React from 'react';
import { RoverState, Specimen } from '../types';
import { Maximize2 } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface MiniMapProps {
  rover: RoverState;
  specimens: Specimen[];
  onExpandMap: () => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ rover, specimens, onExpandMap }) => {
  const mapSize = 150;
  const worldRange = 220;

  const toMapCoord = (x: number, z: number) => {
    const normX = (x + worldRange) / (worldRange * 2);
    const normZ = (z + worldRange) / (worldRange * 2);
    return {
      cx: normX * mapSize,
      cy: normZ * mapSize,
    };
  };

  const roverMap = toMapCoord(rover.x, rover.z);
  const baseMap = toMapCoord(0, 0);

  return (
    <div className="absolute right-6 bottom-16 z-20 select-none">
      <div className="artistic-panel p-2.5 flex flex-col items-center bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-[#222] pb-1.5 mb-1.5 text-[9px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-[#d4ff00]" />
            <span className="font-bold text-white uppercase tracking-wider">RADAR</span>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onExpandMap();
            }}
            title="Expand Full Cartography"
            className="text-[#d4ff00] hover:text-white flex items-center space-x-1 transition-colors"
          >
            <span className="text-[8px] uppercase tracking-widest font-black">EXPAND</span>
            <Maximize2 className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Radar Screen */}
        <div
          onClick={() => {
            soundFX.playClick();
            onExpandMap();
          }}
          className="relative w-[150px] h-[150px] bg-[#080808] border border-[#222] cursor-pointer overflow-hidden group"
        >
          {/* Radar Radial Circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[120px] h-[120px] rounded-full border border-white/[0.05]" />
            <div className="w-[80px] h-[80px] rounded-full border border-white/[0.08]" />
            <div className="w-[40px] h-[40px] rounded-full border border-white/[0.12]" />
            <div className="w-full h-[1px] bg-white/[0.05] absolute" />
            <div className="h-full w-[1px] bg-white/[0.05] absolute" />
          </div>

          {/* Animated Radar Sweep Line */}
          <div className="absolute inset-0 pointer-events-none animate-radar-sweep origin-center flex items-center justify-center">
            <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent to-[#d4ff00]/80 absolute right-0" />
          </div>

          {/* Base Marker */}
          <div
            className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 bg-[#ffffff] border border-[#000000] rotate-45"
            style={{ left: `${baseMap.cx}px`, top: `${baseMap.cy}px` }}
            title="Sector 0: Station Nexus"
          />

          {/* Specimen POIs */}
          {specimens.map((sp) => {
            const p = toMapCoord(sp.position[0], sp.position[2]);
            return (
              <div
                key={sp.id}
                className={`absolute w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full ${
                  sp.isAnalyzed ? 'bg-[#ffffff]' : 'bg-[#d4ff00]'
                }`}
                style={{ left: `${p.cx}px`, top: `${p.cy}px` }}
                title={`${sp.code}: ${sp.name}`}
              />
            );
          })}

          {/* Rover Marker & Heading Triangle */}
          <div
            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 flex items-center justify-center transition-all duration-75"
            style={{
              left: `${roverMap.cx}px`,
              top: `${roverMap.cy}px`,
              transform: `rotate(${(-rover.rotationY * 180) / Math.PI}deg)`,
            }}
          >
            <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[8px] border-b-[#d4ff00] acid-glow" />
          </div>

          {/* Range Scale */}
          <div className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-white/40 bg-[#0c0c0c]/90 px-1 py-0.2 border border-[#222]">
            R: 250M
          </div>
        </div>

        {/* Coordinates */}
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-white/30 mt-1.5">
          <span>X: {rover.x.toFixed(0)}</span>
          <span>Z: {rover.z.toFixed(0)}</span>
          <span className="text-[#d4ff00] font-bold">K-01</span>
        </div>
      </div>
    </div>
  );
};
