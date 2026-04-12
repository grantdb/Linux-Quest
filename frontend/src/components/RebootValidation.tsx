import React, { useState, useEffect } from 'react';
import type { Hardware, FSFormat } from '../types';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  hardware: Hardware;
  usbFormat: FSFormat;
  onComplete: (error?: string) => void;
}

const RebootValidation: React.FC<Props> = ({ hardware, usbFormat, onComplete }) => {
  const [phase, setPhase] = useState<'LOADING' | 'VERIFYING' | 'RESULT'>('LOADING');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('VERIFYING'), 2500);
    const timer2 = setTimeout(() => {
      if (hardware === 'LAPTOP' && usbFormat === 'NTFS') {
        onComplete("GRUB Rescue: Unknown Filesystem. (Legacy BIOS cannot read NTFS boot partitions on this hardware)");
      } else {
        onComplete();
      }
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [hardware, usbFormat, onComplete]);

  return (
    <div className="flex flex-col h-full bg-black items-center justify-center space-y-8 font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 border-b border-terminal-dim flex justify-between text-[10px] opacity-40">
        <span>VMLINUZ-6.5.0-AMD64</span>
        <span>UPTIME: 0.002492s</span>
      </div>

      <div className="text-center space-y-6 z-10">
        <div className="relative">
          <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
             className="w-16 h-16 border-2 border-t-terminal-bright border-r-transparent border-b-transparent border-l-transparent rounded-full mx-auto"
          />
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-terminal-dim" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-[0.3em] uppercase text-terminal-bright">
            {phase === 'LOADING' ? 'REBOOTING' : 'INITIATING BOOT'}
          </h2>
          <p className="text-[10px] text-terminal-dim uppercase tracking-widest">
            {phase === 'LOADING' ? 'Synchronizing filesystem buffers...' : 'Probing ACPI tables & PCI interrupts...'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg space-y-1 px-8 opacity-60 text-[10px] h-32 overflow-hidden flex flex-col justify-end">
        <p>[    0.000000] Linux version 6.5.0-generic (gcc version 12.3.0)</p>
        <p>[    0.003412] Command line: BOOT_IMAGE=/vmlinuz root=UUID=5a2f... quiet splash</p>
        <p>[    0.051022] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'</p>
        <p>[    0.509211] Generic {hardware} hardware profile activated.</p>
        {phase === 'VERIFYING' && (
          <>
            <p className="text-terminal-bright">[    1.203912] Mounting ESP at /boot/efi (FS: {usbFormat})...</p>
            <p className="text-terminal-bright font-bold">[    2.409112] GRUB_CHECK: Verifying stage2 bootloader signatures...</p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-terminal-green"
            >
              [    3.110292] Loading Initial RAM Disk...
            </motion.p>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4 text-xs opacity-30 mt-8">
        <ShieldCheck className="w-4 h-4" />
        <span className="tracking-widest uppercase italic">Secure Boot: {hardware === 'HIGH_END' ? 'ENABLED' : 'DISABLED'}</span>
      </div>
    </div>
  );
};

export default RebootValidation;
