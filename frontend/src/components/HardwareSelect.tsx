import React, { useState } from 'react';
import { Cpu, Zap, Monitor, Laptop, ShieldCheck, Activity, Check } from 'lucide-react';
import type { Hardware } from '../types';

interface Props {
  onComplete: (hardware: Hardware) => void;
}

const HardwareSelect: React.FC<Props> = ({ onComplete }) => {
  const [selected, setSelected] = useState<Hardware>('INTEL_CORE');

  const OPTIONS = [
    { 
      id: 'AMD_RYZEN' as Hardware, 
      label: 'Ryzen Elite', 
      desc: 'Multicore performance for heavy workloads.', 
      icon: Cpu, 
      color: '#ef4444',
      specs: ['16 Cores', '5.2GHz', 'AM5 Socket', 'L3 64MB']
    },
    { 
      id: 'INTEL_CORE' as Hardware, 
      label: 'Core Ultra', 
      desc: 'High-speed single-core gaming architecture.', 
      icon: Zap, 
      color: '#3b82f6',
      specs: ['24 Cores', '6.0GHz', 'LGA1700', 'P/E Cores']
    },
    { 
      id: 'NVIDIA_RTX' as Hardware, 
      label: 'RTX Compute', 
      desc: 'CUDA-optimized for AI and rendering.', 
      icon: Monitor, 
      color: '#10b981',
      specs: ['AD102', '24GB VRAM', 'DLSS 3.5', 'Tensor V4']
    },
    { 
      id: 'HYBRID_MOBILE' as Hardware, 
      label: 'Hybrid Mobile', 
      desc: 'Power-efficient ARM-based deployment.', 
      icon: Laptop, 
      color: '#8b5cf6',
      specs: ['8 Cores', '3.2GHz', 'LPDDR5X', 'NPU Active']
    }
  ];

  return (
    <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Cpu style={{ color: '#3b82f6' }} size={18} />
         </div>
         <div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>Hardware Architect</h1>
            <p style={{ fontSize: '10px', color: '#fff', opacity: 0.4, fontWeight: 700, margin: 0 }}>Probing physical silicon signature.</p>
         </div>
      </div>

      {/* HARDWARE GRID */}
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingBottom: '10px' }}>
         {OPTIONS.map((opt) => (
           <button
             key={opt.id}
             onClick={() => setSelected(opt.id)}
             style={{ 
               padding: '12px', 
               background: selected === opt.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
               borderRadius: '16px', 
               border: `1px solid ${selected === opt.id ? opt.color : 'rgba(255,255,255,0.05)'}`,
               display: 'flex', 
               flexDirection: 'column',
               gap: '12px',
               textAlign: 'left',
               cursor: 'pointer',
               transition: 'all 0.2s',
               position: 'relative',
               overflow: 'hidden'
             }}
           >
              {selected === opt.id && <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px', opacity: 0.5 }}><ShieldCheck size={14} color={opt.color} /></div>}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <div style={{ padding: '8px', background: `${opt.color}15`, borderRadius: '10px' }}>
                    <opt.icon size={18} style={{ color: opt.color }} />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#fff', margin: 0 }}>{opt.label}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.4 }}>
                       <Activity size={8} color={opt.color} />
                       <span style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase' }}>Ready</span>
                    </div>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                 {opt.specs.map(spec => (
                   <div key={spec} style={{ fontSize: '8px', color: '#fff', opacity: 0.3, background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{spec}</div>
                 ))}
              </div>

              <p style={{ fontSize: '9px', color: '#fff', opacity: 0.5, margin: 0, lineHeight: '1.3' }}>{opt.desc}</p>
           </button>
         ))}
      </div>

      {/* FINAL ACTION */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
         <button
           onClick={() => onComplete(selected)}
           style={{ 
             width: '100%', 
             padding: '12px', 
             background: '#fff', 
             color: '#000', 
             borderRadius: '10px', 
             border: 'none', 
             fontWeight: 900, 
             fontSize: '12px', 
             cursor: 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '8px',
             textTransform: 'uppercase'
           }}
         >
            <Check size={16} />
            Bind Architecture Signature
         </button>
      </div>
    </div>
  );
};

export default HardwareSelect;
