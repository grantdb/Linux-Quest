import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Cpu, Zap, HardDrive, Shield } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const InstallLogic: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(['INITIALIZING_DEPLOYMENT_CORE...']);
  const [currentTask, setCurrentTask] = useState('Bootstrapping System');

  const TASKS = [
    { name: 'Partitioning_Block_Device', log: 'mkfs.ext4 /dev/nvme0n1p1... DONE' },
    { name: 'Mounting_Architectural_Points', log: 'mount /dev/nvme0n1p1 /mnt... SUCCESS' },
    { name: 'Compiling_System_DNA', log: 'pacstrap /mnt base linux-zen... VERIFIED' },
    { name: 'Linking_Kernel_Modules', log: 'Generating Initramfs... ALIGNED' },
    { name: 'Synchronizing_Identity', log: 'Setting hostname and users... COMMITTED' },
    { name: 'Deploying_Interface_Shell', log: 'Installing UI Environment... OPTIMIZED' },
    { name: 'Finalizing_Boot_Sequence', log: 'grub-install /dev/nvme0n1... BOOTABLE' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 2000);
          return 100;
        }
        const next = prev + 1;
        
        // Update logs and tasks periodically
        const taskIdx = Math.floor(prev / 14);
        if (TASKS[taskIdx] && TASKS[taskIdx].name !== currentTask) {
          setCurrentTask(TASKS[taskIdx].name);
          setLogs(prevLogs => [...prevLogs.slice(-5), `> ${TASKS[taskIdx].log}`]);
        }
        
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete, currentTask]);

  return (
    <div style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      {/* INDUSTRIAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
         <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
               <Activity style={{ color: '#3b82f6', animation: 'pulse 1s infinite' }} size={18} />
            </div>
            <div>
               <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>Deployment_Matrix</h1>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', animation: 'ping 1s infinite' }} />
                  <span style={{ fontSize: '8px', color: '#fff', opacity: 0.4, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>LIVE_DEPLOY_STREAM: ACTIVE</span>
               </div>
            </div>
         </div>
         <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#3b82f6' }}>{progress}%</span>
            <p style={{ fontSize: '7px', opacity: 0.3, fontWeight: 900, margin: 0 }}>SYSTEM_SYNC_STATUS</p>
         </div>
      </div>

      {/* WORKLOAD VISUALS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
         {[
           { label: 'CPU_LOAD', icon: Cpu, val: Math.min(progress * 1.5, 95) },
           { label: 'DISK_I/O', icon: HardDrive, val: Math.min(progress * 2, 88) },
           { label: 'BUS_LINK', icon: Zap, val: 99 }
         ].map(stat => (
           <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <stat.icon size={12} style={{ color: progress > 0 ? '#3b82f6' : 'rgba(255,255,255,0.2)' }} />
                 <span style={{ fontSize: '8px', fontWeight: 900, opacity: 0.3 }}>{stat.label}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden' }}>
                 <div style={{ width: `${stat.val}%`, height: '100%', background: '#3b82f6', transition: 'width 0.5s' }} />
              </div>
           </div>
         ))}
      </div>

      {/* LIVE COMMAND TERMINAL */}
      <div style={{ flexGrow: 1, background: 'rgba(0,0,0,0.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, #3b82f6, transparent)', animation: 'scanline 2s infinite' }} />
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={14} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff', opacity: 0.8 }}>{currentTask}</span>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ fontSize: '9px', color: '#3b82f6', opacity: (i + 1) / logs.length, display: 'flex', gap: '10px' }}>
                 <span style={{ opacity: 0.3 }}>{`[${800 + i * 42}]`}</span>
                 <span>{log}</span>
              </div>
            ))}
         </div>

         {/* PROGRESS BAR */}
         <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: 900, opacity: 0.3 }}>
               <span>TARGET: NVME_BLK_0</span>
               <span>{progress}% COMPLETE</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
               <div style={{ width: `${progress}%`, height: '100%', background: '#fff', transition: 'width 0.1s linear', boxShadow: '0 0 15px rgba(255,255,255,0.3)' }} />
            </div>
         </div>
      </div>

      {/* FOOTER STATUS */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Shield size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>Secure_Deployment_Mode</span>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default InstallLogic;
