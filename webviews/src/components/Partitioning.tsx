import React, { useState, useEffect } from 'react';
import { Plus, Trash2, HardDrive, Shield, Zap, Activity, Terminal as TerminalIcon, Wand2 } from 'lucide-react';

interface Props {
  onComplete: (partitionScore: number) => void;
}

const Partitioning: React.FC<Props> = ({ onComplete }) => {
  const [scheme] = useState('GPT');
  const [partitions, setPartitions] = useState<any[]>([]);
  const [cliOutput, setCliOutput] = useState<string[]>(['[SYSTEM] Waiting for block allocation...']);

  // Auto-Layout Logic
  const handleAutoLayout = () => {
    setPartitions([
      { id: 1, mount: '/', label: 'ROOT', size: 112, fs: 'ext4', color: '#3b82f6', boot: true, encrypt: false },
      { id: 2, mount: '/home', label: 'USERS', size: 400, fs: 'btrfs', color: '#8b5cf6', boot: false, encrypt: true },
    ]);
    setCliOutput(['[SYSTEM] Wiping block device...', '> mkfs.ext4 /dev/nvme0n1p1', '> mkfs.btrfs /dev/nvme0n1p2']);
  };

  const handleReset = () => {
    setPartitions([{ id: Date.now(), mount: '/', label: 'ROOT', size: 100, fs: 'ext4', color: '#3b82f6', boot: true, encrypt: false }]);
    setCliOutput(['[SYSTEM] Block allocation reset to minimal configuration.']);
  };

  useEffect(() => {
    handleAutoLayout();
  }, []);

  const totalSize = 512;
  const usedSize = partitions.reduce((acc, p) => acc + p.size, 0);
  
  const hasRoot = partitions.some(p => p.mount === '/');
  const overSize = usedSize > totalSize;
  const isValid = hasRoot && !overSize;

  useEffect(() => {
    if (partitions.length > 0) {
      const last = partitions[partitions.length - 1];
      setCliOutput(prev => [...prev.slice(-4), `> parted -a optimal /dev/nvme0n1 mkpart primary ${last.fs} ...`]);
    }
  }, [partitions.length]);

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '10px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 800,
    width: '100%',
    outline: 'none',
  };

  return (
    <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
      {/* INDUSTRIAL DRIVE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
               <HardDrive style={{ color: '#3b82f6' }} size={16} />
            </div>
            <div>
               <h1 style={{ fontSize: '15px', fontWeight: 900, color: '#fff', margin: 0 }}>Storage Architect</h1>
               <span style={{ fontSize: '9px', color: '#fff', opacity: 0.3, fontWeight: 900, textTransform: 'uppercase' }}>NVME_BLK_0 // {totalSize}GB // {scheme}</span>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleReset}
              style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}
            >
               RESET
            </button>
            <button 
              onClick={handleAutoLayout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10b981', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}
            >
               <Wand2 size={12} />
               AUTO_LAYOUT
            </button>
         </div>
      </div>

      {/* COMPACT ALLOCATION MONITOR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
         <div style={{ height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.05)' }}>
            {partitions.map(p => (
              <div key={p.id} style={{ width: `${(p.size / totalSize) * 100}%`, height: '100%', background: p.color, opacity: 0.8 }} />
            ))}
            {overSize && <div style={{ flexGrow: 1, background: '#ef4444', animation: 'pulse 1s infinite' }} />}
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, opacity: 0.3 }}>
            <span>BLOCK_ALLOCATION_MATRIX</span>
            <span style={{ color: overSize ? '#ef4444' : 'inherit' }}>{usedSize}GB / {totalSize}GB</span>
         </div>
      </div>

      {/* HIGH-DENSITY PARTITION LIST */}
      <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }} className="custom-scrollbar">
         {partitions.map((p, idx) => (
            <div key={p.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: p.color }} />
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <span style={{ fontSize: '11px', fontWeight: 900, color: p.color }}>SLICE_0{idx + 1}</span>
                     <select 
                       style={{ ...inputStyle, width: 'auto', padding: '4px 8px', height: '28px' }}
                       value={p.fs}
                       onChange={(e) => setPartitions(partitions.map(x => x.id === p.id ? { ...x, fs: e.target.value } : x))}
                     >
                       <option value="ext4">EXT4</option>
                       <option value="btrfs">BTRFS</option>
                       <option value="xfs">XFS</option>
                       <option value="fat32">FAT32</option>
                       <option value="swap">SWAP</option>
                     </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: p.boot ? '#f59e0b' : 'rgba(255,255,255,0.2)', cursor: 'pointer', background: p.boot ? 'rgba(245,158,11,0.1)' : 'transparent', padding: '4px 8px', borderRadius: '6px', border: `1px solid ${p.boot ? 'rgba(245,158,11,0.3)' : 'transparent'}` }}
                          onClick={() => setPartitions(partitions.map(x => x.id === p.id ? { ...x, boot: !x.boot } : x))}
                        >
                          <Zap size={12} />
                          <span style={{ fontSize: '9px', fontWeight: 900 }}>BOOT</span>
                        </div>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: p.encrypt ? '#10b981' : 'rgba(255,255,255,0.2)', cursor: 'pointer', background: p.encrypt ? 'rgba(16,185,129,0.1)' : 'transparent', padding: '4px 8px', borderRadius: '6px', border: `1px solid ${p.encrypt ? 'rgba(16,185,129,0.3)' : 'transparent'}` }}
                          onClick={() => setPartitions(partitions.map(x => x.id === p.id ? { ...x, encrypt: !x.encrypt } : x))}
                        >
                          <Shield size={12} />
                          <span style={{ fontSize: '9px', fontWeight: 900 }}>LUKS</span>
                        </div>
                     </div>
                     <Trash2 size={14} style={{ color: '#ef4444', opacity: 0.4, cursor: 'pointer', marginLeft: '4px' }} onClick={() => setPartitions(partitions.filter(x => x.id !== p.id))} />
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                  <input style={inputStyle} value={p.mount} placeholder="Mount Point" onChange={(e) => setPartitions(partitions.map(x => x.id === p.id ? { ...x, mount: e.target.value } : x))} />
                  <div style={{ position: 'relative' }}>
                    <input style={inputStyle} type="number" value={p.size} placeholder="Size" onChange={(e) => setPartitions(partitions.map(x => x.id === p.id ? { ...x, size: parseInt(e.target.value) || 0 } : x))} />
                    <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '10px', fontWeight: 900, opacity: 0.3 }}>GB</span>
                  </div>
               </div>
            </div>
         ))}

         <button onClick={() => setPartitions([...partitions, { id: Date.now(), mount: '/mnt/data', label: 'DATA', size: 50, fs: 'ext4', color: '#10b981', boot: false, encrypt: false }])} style={{ padding: '16px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: 900 }}>
            <Plus size={14} />
            <span>APPEND_DATA_SLICE</span>
         </button>
      </div>

      {/* CLI COMMAND PREVIEW */}
      <div style={{ height: '70px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalIcon size={12} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CLI_ARCH_STREAM</span>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
            {cliOutput.map((line, i) => (
              <span key={i} style={{ fontSize: '10px', color: '#3b82f6', opacity: (i + 1) / cliOutput.length }}>{line}</span>
            ))}
         </div>
      </div>

      {/* FOOTER DIAGNOSTICS */}
      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={18} style={{ color: isValid ? '#10b981' : '#ef4444' }} />
            <div style={{ flexGrow: 1 }}>
               <span style={{ fontSize: '11px', fontWeight: 900, color: isValid ? '#10b981' : '#ef4444', display: 'block' }}>{isValid ? 'STORAGE_VERIFIED' : 'CONFIGURATION_ERROR'}</span>
               <div style={{ display: 'flex', gap: '10px' }}>
                  {!hasRoot && <span style={{ fontSize: '9px', color: '#ef4444', fontWeight: 900 }}>[ ROOT_FS_MISSING ]</span>}
                  {overSize && <span style={{ fontSize: '9px', color: '#ef4444', fontWeight: 900 }}>[ CAPACITY_EXCEEDED ]</span>}
               </div>
            </div>
         </div>
         
         <button disabled={!isValid} onClick={() => onComplete(isValid ? 500 : 0)} style={{ width: '100%', padding: '16px', background: isValid ? '#fff' : 'rgba(255, 255, 255, 0.05)', color: isValid ? '#000' : 'rgba(255, 255, 255, 0.2)', borderRadius: '14px', border: 'none', fontWeight: 900, fontSize: '15px', cursor: isValid ? 'pointer' : 'not-allowed', textTransform: 'uppercase' }}>
            {isValid ? 'Commit Architecture' : 'Review Diagnostics'}
         </button>
      </div>
    </div>
  );
};

export default Partitioning;
