import React from 'react';
import { MissionStage, RoverState } from '../types';
import { X, Flag, CheckCircle2, Circle } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface MissionTimelineModalProps {
  stages: MissionStage[];
  rover: RoverState;
  onClose: () => void;
}

export const MissionTimelineModal: React.FC<MissionTimelineModalProps> = ({
  stages,
  rover,
  onClose,
}) => {
  const completedCount = stages.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <Flag className="w-4 h-4 text-[#d4ff00]" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                SURVEY DIRECTIVES
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // First Contact Timeline K-01
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

        {/* Progress Header */}
        <div className="bg-[#080808] p-5 border-b border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">OBJECTIVE COMPLETION</div>
            <div className="font-serif-editorial italic text-2xl font-bold text-white tracking-wider mt-0.5">
              {completedCount} OF {stages.length} DIRECTIVES COMPLETED ({progressPercent}%)
            </div>
          </div>

          <div className="w-full sm:w-52 h-2 bg-[#1a1a1a] border border-[#333] overflow-hidden">
            <div
              className="h-full bg-[#d4ff00] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timeline Stages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-[#0c0c0c] bg-dot-matrix">
          {stages.map((stage) => {
            return (
              <div
                key={stage.id}
                className={`p-4 border transition-all flex items-start space-x-4 ${
                  stage.completed
                    ? 'bg-[#080808]/90 border-white/20 text-white'
                    : stage.current
                    ? 'bg-[#d4ff00]/10 border-[#d4ff00] text-white acid-glow'
                    : 'bg-[#080808]/40 border-[#222] text-white/40'
                }`}
              >
                {/* Stage Icon */}
                <div className="mt-0.5 shrink-0">
                  {stage.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#d4ff00]" />
                  ) : stage.current ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#d4ff00] flex items-center justify-center">
                      <span className="w-2 h-2 bg-[#d4ff00] rounded-full animate-ping" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-white/20" />
                  )}
                </div>

                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-xs font-mono font-bold ${
                          stage.completed
                            ? 'text-[#d4ff00]'
                            : stage.current
                            ? 'text-[#d4ff00]'
                            : 'text-white/30'
                        }`}
                      >
                        STAGE {stage.stageCode}
                      </span>
                      <span className="font-serif-editorial italic text-base font-bold tracking-wider">
                        {stage.title}
                      </span>
                    </div>

                    {stage.completed && (
                      <span className="text-[8px] font-mono px-2 py-0.5 bg-white/10 text-white border border-white/20 uppercase">
                        COMPLETED
                      </span>
                    )}
                    {stage.current && (
                      <span className="text-[8px] font-mono px-2 py-0.5 bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/40 animate-pulse font-bold uppercase">
                        ACTIVE DIRECTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-sans">
                    {stage.objective}
                  </p>

                  <div className="text-[10px] font-mono text-white/40 mt-2.5 flex items-center space-x-1.5">
                    <span className="text-white/30">HINT:</span>
                    <span className={stage.current ? 'text-[#d4ff00]' : 'text-white/60'}>
                      {stage.hint}
                    </span>
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
