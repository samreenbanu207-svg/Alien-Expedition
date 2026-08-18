import React, { useState } from 'react';
import { BaseSubsystem } from '../types';
import { X, Building2, ShieldCheck, Activity, Zap } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface ResearchBaseModalProps {
  onClose: () => void;
  onNavigateToBase: () => void;
}

const SUBSYSTEMS: BaseSubsystem[] = [
  {
    id: 'solar-array',
    name: 'Primary Solar Array Wings',
    status: 'OPERATIONAL',
    efficiency: 78,
    condition: 'Weathered / Minor Ferric Dust Accumulation',
    powerDraw: '+142 kW (Generation)',
    telemetryData: {
      'Photovoltaic Yield': '78.4%',
      'Tracking Axis': 'Elevation 34°, Azimuth 112°',
      'Surface Cell Temp': '32.1 °C',
      'Dust Occlusion': '12.6%',
    },
    description: 'Dual multi-junction gallium-arsenide solar tracking wings providing auxiliary power generation to the central habitat.',
  },
  {
    id: 'comm-array',
    name: 'High-Gain Deep Space Relay',
    status: 'OPERATIONAL',
    efficiency: 94,
    condition: 'Optimal / Structural Integrity 99%',
    powerDraw: '24 kW',
    telemetryData: {
      'Orbital Satellite Link': 'Locked (Kepler Relay 4)',
      'Signal Carrier Frequency': '8.44 GHz (X-Band)',
      'Data Throughput': '140 Mbps',
      'Bit Error Rate': '1.2e-7',
    },
    description: '14-meter parabolic dish maintaining synchronized telecommunications between Planet A-07 base, exploration rover, and orbital mothership.',
  },
  {
    id: 'lab-module',
    name: 'Xenobiological Analysis Lab',
    status: 'STANDBY',
    efficiency: 88,
    condition: 'Pressurized / Cryo-Cooling Active',
    powerDraw: '45 kW',
    telemetryData: {
      'Spectrometer Laser': 'Calibrated (Nd:YAG 1064nm)',
      'Bio-Containment': 'Level 4 Sealed',
      'Chamber Pressure': '1.00 ATM (Earth Normal)',
      'Automated Centrifuges': 'Idle',
    },
    description: 'Hermetically sealed laboratory equipped with mass spectrometers, electron microscopes, and sterile containment autoclaves.',
  },
  {
    id: 'rover-bay',
    name: 'Rover Bay & Magnetic Induction Dock',
    status: 'OPERATIONAL',
    efficiency: 99,
    condition: 'Operational / Ready for Docking',
    powerDraw: '18 kW (Standby)',
    telemetryData: {
      'Induction Coil Voltage': '480V RMS',
      'Charging Interface': 'Wireless Resonant Coupling',
      'Telemetry Diagnostic Port': 'Active',
      'Automated Dust Washers': 'Ready',
    },
    description: 'Reinforced ground platform designed for autonomous rover docking, rapid battery recharging, and mechanical diagnostics.',
  },
  {
    id: 'power-core',
    name: 'Sub-surface Geothermal Generator',
    status: 'OPERATIONAL',
    efficiency: 92,
    condition: 'Stable / Heat Exchanger Nominal',
    powerDraw: '+380 kW (Baseload)',
    telemetryData: {
      'Borehole Core Temp': '284 °C',
      'Turbine RPM': '12,400',
      'Coolant Loop Flow': '42 L/min',
      'Thermal Efficiency': '34.2%',
    },
    description: 'Deep borehole closed-loop binary geothermal plant tapping into Planet A-07 sub-crustal volcanic heat gradient.',
  },
];

export const ResearchBaseModal: React.FC<ResearchBaseModalProps> = ({
  onClose,
  onNavigateToBase,
}) => {
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string>('solar-array');

  const selected = SUBSYSTEMS.find((s) => s.id === selectedSubsystemId) || SUBSYSTEMS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-4xl h-[82vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <Building2 className="w-4 h-4 text-[#d4ff00]" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                RESEARCH FACILITY
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // Sector 0 Station Nexus Subsystems
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

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0c0c0c]">
          {/* Left Subsystem Navigation */}
          <div className="w-full md:w-72 bg-[#080808] p-4 border-b md:border-b-0 md:border-r border-[#222] flex flex-col space-y-1.5 overflow-y-auto">
            <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30 px-2 py-1 border-b border-[#222] mb-1">
              FACILITY MODULES
            </div>

            {SUBSYSTEMS.map((sub, idx) => {
              const isSelected = selectedSubsystemId === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedSubsystemId(sub.id);
                  }}
                  className={`p-3 text-left border transition-all flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-[#d4ff00]/10 border-[#d4ff00] text-white'
                      : 'bg-[#0c0c0c] border-[#222] hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono text-white/30">0{idx + 1}</span>
                      <span className="text-xs font-display font-bold tracking-wider leading-none">
                        {sub.name}
                      </span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/30 pl-5">
                    <span>{sub.status}</span>
                    <span className="text-[#d4ff00] font-bold">{sub.efficiency}% EFF</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Subsystem Inspection Inspector */}
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-[#0c0c0c]">
            <div>
              {/* Module Title */}
              <div className="border-b border-[#222] pb-3 mb-4">
                <div className="flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-black text-[#d4ff00]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>DIAGNOSTIC TELEMETRY</span>
                </div>
                <div className="font-serif-editorial italic text-2xl font-bold text-white tracking-wider mt-1">
                  {selected.name}
                </div>
                <div className="text-xs font-mono text-[#d4ff00] mt-1 flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>STATUS: {selected.status} ({selected.efficiency}% EFFICIENCY)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/70 leading-relaxed mb-4 font-sans">
                {selected.description}
              </p>

              {/* Condition & Power Draw */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono mb-4">
                <div className="bg-[#080808] p-3.5 border border-[#222]">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">PHYSICAL CONDITION</span>
                  <div className="text-white font-semibold mt-1">{selected.condition}</div>
                </div>

                <div className="bg-[#080808] p-3.5 border border-[#222]">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">POWER METRIC</span>
                  <div className="text-[#d4ff00] font-semibold mt-1">{selected.powerDraw}</div>
                </div>
              </div>

              {/* Real-time Telemetry Data Table */}
              <div className="bg-[#080808] p-4 border border-[#222]">
                <div className="text-[9px] uppercase tracking-[0.2em] font-black text-[#d4ff00] mb-3">
                  MODULE TELEMETRY VALUES
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {Object.entries(selected.telemetryData).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center border-b border-[#222] pb-1.5">
                      <span className="text-white/50">{key}:</span>
                      <span className="text-white font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#222] flex items-center justify-between mt-4">
              <span className="text-[10px] font-mono text-white/30">
                STATION COORDINATES: X: 0.0, Z: 0.0
              </span>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onNavigateToBase();
                  onClose();
                }}
                className="px-5 py-2.5 bg-[#d4ff00] hover:bg-[#b5db00] text-[#0c0c0c] font-display font-black text-xs tracking-widest uppercase flex items-center space-x-2 transition-all acid-glow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>NAVIGATE ROVER TO DOCK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
