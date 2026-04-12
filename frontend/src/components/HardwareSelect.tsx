import React from 'react';
import type { Hardware } from '../types';
import { Monitor, Laptop, Server } from 'lucide-react';

interface Props {
  onComplete: (hardware: Hardware) => void;
}

const HardwareSelect: React.FC<Props> = ({ onComplete }) => {
  const options: { id: Hardware; label: string; sub: string; multiplier: string; icon: any }[] = [
    { id: 'LAPTOP', label: 'Old Laptop', sub: 'Legacy BIOS, 4GB RAM', multiplier: '2.5x Score', icon: Laptop },
    { id: 'PC', label: 'Standard PC', sub: 'UEFI/BIOS, 16GB RAM', multiplier: '1.0x Score', icon: Monitor },
    { id: 'HIGH_END', label: 'Workstation', sub: 'Modern UEFI, 64GB RAM', multiplier: '0.5x Score', icon: Server },
  ];

  return (
    <div className="flex flex-col h-full items-center justify-center space-y-8">
      <h2 className="text-3xl font-bold border-b-2 border-terminal-green pb-2">SELECT TARGET HARDWARE</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onComplete(opt.id)}
            className="group flex flex-row sm:flex-col items-center justify-start sm:justify-center p-3 border-2 border-terminal-dim hover:border-terminal-bright hover:bg-terminal-dim transition-all text-left sm:text-center"
          >
            <opt.icon className="w-8 h-8 mr-4 sm:mr-0 sm:w-16 sm:h-16 sm:mb-4 group-hover:scale-110 transition-transform shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-lg font-bold uppercase">{opt.label}</span>
              <span className="text-xs text-terminal-green/60 mt-1">{opt.sub}</span>
              <span className="text-sm font-bold text-terminal-bright mt-1 sm:mt-2">{opt.multiplier}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="animate-pulse">BOOT SEQUENCE INITIATED... AWAITING USER INPUT</p>
    </div>
  );
};

export default HardwareSelect;
