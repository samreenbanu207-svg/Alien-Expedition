import React from 'react';
import { Specimen } from '../types';
import { PLANETARY_REGIONS } from '../utils/terrainNoise';
import { X, CheckCircle2, Atom, Sparkles, Navigation } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface SpecimenDetailModalProps {
  specimen: Specimen;
  onClose: () => void;
  onAnalyze: (specimenId: string) => void;
  onNavigateToSpecimen: (x: number, z: number, name: string) => void;
}

export const SpecimenDetailModal: React.FC<SpecimenDetailModalProps> = ({
  specimen,
  onClose,
  onAnalyze,
  onNavigateToSpecimen,
}) => {
  const region = PLANETARY_REGIONS[specimen.region];

  const handleAnalyzeClick = () => {
    soundFX.playDiscoveryChime();
    onAnalyze(specimen.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-2xl flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <Atom className="w-4 h-4 text-[#d4ff00]" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                SPECIMEN DOSSIER
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // {specimen.code}
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

        {/* Content Body */}
        <div className="p-6 flex flex-col space-y-5 bg-[#0c0c0c]">
          {/* Main Title & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-4 gap-2">
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] font-black text-[#d4ff00]">
                {region.name} • CLASSIFICATION: {specimen.category}
              </div>
              <div className="font-serif-editorial italic text-3xl font-bold text-white tracking-wider mt-1">
                {specimen.name}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase ${
                  specimen.rarity === 'ANOMALOUS'
                    ? 'text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/10'
                    : specimen.rarity === 'RARE'
                    ? 'text-white border-white/40 bg-white/10'
                    : 'text-white/70 border-white/20 bg-white/5'
                }`}
              >
                {specimen.rarity}
              </span>

              {specimen.isAnalyzed ? (
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 border text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/15 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ANALYZED</span>
                </span>
              ) : (
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 border text-white/50 border-white/20 bg-white/5">
                  PENDING SCAN
                </span>
              )}
            </div>
          </div>

          {/* Specimen Description */}
          <p className="text-xs text-white/70 leading-relaxed font-sans">
            {specimen.description}
          </p>

          {/* Scientific Parameter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="bg-[#080808] p-3 border border-[#222]">
              <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">COMPOSITION</div>
              <div className="text-white font-semibold mt-1">{specimen.composition}</div>
            </div>

            <div className="bg-[#080808] p-3 border border-[#222]">
              <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">THERMAL SIGNATURE</div>
              <div className="text-white font-semibold mt-1">{specimen.thermalSignature}</div>
            </div>

            <div className="bg-[#080808] p-3 border border-[#222]">
              <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">RADIATION PROFILE</div>
              <div className="text-white font-semibold mt-1">{specimen.radiationLevel}</div>
            </div>

            <div className="bg-[#080808] p-3 border border-[#222]">
              <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">MASS DENSITY</div>
              <div className="text-white font-semibold mt-1">{specimen.density}</div>
            </div>
          </div>

          {/* Scientific Significance */}
          <div className="bg-[#080808] p-4 border-l-2 border-[#d4ff00] text-xs">
            <div className="text-[8px] uppercase tracking-[0.2em] font-black text-[#d4ff00] mb-1">
              SCIENTIFIC SIGNIFICANCE
            </div>
            <div className="text-white/70 leading-relaxed">{specimen.scientificValue}</div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-[#222]">
            <button
              onClick={() => {
                onNavigateToSpecimen(specimen.position[0], specimen.position[2], specimen.name);
                onClose();
              }}
              className="px-4 py-2.5 bg-[#0a0a0a] hover:bg-white/5 border border-[#222] hover:border-white/40 text-white text-xs font-mono flex items-center space-x-2 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>LOCK WAYPOINT</span>
            </button>

            {!specimen.isAnalyzed ? (
              <button
                onClick={handleAnalyzeClick}
                className="px-5 py-2.5 bg-[#d4ff00] hover:bg-[#b5db00] text-[#0c0c0c] text-xs font-display font-black tracking-widest uppercase flex items-center space-x-2 transition-colors acid-glow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>CATALOG IN ARCHIVE</span>
              </button>
            ) : (
              <div className="text-[11px] font-mono text-[#d4ff00] flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>CATALOGED IN ARCHIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
