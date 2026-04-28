import React, { useState, useEffect } from 'react';
import { Save, Shield, Zap, Check, Search, ShieldCheck, Database, FileCode } from 'lucide-react';
import type { FSFormat, FlashTool, PartitionScheme } from '../types';

interface Props {
  onComplete: (format: FSFormat, tool: FlashTool, scheme: PartitionScheme) => void;
}

const UsbPrep: React.FC<Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'SCAN' | 'CONFIG' | 'VERIFY'>('SCAN');
  const [tool, setTool] = useState<FlashTool>('Ventoy');
  const [format, setFormat] = useState<FSFormat>('EXT4');
  const [scheme] = useState<PartitionScheme>('GPT');
  const [isWiping, setIsWiping] = useState(true);
  const [persistence, setPersistence] = useState(false);

  // Simulation of a hardware scan
  useEffect(() => {
    if (phase === 'SCAN') {
      const timer = setTimeout(() => setPhase('CONFIG'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const OPTIONS = {
    tools: ['Ventoy', 'Rufus', 'BalenaEtcher'] as FlashTool[],
    formats: ['EXT4', 'FAT32', 'BTRFS'] as FSFormat[],
    schemes: ['GPT', 'MBR'] as PartitionScheme[]
  };

  const SelectionStrip = ({ label, value, options, onChange, icon: Icon }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
          <Icon size={10} />
          <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: '4px' }}>
          {options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: '10px 4px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: value === opt ? '#10b981' : 'rgba(255,255,255,0.05)',
                background: value === opt ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)',
                color: value === opt ? '#fff' : 'rgba(255,255,255,0.4)',
                fontSize: '9px',
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              {opt.split(' ')[0]}
            </button>
          ))}
       </div>
    </div>
  );

  return (
    <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      {/* MULTI-PHASE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
               <Save style={{ color: '#10b981' }} size={16} />
            </div>
            <div>
               <h1 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', margin: 0 }}>Media Architect</h1>
               <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  {['SCAN', 'CONFIG', 'VERIFY'].map((p, i) => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '7px', fontWeight: 900, color: phase === p ? '#10b981' : 'rgba(255,255,255,0.2)' }}>{p}</span>
                       {i < 2 && <div style={{ width: '10px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />}
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {phase === 'SCAN' ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
           <div style={{ position: 'relative' }}>
              <Search size={40} style={{ color: '#10b981', opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
              <div style={{ position: 'absolute', inset: -10, border: '1px solid #10b981', borderRadius: '50%', opacity: 0.2, animation: 'ping 2s infinite' }} />
           </div>
           <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#fff', margin: 0 }}>Probing USB Controller...</p>
              <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0 0' }}>Identifying physical media signatures.</p>
           </div>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
           {/* HARDWARE SIGNATURE READOUT */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{ fontSize: '7px', color: '#fff', opacity: 0.3, fontWeight: 900 }}>VENDOR_SIGNATURE</span>
                 <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff' }}>SANDISK_ULTRA_G3</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                 <span style={{ fontSize: '7px', color: '#fff', opacity: 0.3, fontWeight: 900 }}>BUS_ARCHITECTURE</span>
                 <span style={{ fontSize: '9px', fontWeight: 900, color: '#10b981' }}>USB 3.1 GEN 2</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
                 <span style={{ fontSize: '7px', color: '#fff', opacity: 0.3, fontWeight: 900 }}>VID/PID</span>
                 <span style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>0x0781:0x5581</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '4px' }}>
                 <span style={{ fontSize: '7px', color: '#fff', opacity: 0.3, fontWeight: 900 }}>WRITE_SPEED</span>
                 <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff' }}>150 MB/S</span>
              </div>
           </div>

           {/* CONFIGURATION STRIPS */}
           <SelectionStrip label="Flashing_Tool" value={tool} options={OPTIONS.tools} onChange={setTool} icon={Zap} />
           <SelectionStrip label="Target_Filesystem" value={format} options={OPTIONS.formats} onChange={setFormat} icon={Database} />
           
           {/* ADVANCED TOGGLES */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                onClick={() => setIsWiping(!isWiping)}
                style={{ padding: '12px', background: isWiping ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.2)', border: `1px solid ${isWiping ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                 <Shield size={12} style={{ color: isWiping ? '#ef4444' : 'rgba(255,255,255,0.2)' }} />
                 <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '9px', fontWeight: 900, color: isWiping ? '#ef4444' : '#fff', margin: 0 }}>Full Wipe</p>
                    <p style={{ fontSize: '7px', opacity: 0.3, margin: 0 }}>Secure Zero-Fill</p>
                 </div>
              </button>
              <button 
                onClick={() => setPersistence(!persistence)}
                style={{ padding: '12px', background: persistence ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)', border: `1px solid ${persistence ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                 <Database size={12} style={{ color: persistence ? '#10b981' : 'rgba(255,255,255,0.2)' }} />
                 <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '9px', fontWeight: 900, color: persistence ? '#10b981' : '#fff', margin: 0 }}>Persistence</p>
                    <p style={{ fontSize: '7px', opacity: 0.3, margin: 0 }}>Live-Session Save</p>
                 </div>
              </button>
           </div>

           {/* ISO INTEGRITY SCANNER */}
           <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '14px', border: '1px dashed rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 <FileCode size={16} style={{ color: '#10b981' }} />
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '8px', fontWeight: 900, color: '#fff' }}>SHA-256_VERIFIED</span>
                    <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>D4A1...F90B</span>
                 </div>
              </div>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
           </div>
        </div>
      )}

      {/* FINAL ACTION */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
         <button
           disabled={phase === 'SCAN'}
           onClick={() => onComplete(format, tool, scheme)}
           style={{ 
             width: '100%', 
             padding: '14px', 
             background: phase === 'SCAN' ? 'rgba(255,255,255,0.05)' : '#fff', 
             color: phase === 'SCAN' ? 'rgba(255,255,255,0.2)' : '#000', 
             borderRadius: '12px', 
             border: 'none', 
             fontWeight: 900, 
             fontSize: '13px', 
             cursor: phase === 'SCAN' ? 'not-allowed' : 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '8px',
             textTransform: 'uppercase',
             letterSpacing: '0.05em'
           }}
         >
            <Check size={16} />
            {phase === 'SCAN' ? 'Identifying Media...' : 'Begin Deployment'}
         </button>
      </div>
    </div>
  );
};

export default UsbPrep;
