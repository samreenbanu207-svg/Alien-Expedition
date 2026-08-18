import React, { useState, useEffect } from 'react';
import { RoverState, Specimen } from '../types';
import { X, Radar, Target, CheckCircle2, Zap } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface ScannerOverlayProps {
  rover: RoverState;
  specimens: Specimen[];
  onClose: () => void;
  onSelectSpecimen: (specimen: Specimen) => void;
  onAnalyzeSpecimen: (specimenId: string) => void;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  rover,
  specimens,
  onClose,
  onSelectSpecimen,
  onAnalyzeSpecimen,
}) => {
  const [scanningSpecimenId, setScanningSpecimenId] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const specimensWithDist = specimens.map((sp) => {
    const dx = sp.position[0] - rover.x;
    const dz = sp.position[2] - rover.z;
    const distanceMeters = Math.round(Math.sqrt(dx * dx + dz * dz) * 10);
    return { ...sp, distanceMeters };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  useEffect(() => {
    if (!scanningSpecimenId) return;

    soundFX.playScanBeep();
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          soundFX.playDiscoveryChime();
          onAnalyzeSpecimen(scanningSpecimenId);
          const scanned = specimens.find((s) => s.id === scanningSpecimenId);
          if (scanned) onSelectSpecimen(scanned);
          setScanningSpecimenId(null);
          return 100;
        }
        return prev + 20;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [scanningSpecimenId]);

  const handleStartScan = (sp: Specimen) => {
    soundFX.playClick();
    setScanningSpecimenId(sp.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <Radar className="w-4 h-4 text-[#d4ff00] animate-spin" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                OMNI-SCANNER
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // Spectral Resonance Sensor Array
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

        {/* Scan Status Summary */}
        <div className="bg-[#080808] px-6 py-2.5 border-b border-[#222] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-white/40">IN RANGE: </span>
              <span className="text-[#d4ff00] font-bold">
                {specimensWithDist.filter((s) => s.distanceMeters < 3000).length} DETECTED
              </span>
            </div>
            <div>
              <span className="text-white/40">ANALYZED: </span>
              <span className="text-white font-bold">
                {specimens.filter((s) => s.isAnalyzed).length} / {specimens.length}
              </span>
            </div>
          </div>
          <div className="text-white/40">
            ROVER COORDS: <span className="text-[#d4ff00]">X:{rover.x.toFixed(0)}, Z:{rover.z.toFixed(0)}</span>
          </div>
        </div>

        {/* Specimen Detection List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#0c0c0c] bg-dot-matrix">
          {specimensWithDist.map((sp) => {
            const isScanningThis = scanningSpecimenId === sp.id;

            return (
              <div
                key={sp.id}
                className={`p-4 border transition-all ${
                  isScanningThis
                    ? 'bg-[#d4ff00]/10 border-[#d4ff00] acid-glow'
                    : sp.isAnalyzed
                    ? 'bg-[#080808]/90 border-white/20 hover:border-white/40'
                    : 'bg-[#080808]/90 border-[#222] hover:border-[#d4ff00]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`p-2 border mt-0.5 ${
                        sp.isAnalyzed
                          ? 'border-white/30 bg-white/5 text-white'
                          : 'border-[#d4ff00]/40 bg-[#d4ff00]/10 text-[#d4ff00]'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-mono font-bold text-[#d4ff00]">
                          {sp.code}
                        </span>
                        <span className="font-serif-editorial italic text-base font-bold text-white tracking-wider">
                          {sp.name}
                        </span>
                        <span
                          className={`text-[8px] font-mono px-2 py-0.2 border uppercase font-bold ${
                            sp.category === 'MINERAL'
                              ? 'text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/10'
                              : sp.category === 'FLORA'
                              ? 'text-white border-white/40 bg-white/10'
                              : sp.category === 'ARTIFACT'
                              ? 'text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/10'
                              : 'text-white/80 border-white/30 bg-white/5'
                          }`}
                        >
                          {sp.category}
                        </span>
                      </div>

                      <div className="text-xs text-white/60 mt-1 line-clamp-1">
                        {sp.description}
                      </div>

                      <div className="flex items-center space-x-4 text-[10px] font-mono text-white/30 mt-1.5">
                        <span>DIST: <strong className="text-white">{sp.distanceMeters} m</strong></span>
                        <span>THERMAL: <strong className="text-white/70">{sp.thermalSignature.split(' ')[0]} °C</strong></span>
                        <span>RAD: <strong className="text-white/70">{sp.radiationLevel.split(' ')[0]} mSv/h</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 shrink-0 sm:self-center">
                    {sp.isAnalyzed ? (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onSelectSpecimen(sp);
                        }}
                        className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-display font-bold tracking-wider flex items-center space-x-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VIEW ARCHIVE</span>
                      </button>
                    ) : isScanningThis ? (
                      <div className="flex flex-col items-end min-w-[140px]">
                        <span className="text-[10px] font-mono text-[#d4ff00] font-bold animate-pulse">
                          SPECTRAL SCAN... {scanProgress}%
                        </span>
                        <div className="w-full h-1.5 bg-[#1a1a1a] border border-[#d4ff00]/40 mt-1 overflow-hidden">
                          <div
                            className="h-full bg-[#d4ff00] transition-all duration-200"
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartScan(sp)}
                        className="px-4 py-2 bg-[#d4ff00] hover:bg-[#b5db00] text-[#0c0c0c] font-display font-black text-xs tracking-wider flex items-center space-x-1.5 transition-colors acid-glow"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>ANALYZE</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
