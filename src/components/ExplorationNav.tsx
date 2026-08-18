import React from 'react';
import { ActiveModal } from '../types';
import { Compass, Map as MapIcon, Radar, Gem, Building2, Flag, ScrollText, BookOpen } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface ExplorationNavProps {
  activeModal: ActiveModal;
  onSelectModal: (modal: ActiveModal) => void;
  scannedCount: number;
  totalSpecimens: number;
}

export const ExplorationNav: React.FC<ExplorationNavProps> = ({
  activeModal,
  onSelectModal,
  scannedCount,
  totalSpecimens,
}) => {
  const navItems = [
    {
      id: null as ActiveModal,
      num: '01',
      label: 'EXPLORE',
      sub: 'Main HUD Viewport',
      icon: Compass,
    },
    {
      id: 'MAP' as ActiveModal,
      num: '02',
      label: 'MAP',
      sub: 'Sectors & Trajectory',
      icon: MapIcon,
    },
    {
      id: 'SCANNER' as ActiveModal,
      num: '03',
      label: 'SCANNER',
      sub: 'Radar Omni-Sweep',
      icon: Radar,
    },
    {
      id: 'SPECIMENS' as ActiveModal,
      num: '04',
      label: 'SPECIMENS',
      sub: `${scannedCount}/${totalSpecimens} Cataloged`,
      icon: Gem,
      badge: scannedCount > 0 ? `${scannedCount}` : undefined,
    },
    {
      id: 'RESEARCH_BASE' as ActiveModal,
      num: '05',
      label: 'RESEARCH BASE',
      sub: 'Station Subsystems',
      icon: Building2,
    },
    {
      id: 'MISSION' as ActiveModal,
      num: '06',
      label: 'MISSION',
      sub: 'Survey Directives',
      icon: Flag,
    },
    {
      id: 'EVENT_LOG' as ActiveModal,
      num: '07',
      label: 'EVENT LOG',
      sub: 'Telemetry Feed',
      icon: ScrollText,
    },
    {
      id: 'SCIENCE_GUIDE' as ActiveModal,
      num: '08',
      label: 'SCIENCE GUIDE',
      sub: 'Exoplanet Compendium',
      icon: BookOpen,
    },
  ];

  return (
    <nav className="absolute left-6 top-20 z-20 flex flex-col space-y-2 w-52 md:w-56">
      <div className="artistic-panel p-2.5 flex flex-col space-y-1 bg-[#0c0c0c] border border-[#222]">
        {/* Header with Artistic Flair Typography */}
        <div className="px-2.5 py-1.5 border-b border-[#222] mb-1.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#d4ff00]" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/40">
              DIRECTORY
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#d4ff00] font-bold">A-07</span>
        </div>

        {navItems.map((item) => {
          const isSelected = activeModal === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => {
                soundFX.playClick();
                onSelectModal(item.id);
              }}
              className={`relative flex items-center space-x-3 px-3 py-2 text-left transition-all group ${
                isSelected
                  ? 'bg-[#d4ff00]/10 border border-[#d4ff00]/40 text-[#ffffff]'
                  : 'hover:bg-white/[0.04] text-white/60 hover:text-white border border-transparent'
              }`}
            >
              {/* Electric Acid Indicator */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d4ff00] acid-glow" />
              )}

              {/* Number Index Indicator */}
              <span
                className={`text-[9px] font-mono tracking-tighter ${
                  isSelected ? 'text-[#d4ff00] font-bold' : 'text-white/20 group-hover:text-white/40'
                }`}
              >
                {item.num}
              </span>

              <Icon
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  isSelected ? 'text-[#d4ff00]' : 'text-white/40 group-hover:text-white/80'
                }`}
              />

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-display font-bold tracking-wider leading-none truncate">
                  {item.label}
                </span>
                <span className="text-[9px] font-mono text-white/30 group-hover:text-white/60 truncate mt-0.5">
                  {item.sub}
                </span>
              </div>

              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/40 shrink-0 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Bottom studio mark */}
        <div className="pt-2 mt-1 border-t border-[#222] px-2 flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/20">
          <span>VNG.SPEC.2024</span>
          <div className="w-6 h-[1px] bg-[#d4ff00] opacity-40" />
        </div>
      </div>
    </nav>
  );
};
