import React, { useState } from 'react';
import type { FSFormat } from '../types';
import { motion } from 'framer-motion';
import { Usb, HardDrive } from 'lucide-react';

interface Props {
  onComplete: (format: FSFormat, tool: string) => void;
}

const UsbPrep: React.FC<Props> = ({ onComplete }) => {
  const [selectedFormat, setSelectedFormat] = useState<FSFormat | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [progress, setProgress] = useState(0);

  const startFormatting = () => {
    if (!selectedFormat) return;
    setIsFormatting(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => onComplete(selectedFormat, 'Rufus-v3.21'), 500);
      }
    }, 50);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center space-y-8">
      <h2 className="text-3xl font-bold border-b-2 border-terminal-green pb-2">USB PREPARATION</h2>
      
      {!isFormatting ? (
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="flex space-x-12">
            <div className="flex flex-col items-center space-y-4">
              <span className="text-sm font-bold opacity-70">FILE SYSTEM</span>
              <div className="flex space-x-4">
                {(['FAT32', 'NTFS'] as FSFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={`px-4 py-2 border-2 ${selectedFormat === f ? 'bg-terminal-green text-terminal-bg' : 'border-terminal-dim'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <span className="text-sm font-bold opacity-70">WRITE TOOL</span>
              <div className="px-4 py-2 border-2 border-terminal-dim bg-terminal-dim/30">
                Rufus-v3.21
              </div>
            </div>
          </div>

          <motion.div 
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 150 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 && selectedFormat) startFormatting();
            }}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing p-4 border-2 border-dashed border-terminal-bright rounded-xl"
          >
            <Usb className="w-16 h-16 text-terminal-bright mb-2" />
            <span className="text-xs font-bold">DRAG DOWN TO "FLASH"</span>
          </motion.div>
          
          <div className="flex items-center space-x-2 text-terminal-dim italic">
            <HardDrive className="w-5 h-5" />
            <span>Target: /dev/sdb (16GB Generic Flash)</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
          <div className="text-2xl font-bold animate-pulse">FLASHING IMAGE...</div>
          <div className="w-full h-8 border-2 border-terminal-green relative overflow-hidden">
            <motion.div 
              className="h-full bg-terminal-green"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm font-mono self-end">{progress}% COMPLETE</div>
          <div className="text-xs text-terminal-dim w-full overflow-hidden whitespace-nowrap">
            [DEBUG] Writing blocks to partition 0x01...
          </div>
        </div>
      )}
    </div>
  );
};

export default UsbPrep;
