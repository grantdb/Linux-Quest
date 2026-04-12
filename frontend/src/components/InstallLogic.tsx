import React, { useState, useEffect, useMemo } from 'react';
import type { Hardware } from '../types';

interface Props {
  hardware: Hardware;
  onComplete: () => void;
}

// Maximum lines visible in the terminal at a time — avoids overflow-y-auto (scroll trap)
const MAX_VISIBLE_LINES = 10;

const InstallLogic: React.FC<Props> = ({ hardware, onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);

  // Memoized so the array reference is stable and effect dep is safe
  const messages = useMemo(() => [
    `Analyzing hardware: ${hardware}...`,
    'Found target disk /dev/sda (256GB)',
    'Creating partition table (GPT)...',
    'Formatting partition 1 (fat32 /boot/efi)...',
    'Formatting partition 2 (ext4 /)...',
    'Mounting filesystems...',
    'Installing base system (kernel 6.x)...',
    'Unpacking packages: coreutils, grub, systemd...',
    'Configuring local settings: en_US.UTF-8',
    'Generating initramfs...',
    'Installing GRUB bootloader to /dev/sda...',
    'Finalizing installation scripts...',
    'Syncing disks...',
    'Installation complete. Awaiting reboot.',
  ], [hardware]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < messages.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[current]}`]);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [messages, onComplete]);

  // Only show the last MAX_VISIBLE_LINES — no scroll needed, no scroll trap
  const visibleLogs = logs.slice(-MAX_VISIBLE_LINES);

  return (
    <div className="flex flex-col h-full bg-black/80 font-mono p-4 border-2 border-terminal-dim">
      <div className="flex justify-between border-b border-terminal-dim mb-4 pb-1 text-xs opacity-50">
        <span>TERM: xterm-256color</span>
        <span>INSTALLER v2.4.1</span>
      </div>

      {/* overflow-hidden — no scroll trap. Latest lines shown via slice. */}
      <div className="flex-grow overflow-hidden space-y-1 select-none">
        {visibleLogs.map((log, i) => (
          <div key={i} className={log.includes('complete') ? 'text-terminal-bright font-bold' : ''}>
            {log}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs opacity-50">
        <span>Progress: {Math.round((logs.length / messages.length) * 100)}%</span>
        <div className="w-64 h-2 bg-terminal-dim">
          <div
            className="h-full bg-terminal-green transition-all duration-300"
            style={{ width: `${(logs.length / messages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default InstallLogic;
