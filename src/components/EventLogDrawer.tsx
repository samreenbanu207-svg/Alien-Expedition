import React from 'react';
import { LogEntry } from '../types';
import { X, Terminal } from 'lucide-react';
import { soundFX } from '../audio/soundFX';

interface EventLogDrawerProps {
  logs: LogEntry[];
  onClose: () => void;
}

export const EventLogDrawer: React.FC<EventLogDrawerProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="artistic-panel w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden bg-[#0c0c0c] border border-[#222]">
        {/* Header */}
        <div className="h-14 border-b border-[#222] px-6 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center space-x-3">
            <Terminal className="w-4 h-4 text-[#d4ff00]" />
            <div className="flex items-baseline space-x-2">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d4ff00]">
                TELEMETRY LOG
              </span>
              <span className="font-serif-editorial italic text-base text-white tracking-wider">
                // Real-Time Event Downlink
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

        {/* Live Feed Header */}
        <div className="bg-[#080808] px-6 py-2.5 border-b border-[#222] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-ping" />
            <span className="text-white tracking-wider">TELEMETRY LINK SYNCHRONIZED</span>
          </div>
          <span className="text-white/40">TOTAL RECORDS: {logs.length}</span>
        </div>

        {/* Log Entries Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-2.5 bg-[#080808] font-mono text-xs">
          {logs.map((log) => {
            return (
              <div
                key={log.id}
                className="p-3 bg-[#0c0c0c] border-l-2 border-[#d4ff00] border-y border-r border-[#222] flex items-start space-x-3.5"
              >
                <span className="text-white/40 shrink-0">[{log.timestamp}]</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.2 uppercase border ${
                        log.level === 'DISCOVERY'
                          ? 'text-[#d4ff00] border-[#d4ff00]/40 bg-[#d4ff00]/10'
                          : log.level === 'WARNING'
                          ? 'text-[#ff4433] border-[#ff4433]/40 bg-[#ff4433]/10'
                          : log.level === 'TELEMETRY'
                          ? 'text-white border-white/30 bg-white/5'
                          : 'text-white/50 border-[#222] bg-[#080808]'
                      }`}
                    >
                      {log.level}
                    </span>

                    {log.region && (
                      <span className="text-[9px] text-white/30 uppercase tracking-wider">
                        SECTOR: {log.region}
                      </span>
                    )}
                  </div>

                  <p className="text-white mt-1 leading-snug">
                    {log.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
