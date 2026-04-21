import React, { useState, useEffect } from 'react';
import { Wifi, Globe, Shield, Lock, Radio, Check } from 'lucide-react';

interface Props {
  onComplete: (networkData: any) => void;
}

const NetworkSetup: React.FC<Props> = ({ onComplete }) => {
  const [scanning, setScanning] = useState(true);
  const [selectedSsid, setSelectedSsid] = useState('QUEST_SECURE_5G');
  const [dns, setDns] = useState('CLOUDFLARE_1.1.1.1');
  const [vpn, setVpn] = useState(true);
  const [isHardened, setIsHardened] = useState(true);

  const DNS_OPTIONS = ['CLOUDFLARE_1.1.1.1', 'GOOGLE_8.8.8.8', 'QUAD9_9.9.9.9'];

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      {/* INDUSTRIAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
               <Globe style={{ color: '#3b82f6' }} size={18} />
            </div>
            <div>
               <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>Network Architect</h1>
               <span style={{ fontSize: '8px', color: '#fff', opacity: 0.3, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Spectral_Sync_Active</span>
            </div>
         </div>
      </div>

      {scanning ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
           <div style={{ position: 'relative' }}>
              <Radio size={48} style={{ color: '#3b82f6', opacity: 0.5, animation: 'pulse 1s infinite' }} />
              <div style={{ position: 'absolute', inset: -20, border: '2px solid #3b82f6', borderRadius: '50%', opacity: 0.1, animation: 'ping 2s infinite' }} />
           </div>
           <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 900, color: '#fff', margin: 0 }}>Probing Wireless Spectrum...</p>
              <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0 0' }}>Identifying high-gain access points.</p>
           </div>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
           {/* SIGNAL MATRIX */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '8px', fontWeight: 900, color: '#fff', opacity: 0.3, textTransform: 'uppercase' }}>Available_Channels</span>
              {['QUEST_SECURE_5G', 'SAT_LINK_AX', 'LOCAL_NODE_01'].map(ssid => (
                <button
                  key={ssid}
                  onClick={() => setSelectedSsid(ssid)}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    background: selectedSsid === ssid ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${selectedSsid === ssid ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Wifi size={14} style={{ color: selectedSsid === ssid ? '#3b82f6' : 'rgba(255,255,255,0.2)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 900, color: selectedSsid === ssid ? '#fff' : 'rgba(255,255,255,0.4)' }}>{ssid}</span>
                   </div>
                   <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4].map(b => <div key={b} style={{ width: '3px', height: `${b * 3}px`, background: selectedSsid === ssid ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />)}
                   </div>
                </button>
              ))}
           </div>

           {/* HARDENING LAYER */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                 <span style={{ fontSize: '8px', fontWeight: 900, color: '#fff', opacity: 0.3, textTransform: 'uppercase' }}>DNS_Provider</span>
                 <select 
                    value={dns} 
                    onChange={(e) => setDns(e.target.value)}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '9px', fontWeight: 800, outline: 'none' }}
                 >
                    {DNS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.split('_')[0]}</option>)}
                 </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                 <span style={{ fontSize: '8px', fontWeight: 900, color: '#fff', opacity: 0.3, textTransform: 'uppercase' }}>Security_Shield</span>
                 <button 
                    onClick={() => setIsHardened(!isHardened)}
                    style={{ padding: '12px', background: isHardened ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)', border: `1px solid ${isHardened ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                 >
                    <Shield size={12} style={{ color: isHardened ? '#10b981' : 'rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: '9px', fontWeight: 900, color: isHardened ? '#10b981' : '#fff' }}>Hardened</span>
                 </button>
              </div>
           </div>

           {/* VPN STATUS */}
           <div style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <Lock size={16} style={{ color: vpn ? '#3b82f6' : 'rgba(255,255,255,0.2)' }} />
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>WireGuard_Tunnel</span>
                    <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>Encrypted_Data_Link</span>
                 </div>
              </div>
              <button onClick={() => setVpn(!vpn)} style={{ padding: '4px 12px', borderRadius: '8px', background: vpn ? '#3b82f6' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '8px', fontWeight: 900, cursor: 'pointer' }}>{vpn ? 'ACTIVE' : 'OFF'}</button>
           </div>
        </div>
      )}

      {/* FOOTER ACTION */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
         <button
           disabled={scanning}
           onClick={() => onComplete({ ssid: selectedSsid, dns, vpn, isHardened })}
           style={{ 
             width: '100%', 
             padding: '16px', 
             background: scanning ? 'rgba(255,255,255,0.05)' : '#fff', 
             color: scanning ? 'rgba(255,255,255,0.2)' : '#000', 
             borderRadius: '14px', 
             border: 'none', 
             fontWeight: 900, 
             fontSize: '14px', 
             cursor: scanning ? 'not-allowed' : 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '10px',
             textTransform: 'uppercase'
           }}
         >
            <Check size={18} />
            {scanning ? 'Spectral Scanning...' : 'Commit Network Config'}
         </button>
      </div>
    </div>
  );
};

export default NetworkSetup;
