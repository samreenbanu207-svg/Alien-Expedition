import React, { useState } from 'react';
import { Specimen } from '../types';
import { PLANETARY_REGIONS } from '../utils/terrainNoise';
import { X, Gem, CheckCircle2, Lock } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface DiscoveryLogModalProps {
  specimens: Specimen[];
  onClose: () => void;
  onSelectSpecimen: (specimen: Specimen) => void;
}

export const DiscoveryLogModal: React.FC<DiscoveryLogModalProps> = ({
  specimens,
  onClose,
  onSelectSpecimen,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', 'MINERAL', 'FLORA', 'GEOLOGY', 'ARTIFACT', 'ENERGY', 'RELIC'];

  const filtered = filterCategory === 'ALL'
    ? specimens
    : specimens.filter((s) => s.category === filterCategory);

  const analyzedCount = specimens.filter((s) => s.isAnalyzed).length;
  const progressPercent = Math.round((analyzedCount / specimens.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-4xl h-[82vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <Gem className="w-4 h-4 text-[#d4ff00]" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                DISCOVERY LOG
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // Planetary Specimen Catalog
              </span>
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

        {/* Progress Bar & Filter Row */}
        <div className="bg-[#080808] p-4 border-b border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="text-xs font-mono">
              <span className="text-white/40">SURVEY COMPLETION: </span>
              <span className="text-[#d4ff00] font-bold">{analyzedCount} / {specimens.length} ({progressPercent}%)</span>
            </div>
            <div className="w-32 h-1.5 bg-[#1a1a1a] border border-[#333] overflow-hidden">
              <div
                className="h-full bg-[#d4ff00] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFX.playClick();
                  setFilterCategory(cat);
                }}
                className={`px-2.5 py-1 text-[9px] font-mono border uppercase tracking-wider transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#d4ff00] text-[#0c0c0c] border-[#d4ff00] font-black'
                    : 'bg-[#0a0a0a] text-white/50 border-[#222] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Specimen Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[#0c0c0c] bg-dot-matrix">
          {filtered.map((sp) => {
            const reg = PLANETARY_REGIONS[sp.region];

            return (
              <div
                key={sp.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectSpecimen(sp);
                }}
                className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                  sp.isAnalyzed
                    ? 'bg-[#080808]/90 border-white/20 hover:border-white/50'
                    : 'bg-[#080808]/60 border-[#222] hover:border-[#d4ff00]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#d4ff00]">
                      {sp.code}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">
                        {reg.name.split(':')[1] || reg.name}
                      </span>
                      {sp.isAnalyzed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-white/20" />
                      )}
                    </div>
                  </div>

                  <div className="font-serif-editorial italic text-lg font-bold text-white tracking-wider mt-1">
                    {sp.name}
                  </div>

                  <p className="text-xs text-white/60 mt-1 line-clamp-2 font-sans">
                    {sp.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#222] pt-2.5 mt-3.5 text-[10px] font-mono">
                  <span className="text-white/40">
                    CATEGORY: <strong className="text-white/80">{sp.category}</strong>
                  </span>
                  <span className="text-[#d4ff00] hover:underline font-bold uppercase tracking-wider text-[9px]">
                    INSPECT INTEL →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
