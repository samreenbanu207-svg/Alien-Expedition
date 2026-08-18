import React, { useState } from 'react';
import { RegionId, RegionInfo, RoverState, Specimen } from '../types';
import { PLANETARY_REGIONS } from '../utils/terrainNoise';
import { X, Navigation } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface PlanetaryMapModalProps {
  rover: RoverState;
  specimens: Specimen[];
  onClose: () => void;
  onNavigate: (x: number, z: number, name: string) => void;
  onCancelAutopilot: () => void;
}

export const PlanetaryMapModal: React.FC<PlanetaryMapModalProps> = ({
  rover,
  specimens,
  onClose,
  onNavigate,
  onCancelAutopilot,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>('RESEARCH_BASE');
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string | null>(null);

  const selectedRegion: RegionInfo = PLANETARY_REGIONS[selectedRegionId];
  const selectedSpecimen = specimens.find((s) => s.id === selectedSpecimenId);

  const mapCanvasSize = 460;
  const worldRange = 220;

  const toMapCoord = (x: number, z: number) => {
    const normX = (x + worldRange) / (worldRange * 2);
    const normZ = (z + worldRange) / (worldRange * 2);
    return {
      cx: normX * mapCanvasSize,
      cy: normZ * mapCanvasSize,
    };
  };

  const roverMap = toMapCoord(rover.x, rover.z);

  const handleRegionClick = (id: RegionId) => {
    soundFX.playClick();
    setSelectedRegionId(id);
    setSelectedSpecimenId(null);
  };

  const handleSpecimenClick = (sp: Specimen) => {
    soundFX.playClick();
    setSelectedSpecimenId(sp.id);
    setSelectedRegionId(sp.region);
  };

  const handleStartNavigation = () => {
    if (selectedSpecimen) {
      onNavigate(selectedSpecimen.position[0], selectedSpecimen.position[2], selectedSpecimen.name);
      onClose();
    } else {
      const region = PLANETARY_REGIONS[selectedRegionId];
      onNavigate(region.center[0], region.center[1], region.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header with Artistic Flair Serif */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#d4ff00] rotate-45 acid-glow" />
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                  CARTOGRAPHY
                </span>
                <span className="font-serif-editorial italic text-base text-white tracking-wider">
                  // Topographical Grid K-01
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 border border-[#222] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left / Center: Interactive Map Canvas */}
          <div className="flex-1 bg-[#080808] p-6 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-[#222] bg-dot-matrix">
            <div className="relative w-full max-w-[460px] aspect-square bg-[#0c0c0c] border border-[#222] overflow-hidden shadow-2xl">
              {/* Radial Range Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[360px] h-[360px] rounded-full border border-white/[0.04]" />
                <div className="w-[260px] h-[260px] rounded-full border border-white/[0.06]" />
                <div className="w-[160px] h-[160px] rounded-full border border-white/[0.08]" />
                <div className="w-[60px] h-[60px] rounded-full border border-white/[0.12]" />
                <div className="w-full h-[1px] bg-white/[0.06] absolute" />
                <div className="h-full w-[1px] bg-white/[0.06] absolute" />
              </div>

              {/* Biome Region Boundaries */}
              {Object.values(PLANETARY_REGIONS).map((reg) => {
                const center = toMapCoord(reg.center[0], reg.center[1]);
                const isSelected = selectedRegionId === reg.id;
                const radiusPx = (reg.radius / (worldRange * 2)) * mapCanvasSize;

                return (
                  <div
                    key={reg.id}
                    onClick={() => handleRegionClick(reg.id)}
                    className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 flex items-center justify-center group ${
                      isSelected
                        ? 'bg-[#d4ff00]/15 border-2 border-[#d4ff00] acid-glow'
                        : 'bg-white/[0.02] border border-white/10 hover:bg-[#d4ff00]/5 hover:border-[#d4ff00]/40'
                    }`}
                    style={{
                      left: `${center.cx}px`,
                      top: `${center.cy}px`,
                      width: `${radiusPx * 2}px`,
                      height: `${radiusPx * 2}px`,
                    }}
                  >
                    <span
                      className={`text-[9px] font-display font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0c0c0c]/90 border transition-colors ${
                        isSelected
                          ? 'text-[#d4ff00] border-[#d4ff00]'
                          : 'text-white/40 border-[#222] group-hover:text-white'
                      }`}
                    >
                      {reg.name.split(':')[1] || reg.name}
                    </span>
                  </div>
                );
              })}

              {/* Specimen POI Markers */}
              {specimens.map((sp) => {
                const pos = toMapCoord(sp.position[0], sp.position[2]);
                const isSelected = selectedSpecimenId === sp.id;

                return (
                  <button
                    key={sp.id}
                    onClick={() => handleSpecimenClick(sp)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center transition-transform hover:scale-125 z-10 ${
                      isSelected ? 'scale-125' : ''
                    }`}
                    style={{ left: `${pos.cx}px`, top: `${pos.cy}px` }}
                    title={`${sp.code}: ${sp.name}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full border ${
                        sp.isAnalyzed
                          ? 'bg-[#ffffff] border-[#d4ff00]'
                          : isSelected
                          ? 'bg-[#d4ff00] border-white animate-ping'
                          : 'bg-[#d4ff00] border-[#000000]'
                      }`}
                    />
                  </button>
                );
              })}

              {/* Live Rover Heading Triangle */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center transition-all duration-100"
                style={{
                  left: `${roverMap.cx}px`,
                  top: `${roverMap.cy}px`,
                }}
              >
                <div
                  className="w-4 h-4 flex items-center justify-center"
                  style={{ transform: `rotate(${(-rover.rotationY * 180) / Math.PI}deg)` }}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[10px] border-b-[#d4ff00] acid-glow" />
                </div>
                <div className="absolute -top-4 whitespace-nowrap px-1.5 py-0.2 bg-[#0c0c0c] border border-[#d4ff00]/60 text-[8px] font-mono text-[#d4ff00]">
                  ROVER [K-01]
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Region / Specimen Intelligence Panel */}
          <div className="w-full md:w-84 bg-[#0c0c0c] p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Region / Specimen Title */}
              <div className="border-b border-[#222] pb-3 mb-4">
                <div className="text-[9px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                  {selectedSpecimen ? 'SPECIMEN TARGET' : 'SECTOR INTELLIGENCE'}
                </div>
                <div className="font-serif-editorial italic text-2xl font-bold text-white tracking-wider mt-1">
                  {selectedSpecimen ? selectedSpecimen.name : selectedRegion.name}
                </div>
                <div className="text-xs font-mono text-white/40 mt-1">
                  {selectedSpecimen ? `CODE: ${selectedSpecimen.code}` : selectedRegion.subtitle}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/60 leading-relaxed mb-4 font-sans">
                {selectedSpecimen ? selectedSpecimen.description : selectedRegion.description}
              </p>

              {/* Sector Data Grid */}
              <div className="flex flex-col space-y-2 text-xs font-mono bg-[#080808] p-3.5 border border-[#222] mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40">DANGER LEVEL:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 text-[9px] border uppercase ${
                      selectedRegion.dangerLevel === 'MINIMAL'
                        ? 'text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/10'
                        : selectedRegion.dangerLevel === 'LOW'
                        ? 'text-white/60 border-white/20 bg-white/5'
                        : selectedRegion.dangerLevel === 'ELEVATED'
                        ? 'text-[#ffbb00] border-[#ffbb00]/40 bg-[#ffbb00]/10'
                        : 'text-[#ff4433] border-[#ff4433]/40 bg-[#ff4433]/10'
                    }`}
                  >
                    {selectedRegion.dangerLevel}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/40">AVG TEMP:</span>
                  <span className="text-white font-bold">+{selectedRegion.baseTemp} °C</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/40">PRESSURE:</span>
                  <span className="text-white font-bold">{selectedRegion.basePressure} ATM</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/40">COORDINATES:</span>
                  <span className="text-[#d4ff00] font-bold">
                    X: {selectedRegion.center[0]}, Z: {selectedRegion.center[1]}
                  </span>
                </div>
              </div>

              {/* Geological Notes */}
              <div className="text-[11px] text-white/60 bg-[#080808] p-3 border-l-2 border-[#d4ff00]">
                <div className="text-[8px] uppercase tracking-[0.2em] font-black text-[#d4ff00] mb-1">
                  GEOLOGICAL SUMMARY
                </div>
                {selectedRegion.geologicalNotes}
              </div>
            </div>

            {/* Actions: Navigate */}
            <div className="pt-4 border-t border-[#222] flex flex-col space-y-2 mt-4">
              <button
                onClick={handleStartNavigation}
                className="w-full py-3 bg-[#d4ff00] hover:bg-[#b5db00] text-[#0c0c0c] font-display font-black text-xs tracking-widest uppercase flex items-center justify-center space-x-2 transition-all acid-glow"
              >
                <Navigation className="w-4 h-4" />
                <span>
                  {selectedSpecimen
                    ? `NAVIGATE TO ${selectedSpecimen.code}`
                    : `SET AUTOPILOT TRAJECTORY`}
                </span>
              </button>

              {rover.isAutopilot && (
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onCancelAutopilot();
                  }}
                  className="w-full py-2 bg-[#0a0a0a] hover:bg-[#ff4433]/20 border border-[#ff4433]/40 text-[#ff4433] font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  ABORT AUTOPILOT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
