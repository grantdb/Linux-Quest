import React, { useState, useEffect } from 'react';
import { Cpu, Zap } from 'lucide-react';

interface Props {
  onComplete: (success: boolean) => void;
}

const BonusDrivers: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const technicalLogs = [
    `[ INFO ] Initializing GCC toolchain...`,
    `[ INFO ] Resolving kernel-headers (6.6.5-quest)...`,
    `[ INFO ] Patching proprietary_blob.c for architecture...`,
    `[ WARN ] Unused variable in dkms_module.c (ignoring)`,
    `[ INFO ] Compiling hardware abstraction layer...`,
    `[ INFO ] Linking dynamic modules...`,
    `[ INFO ] Registering drivers with DKMS...`,
    `[ SUCCESS ] Drivers installed successfully.`
  ];

  useEffect(() => {
    let logIdx = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 1, 100);
        const nextLogIdx = Math.floor((next / 100) * technicalLogs.length);
        if (nextLogIdx > logIdx && technicalLogs[logIdx]) {
           setLogs(prev => [...prev.slice(-6), technicalLogs[logIdx]]);
           logIdx = nextLogIdx;
        }
        if (next >= 100) {
           clearInterval(interval);
           setTimeout(() => onComplete(true), 1500);
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{ backgroundColor: '#020617', color: '#fff', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'monospace', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
         <div style={{ padding: '8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px' }}>
            <Cpu style={{ color: '#eab308' }} size={16} />
         </div>
         <div>
            <h1 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>Driver_Module_Compiler</h1>
            <p style={{ fontSize: '8px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '2px 0 0 0' }}>DKMS Auto-Link Service</p>
         </div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
         <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
               <div style={{ position: 'absolute', inset: 0, border: '2px solid #00ff41', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
               <Zap style={{ color: '#00ff41' }} size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>Building_Kernel_Modules</span>
               <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 900 }}>Wait for DKMS Handshake</span>
            </div>
         </div>

         <div style={{ flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               {logs.map((log, i) => (
                 <div key={i} style={{ fontSize: '8px', color: log.includes('SUCCESS') ? '#00ff41' : '#94a3b8', display: 'flex', gap: '8px' }}>
                    <span style={{ opacity: 0.4 }}>[{i.toString().padStart(2, '0')}]</span>
                    <span>{log}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div style={{ marginTop: '12px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase' }}>Compiler_Progress</span>
            <span style={{ fontSize: '10px', color: '#00ff41', fontWeight: 900 }}>{progress}%</span>
         </div>
         <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#00ff41', width: `${progress}%`, transition: 'width 0.1s linear' }} />
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default BonusDrivers;
