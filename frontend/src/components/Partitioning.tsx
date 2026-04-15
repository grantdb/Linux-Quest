import React, { useState } from 'react';
import { HardDrive, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

const Partitioning: React.FC<Props> = ({ onComplete }) => {
  const [mounts, setMounts] = useState<{ [key: string]: string }>({
    sda1: 'None',
    sda2: 'None',
    sda3: 'None',
  });

  const partitions = [
    { id: 'sda1', size: '512MB', type: 'FAT32', hint: 'Boot files' },
    { id: 'sda2', size: '20GB', type: 'EXT4', hint: 'Root system' },
    { id: 'sda3', size: '4GB', type: 'SWAP', hint: 'Virtual memory' },
  ];

  const mountPoints = ['None', '/', '/boot/efi', 'swap'];

  const cycleMount = (id: string) => {
    const currentIdx = mountPoints.indexOf(mounts[id]);
    const nextIdx = (currentIdx + 1) % mountPoints.length;
    setMounts({ ...mounts, [id]: mountPoints[nextIdx] });
  };

  const validate = () => {
    let score = 0;
    if (mounts.sda1 === '/boot/efi') score += 100;
    if (mounts.sda2 === '/') score += 100;
    if (mounts.sda3 === 'swap') score += 100;
    
    onComplete(score);
  };

  return (
    <div className="flex flex-col h-full bg-black/60 p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b border-terminal-dim pb-4">
        <HardDrive className="text-terminal-bright" />
        <h2 className="text-2xl font-bold tracking-widest">DISK PARTITION MANAGER</h2>
      </div>

      <p className="text-sm opacity-80">Assign the correct mount points to the partitions below. Efficiency is key to system stability.</p>

      <div className="space-y-4 flex-grow">
        {partitions.map((p) => {
          const isCorrect = (p.id === 'sda1' && mounts[p.id] === '/boot/efi') ||
                            (p.id === 'sda2' && mounts[p.id] === '/') ||
                            (p.id === 'sda3' && mounts[p.id] === 'swap');

          return (
            <div key={p.id} className="flex items-center justify-between p-4 border border-terminal-dim bg-terminal-dim/10 hover:bg-terminal-dim/20 transition-colors">
              <div className="flex flex-col">
                <span className="font-bold text-terminal-bright">{p.id} ({p.size})</span>
                <span className="text-xs opacity-50">{p.type} — {p.hint}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {mounts[p.id] !== 'None' && (
                  isCorrect ? <CheckCircle2 size={16} className="text-terminal-bright" /> : <ShieldAlert size={16} className="text-yellow-500" />
                )}
                <button
                  onClick={() => cycleMount(p.id)}
                  className="px-4 py-1 border border-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-colors text-sm font-bold min-w-[100px]"
                >
                  {mounts[p.id]}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={validate}
        className="w-full py-3 bg-terminal-dim border-2 border-terminal-bright text-terminal-bright font-bold hover:bg-terminal-bright hover:text-terminal-bg transition-all uppercase tracking-widest"
      >
        Commit Changes to Disk
      </button>
    </div>
  );
};

export default Partitioning;
