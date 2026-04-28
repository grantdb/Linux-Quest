import React, { useState, useEffect } from 'react';
import { Usb, Activity, Zap, Database } from 'lucide-react';
import type { FSFormat, FlashTool, PartitionScheme } from '../types';

interface Props {
  onComplete: (format: FSFormat, tool: FlashTool, scheme: PartitionScheme) => void;
}

const UsbPrep: React.FC<Props> = ({ onComplete }) => {
  const [scanning, setScanning] = useState(true);
  const [format, setFormat] = useState<FSFormat>('FAT32');
  const [tool, setTool] = useState<FlashTool>('Ventoy');
  const [scheme, setScheme] = useState<PartitionScheme>('GPT');

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => setScanning(false);

  return (
    <div style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
               <Usb style={{ color: '#3b82f6' }} size={18} />
            </div>
            <div>
               <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>Installation Media</h1>
               <span style={{ fontSize: '10px', color: '#fff', opacity: 0.3, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bus_Scan_Active</span>
            </div>
         </div>
      </div>

      {scanning ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
           <div style={{ position: 'relative' }}>
              <div style={{ width: '64px', height: '64px', border: '2px solid rgba(59, 130, 246, 0.1)', borderRadius: '50%', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
              <Activity size={24} style={{ position: 'absolute', top: '20px', left: '20px', color: '#3b82f6', opacity: 0.5 }} />
           </div>
           <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Probing Serial Channels...</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0 0' }}>Identifying high-speed flash storage.</p>
           </div>
           <button onClick={handleSkip} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Skip Scan</button>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {/* FLASH CONFIG */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontSize: '10px', fontWeight: 900, color: '#fff', opacity: 0.3, textTransform: 'uppercase' }}>Filesystem_Format</label>
                 <select 
                    value={format} 
                    onChange={(e) => setFormat(e.target.value as FSFormat)}
                    style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px', fontWeight: 800, outline: 'none' }}
                 >
                    <option value="FAT32">FAT32 (Recommended)</option>
                    <option value="EXT4">EXT4 (Data Only)</option>
                    <option value="BTRFS">BTRFS (Advanced)</option>
                 </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontSize: '10px', fontWeight: 900, color: '#fff', opacity: 0.3, textTransform: 'uppercase' }}>Flashing_Engine</label>
                 <select 
                    value={tool} 
                    onChange={(e) => setTool(e.target.value as FlashTool)}
                    style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px', fontWeight: 800, outline: 'none' }}
                 >
                    <option value="Ventoy">Ventoy (Multiboot)</option>
                    <option value="Rufus">Rufus</option>
                    <option value="BalenaEtcher">Etcher</option>
                 </select>
              </div>
           </div>

           {/* BOOT SCHEME */}
           <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <Database size={18} style={{ color: '#3b82f6' }} />
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>Target Partition Scheme</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>UEFI systems require GPT for modern bootloaders.</span>
                 </div>
              </div>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px' }}>
                 {['MBR', 'GPT'].map(s => (
                   <button
                     key={s}
                     onClick={() => setScheme(s as PartitionScheme)}
                     style={{ padding: '8px 16px', borderRadius: '10px', background: scheme === s ? '#3b82f6' : 'transparent', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 900, cursor: 'pointer', transition: 'all 0.2s' }}
                   >
                      {s}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* FOOTER ACTION */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
         <button
           disabled={scanning}
           onClick={() => onComplete(format, tool, scheme)}
           style={{ 
             width: '100%', 
             padding: '16px', 
             background: scanning ? 'rgba(255,255,255,0.05)' : '#fff', 
             color: scanning ? 'rgba(255,255,255,0.2)' : '#000', 
             borderRadius: '16px', 
             border: 'none', 
             fontWeight: 900, 
             fontSize: '15px', 
             cursor: scanning ? 'not-allowed' : 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '12px',
             textTransform: 'uppercase'
           }}
         >
            <Zap size={18} />
            {scanning ? 'Preparing Bus...' : 'Flash Boot Media'}
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default UsbPrep;
