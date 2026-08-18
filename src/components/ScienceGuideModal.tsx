import React, { useState } from 'react';
import { X, BookOpen, Globe2, Wind, Sparkles, Cpu, Satellite, AlertTriangle } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface ScienceGuideModalProps {
  onClose: () => void;
}

const GUIDE_SECTIONS = [
  {
    id: 'geology',
    title: 'Extraterrestrial Geology',
    icon: Globe2,
    content: `
### Crustal Differentiation & Mineralogy
Planet A-07 features a differentiated planetary crust dominated by ultra-mafic basaltic bedrock and aeolian ferric regolith. In Sector 2 (Prismatic Basin), hydrothermal silicon dioxide fluids cooled under low-gravity conditions (0.82 G), yielding giant hexagonal monolithic quartz-beryllium prisms.

### Sub-Crustal Tectonics
Unlike Earth's active plate boundaries, A-07 exhibits 'stagnant lid' convective plumes that vent localized geothermal magma fissures directly to the surface in Sector 4 (Obsidian Rift).
    `,
  },
  {
    id: 'atmosphere',
    title: 'Planetary Atmosphere & Weather',
    icon: Wind,
    content: `
### Atmospheric Composition
Planet A-07 maintains a rarefied atmosphere of 0.91 ATM (at datum level). The primary composition includes 72% Nitrogen, 19% Carbon Dioxide, 6% Argon, and 3% trace Volatile Hydrocarbons.

### Rayleigh Scattering & Coloration
Suspended ferric oxide (Fe2O3) aerosol particles scatter sunlight into warm amber and ochre wavelengths during daytime, shifting into deep copper-vermilion at sunset.
    `,
  },
  {
    id: 'ecosystems',
    title: 'Alien Ecosystems & Xenobiology',
    icon: Sparkles,
    content: `
### Non-Photosynthetic Chemotrophs
Sector 3 (Phosphor Glade) harbors extensive mycelial ecosystems that derive metabolic energy from subsurface sulfur reduction and volatile hydrocarbon absorption rather than solar photosynthesis.

### Cold Bioluminescence
Alien flora synthesize luciferase-analogous enzymes that trigger cold chemiluminescence (520–580 nm) upon exposure to darkness, attracting aerial spore vectors and minimizing radiant thermal dissipation.
    `,
  },
  {
    id: 'rover-tech',
    title: 'Exploration Rover Engineering',
    icon: Cpu,
    content: `
### Articulated Rocker-Bogie Mobility
The 6-wheel articulated chassis distributes ground pressure evenly over undulating dunes and volcanic crags, allowing obstacle climbing up to 1.5 times wheel diameter without tipping.

### Spectrometry & In-Situ Remote Sensing
The mast-mounted dual stereoscopic optics pair with a pulsed Nd:YAG laser to ionize target rock surfaces, enabling instantaneous atomic emission spectroscopy (LIBS).
    `,
  },
  {
    id: 'remote-sensing',
    title: 'Satellite Uplink & Telemetry',
    icon: Satellite,
    content: `
### Three-Hop Telecommunications Architecture
Telemetry travels from Exploration Rover [K-01] -> Sector 0 Base Nexus Ground Relay -> Kepler-186X Orbital Relay Satellite -> Earth Ground Stations. Signal attenuation is dynamically modulated by atmospheric dust density and distance.
    `,
  },
];

export const ScienceGuideModal: React.FC<ScienceGuideModalProps> = ({ onClose }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('geology');

  const activeSection = GUIDE_SECTIONS.find((s) => s.id === selectedSectionId) || GUIDE_SECTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-4xl h-[82vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-4 h-4 text-[#d4ff00]" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                SCIENCE COMPENDIUM
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // Academic Planetary Reference
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

        {/* Disclaimer Banner */}
        <div className="bg-[#080808] px-6 py-2.5 border-b border-[#222] flex items-center space-x-2.5 text-[10px] font-mono text-[#d4ff00]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span className="tracking-wide">
            SIMULATION / EDUCATIONAL PROJECT: PLANET A-07 IS A FICTIONAL PLANETARY MODEL. ENVIRONMENTAL VALUES AND SPECIMEN DATA ARE SIMULATED.
          </span>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0c0c0c]">
          {/* Section Navigation */}
          <div className="w-full md:w-64 bg-[#080808] p-4 border-b md:border-b-0 md:border-r border-[#222] flex flex-col space-y-1 overflow-y-auto">
            <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30 px-2 py-1 border-b border-[#222] mb-1">
              TOPICS
            </div>

            {GUIDE_SECTIONS.map((sec, idx) => {
              const isSelected = selectedSectionId === sec.id;
              const Icon = sec.icon;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedSectionId(sec.id);
                  }}
                  className={`p-3 text-left border flex items-center space-x-3 transition-all ${
                    isSelected
                      ? 'bg-[#d4ff00]/10 border-[#d4ff00] text-white'
                      : 'bg-[#0c0c0c] border-[#222] hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#d4ff00]' : 'text-white/30'}`} />
                  <span className="text-xs font-display font-bold tracking-wider leading-none truncate">
                    {sec.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section Body */}
          <div className="flex-1 p-8 overflow-y-auto bg-[#0c0c0c] text-white/70 leading-relaxed text-xs">
            <div className="font-serif-editorial italic text-3xl font-bold text-white tracking-wider border-b border-[#222] pb-3 mb-5">
              {activeSection.title}
            </div>

            <div className="space-y-4 font-sans">
              {activeSection.content.split('\n\n').filter(Boolean).map((block, idx) => {
                if (block.startsWith('### ')) {
                  const lines = block.split('\n');
                  const heading = lines[0].replace('### ', '');
                  const body = lines.slice(1).join(' ');
                  return (
                    <div key={idx} className="bg-[#080808] p-5 border border-[#222]">
                      <div className="text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-wider mb-2">
                        {heading}
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {body}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-xs text-white/80 leading-relaxed">
                    {block}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
