import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, HardDrive, Terminal } from 'lucide-react';


interface Props {
  hardware: string;
  onComplete: (biosTime: number) => void;
}

const BiosEntry: React.FC<Props> = ({ hardware, onComplete }) => {
  const PRETTY_NAMES: Record<string, string> = {
    'AMD_RYZEN': 'Ryzen Elite',
    'INTEL_CORE': 'Core Ultra',
    'NVIDIA_RTX': 'RTX Station',
    'HYBRID_MOBILE': 'Hybrid Mobile'
  };
  const prettyName = PRETTY_NAMES[hardware] || hardware;

  const [startTime] = useState(Date.now());
  const [pressed, setPressed] = useState(false);
  const [flashing, setFlashing] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setFlashing(f => !f), 400);
    const timeout = setTimeout(() => {
      if (!pressed) onComplete(99999);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [pressed, onComplete]);

  const handlePress = () => {
    setPressed(true);
    const time = Date.now() - startTime;
    setTimeout(() => onComplete(time), 800);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#020617',
    color: '#fff',
    height: '100%',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle} onClick={handlePress}>
      {/* BACKGROUND DECORATION */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: 0.5, marginBottom: '8px' }}>
            <Terminal size={14} />
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{prettyName} Architecture v2.4</span>
         </div>
         <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>POST_INITIALIZED</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
         <button style={{
           padding: '32px 64px',
           background: flashing ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
           border: `2px solid ${flashing ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)'}`,
           borderRadius: '24px',
           transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
           cursor: 'pointer',
           display: 'flex',
           flexDirection: 'column',
           gap: '8px',
           alignItems: 'center',
           boxShadow: flashing ? '0 0 30px rgba(59, 130, 246, 0.3)' : 'none'
         }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>INTERRUPT BOOT</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', opacity: 0.8 }}>SYSTEM CONFIGURATION</span>
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', position: 'absolute', bottom: '60px', zIndex: 10 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
            <Cpu size={14} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '9px', fontWeight: 900 }}>HANDSHAKE_OK</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
            <HardDrive size={14} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '9px', fontWeight: 900 }}>BLOCK_ALIGNED</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.4 }}>
            <ShieldCheck size={14} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '9px', fontWeight: 900 }}>SECURE_BOOT</span>
         </div>
      </div>

      {pressed && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(10px)' }}>
           <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '32px 64px', borderRadius: '24px', border: '1px solid #3b82f6', boxShadow: '0 0 50px rgba(59, 130, 246, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <Activity size={24} style={{ color: '#3b82f6' }} className="animate-spin" />
                 <span style={{ color: '#fff', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entering UEFI Setup...</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BiosEntry;
