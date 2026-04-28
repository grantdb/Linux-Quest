import React, { useState, useEffect } from 'react';
import { Globe, Search, Check } from 'lucide-react';
import type { Network } from '../types';

interface Props {
  onComplete: (networkData: any) => void;
}

const NetworkSetup: React.FC<Props> = ({ onComplete }) => {
  const [scanning, setScanning] = useState(true);
  const [selectedSsid, setSelectedSsid] = useState('Hyperlink_5G');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => setScanning(false);

  const NETWORKS: Network[] = [
    { id: 'WLAN_INT', ssid: 'Hyperlink_5G', signal: 95, security: 'WPA3', active: true },
    { id: 'ETH_0', ssid: 'Wired Connection', signal: 100, security: 'Open', active: true },
    { id: 'WLAN_EXT', ssid: 'Hidden_Guest_Node', signal: 45, security: 'WPA2', active: true },
    { id: 'BLE_MESH', ssid: 'Mobile_Tether_BT', signal: 30, security: 'WPA2', active: false },
  ];

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => onComplete({ network: selectedSsid, time: Date.now() }), 1500);
  };

  return (
    <div style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      {/* INDUSTRIAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
               <Globe style={{ color: '#3b82f6' }} size={18} />
            </div>
            <div>
               <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>Network Integration</h1>
               <span style={{ fontSize: '10px', color: '#fff', opacity: 0.3, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Discovery_Active</span>
            </div>
         </div>
      </div>

      {scanning ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
           <div style={{ position: 'relative' }}>
              <div style={{ width: '64px', height: '64px', border: '2px solid rgba(59, 130, 246, 0.1)', borderRadius: '50%', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
              <Search size={24} style={{ position: 'absolute', top: '20px', left: '20px', color: '#3b82f6', opacity: 0.5 }} />
           </div>
           <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>Discovering Nodes...</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0 0' }}>Probing 2.4GHz / 5GHz spectrum.</p>
           </div>
           <button onClick={handleSkip} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Skip Discovery</button>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
           {NETWORKS.map(net => (
             <button
               key={net.id}
               onClick={() => setSelectedSsid(net.ssid)}
               style={{ 
                 padding: '16px', 
                 background: selectedSsid === net.ssid ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)', 
                 borderRadius: '16px', 
                 border: `1px solid ${selectedSsid === net.ssid ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)'}`,
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 cursor: 'pointer'
               }}
             >
                <div style={{ textAlign: 'left' }}>
                   <p style={{ fontSize: '14px', fontWeight: 900, color: '#fff', margin: 0 }}>{net.ssid}</p>
                   <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>{net.security} // {net.signal}% Signal</p>
                </div>
                {selectedSsid === net.ssid && <Check size={16} style={{ color: '#3b82f6' }} />}
             </button>
           ))}
        </div>
      )}

      {/* FOOTER ACTION */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
         <button
           disabled={scanning || connecting}
           onClick={handleConnect}
           style={{ 
             width: '100%', 
             padding: '16px', 
             background: (scanning || connecting) ? 'rgba(255,255,255,0.05)' : '#fff', 
             color: (scanning || connecting) ? 'rgba(255,255,255,0.2)' : '#000', 
             borderRadius: '16px', 
             border: 'none', 
             fontWeight: 900, 
             fontSize: '15px', 
             cursor: (scanning || connecting) ? 'not-allowed' : 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '12px',
             textTransform: 'uppercase'
           }}
         >
            {connecting ? 'Handshaking...' : 'Establish Connection'}
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default NetworkSetup;
