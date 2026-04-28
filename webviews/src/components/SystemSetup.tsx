import React, { useState } from 'react';
import { Settings, Check, Monitor, Zap, Shield, User, Globe } from 'lucide-react';

interface Props {
  onComplete: (data: any) => void;
}

const SystemSetup: React.FC<Props> = ({ onComplete }) => {
  const [config, setConfig] = useState({
    username: 'quest',
    hostname: 'linux-machine',
    profile: 'Workstation',
  });

  const PROFILES = [
    { 
      id: 'Workstation', 
      label: 'Elite Workstation', 
      desc: 'Optimized for stability & production.', 
      icon: Monitor, 
      color: '#3b82f6',
      details: 'GNOME / Systemd / Stable Kernel'
    },
    { 
      id: 'Gaming', 
      label: 'Gaming & Power', 
      desc: 'Maximized for raw Gen4 performance.', 
      icon: Zap, 
      color: '#f59e0b',
      details: 'KDE Plasma / Zen Kernel / performance-tuned'
    },
    { 
      id: 'Minimalist', 
      label: 'Core Minimalist', 
      desc: 'Lean, hardened & security-focused.', 
      icon: Shield, 
      color: '#10b981',
      details: 'Sway WM / Hardened Kernel / OpenRC'
    }
  ];

  const isConfigValid = config.username.trim() !== '' && config.hostname.trim() !== '';

  return (
    <div style={{ height: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Settings style={{ color: '#3b82f6' }} size={18} />
         </div>
         <div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>System Personality</h1>
            <p style={{ fontSize: '10px', color: '#fff', opacity: 0.4, fontWeight: 700, margin: 0 }}>Select a deployment profile.</p>
         </div>
      </div>

      {/* IDENTITY INPUTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.3 }}>
               <User size={10} />
               <label style={{ fontSize: '8px', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>Username</label>
            </div>
            <input 
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${config.username.trim() === '' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '10px', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none' }}
              placeholder="quest"
            />
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.3 }}>
               <Globe size={10} />
               <label style={{ fontSize: '8px', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>Hostname</label>
            </div>
            <input 
              value={config.hostname}
              onChange={(e) => setConfig({ ...config, hostname: e.target.value })}
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${config.hostname.trim() === '' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '10px', color: '#fff', fontSize: '12px', fontWeight: 700, outline: 'none' }}
              placeholder="linux-box"
            />
         </div>
      </div>

      {/* PROFILE SELECTOR */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingBottom: '10px' }}>
         <label style={{ fontSize: '8px', color: '#fff', opacity: 0.3, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Deployment Profiles</label>
         {PROFILES.map((p) => (
           <button
             key={p.id}
             onClick={() => setConfig({ ...config, profile: p.id })}
             style={{ 
               padding: '12px', 
               background: config.profile === p.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
               borderRadius: '16px', 
               border: `1px solid ${config.profile === p.id ? p.color : 'rgba(255,255,255,0.05)'}`,
               display: 'flex', 
               alignItems: 'center', 
               gap: '16px',
               textAlign: 'left',
               cursor: 'pointer',
               transition: 'all 0.2s',
               position: 'relative',
               overflow: 'hidden'
             }}
           >
              {config.profile === p.id && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: p.color }} />}
              <div style={{ padding: '8px', background: `${p.color}15`, borderRadius: '12px' }}>
                 <p.icon size={20} style={{ color: p.color }} />
              </div>
              <div style={{ flexGrow: 1 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#fff', margin: 0 }}>{p.label}</h3>
                    {config.profile === p.id && <div style={{ background: p.color, width: '6px', height: '6px', borderRadius: '50%' }} />}
                 </div>
                 <p style={{ fontSize: '10px', color: '#fff', opacity: 0.5, margin: '2px 0 0 0' }}>{p.desc}</p>
                 <span style={{ fontSize: '8px', fontWeight: 900, color: p.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px', display: 'block' }}>{p.details}</span>
              </div>
              {config.profile === p.id && <Check size={16} style={{ color: p.color }} />}
           </button>
         ))}
      </div>

      {/* FOOTER ACTION */}
      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
         <button
           disabled={!isConfigValid}
           onClick={() => onComplete(config)}
           style={{ 
             width: '100%', 
             padding: '14px', 
             background: isConfigValid ? '#fff' : 'rgba(255,255,255,0.05)', 
             color: isConfigValid ? '#000' : 'rgba(255,255,255,0.2)', 
             borderRadius: '12px', 
             border: 'none', 
             fontWeight: 900, 
             fontSize: '13px', 
             cursor: isConfigValid ? 'pointer' : 'not-allowed',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '10px',
             textTransform: 'uppercase'
           }}
         >
            <Check size={16} />
            {isConfigValid ? 'Commit System Identity' : 'Validation Required'}
         </button>
      </div>
    </div>
  );
};

export default SystemSetup;
