import React, { useState, useEffect } from 'react';
import { ShieldAlert, XCircle, Cpu, Database, Zap, Lock, HardDrive, Activity, Check, Terminal, RefreshCw } from 'lucide-react';

interface Props {
  gameData: any;
  onComplete: () => void;
}

const RebootValidation: React.FC<Props> = ({ gameData, onComplete }) => {
  const [auditPhase, setAuditPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const hasHardwareConflict = (gameData.hardware === 'HYBRID_MOBILE' || gameData.hardware === 'RASPI_ARM') && (gameData.profile === 'Gaming' || gameData.profile === 'Workstation');
  const isFatal = hasHardwareConflict;

  const CHECKS = [
    { id: 'KERNEL', label: 'Kernel_Signature', icon: Cpu, desc: 'Verifying core DNA alignment.', pass: true },
    { id: 'PARTITION', label: 'Partition_Map', icon: Database, desc: 'Validating block structure.', pass: true },
    { id: 'HARDWARE', label: 'Hardware_Sync', icon: Zap, desc: 'Testing architecture links.', pass: !hasHardwareConflict },
    { id: 'SECURITY', label: 'Security_Level', icon: Lock, desc: 'LUKS verification.', pass: true },
    { id: 'IO', label: 'I/O_Integrity', icon: HardDrive, desc: 'Sector alignment.', pass: true },
    { id: 'FINAL', label: 'Boot_Sequence', icon: Activity, desc: 'Executing final jump.', pass: !isFatal },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAuditPhase(prev => {
        if (prev >= CHECKS.length) {
          clearInterval(interval);
          setIsComplete(true);
          return prev;
        }
        if (prev > 0 && !CHECKS[prev - 1].pass) {
          clearInterval(interval);
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isFatal, CHECKS.length]);

  const auditSuccess = isComplete && !isFatal;

  return (
    <div style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden', background: !auditSuccess && isComplete ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center' }}>
         <div style={{ display: 'inline-flex', padding: '12px', background: auditSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '20px', border: `1px solid ${auditSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, marginBottom: '12px' }}>
            {auditSuccess ? <ShieldAlert style={{ color: '#10b981' }} size={24} /> : <XCircle style={{ color: '#ef4444' }} size={24} />}
         </div>
         <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: 0 }}>{auditSuccess ? 'Final System Audit' : 'SYSTEM_HALTED'}</h1>
         <p style={{ fontSize: '12px', color: '#fff', opacity: 0.4, fontWeight: 700, margin: '4px 0 0 0' }}>{auditSuccess ? 'Validating architectural integrity.' : 'CRITICAL_BOOT_FAILURE: ARCHITECTURE_MISMATCH'}</p>
      </div>

      {/* DIAGNOSTIC GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexGrow: 1 }}>
         {CHECKS.map((check, i) => {
            const isVisible = i <= auditPhase;
            const hasFailed = i < auditPhase && !check.pass;
            
            return (
              <div 
                key={check.label} 
                style={{ 
                  padding: '16px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '16px', 
                  border: `1px solid ${hasFailed ? 'rgba(239, 68, 68, 0.3)' : (i < auditPhase ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)')}`,
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  opacity: isVisible ? 1 : 0.2,
                  transition: 'all 0.4s'
                }}
              >
                 <div style={{ padding: '10px', background: hasFailed ? 'rgba(239, 68, 68, 0.1)' : (i < auditPhase ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)'), borderRadius: '10px' }}>
                    <check.icon size={16} style={{ color: hasFailed ? '#ef4444' : (i < auditPhase ? '#10b981' : 'rgba(255,255,255,0.4)') }} />
                 </div>
                 <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase' }}>{check.label}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ fontSize: '9px', color: hasFailed ? '#ef4444' : '#fff', opacity: 0.4, fontWeight: 800 }}>{hasFailed ? 'FAILED_0x800' : (i < auditPhase ? 'PASSED_0x00' : 'WAITING...')}</span>
                       {i < auditPhase && !hasFailed && <Check size={10} style={{ color: '#10b981' }} />}
                    </div>
                 </div>
              </div>
            );
         })}
      </div>

      {/* PANIC / SUCCESS BADGE */}
      {isComplete && (
        <div style={{ padding: '20px', background: auditSuccess ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '20px', border: `1px solid ${auditSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.3)'}`, display: 'flex', alignItems: 'center', gap: '20px', animation: 'fadeIn 0.5s' }}>
           {auditSuccess ? <Zap size={36} style={{ color: '#10b981' }} /> : <Terminal size={36} style={{ color: '#ef4444' }} />}
           <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>{auditSuccess ? 'Architecture Verified' : 'Kernel Panic Detected'}</h2>
              <p style={{ fontSize: '11px', color: auditSuccess ? '#10b981' : '#ef4444', fontWeight: 700, margin: 0, opacity: 0.8, lineHeight: '1.4' }}>
                {hasHardwareConflict && 'ERROR: ARM architecture incompatible with heavy profiles. SUGGESTION: Return to "Profile" and select Minimalist, or use Intel/AMD hardware.'}
                {auditSuccess && 'SYSTEM_HEALTH_INDEX: 100% // READY_FOR_ENV'}
              </p>
           </div>
        </div>
      )}

      {/* FOOTER ACTION */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
         <button
           onClick={onComplete}
           style={{ 
             width: '100%', 
             padding: '16px', 
             background: auditSuccess ? '#fff' : 'rgba(239, 68, 68, 0.1)', 
             color: auditSuccess ? '#000' : '#ef4444', 
             borderRadius: '14px', 
             border: auditSuccess ? 'none' : '1px solid rgba(239, 68, 68, 0.2)', 
             fontWeight: 900, 
             fontSize: '15px', 
             cursor: 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '12px',
             textTransform: 'uppercase'
           }}
         >
            <RefreshCw size={18} />
            {auditSuccess ? 'Initialize Final Reboot' : 'Emergency System Rescue'}
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default RebootValidation;
