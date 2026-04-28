import React, { useState, useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import { GameState } from './types';
import type { GameData } from './types';
import HardwareSelect from './components/HardwareSelect';
import UsbPrep from './components/UsbPrep';
import NetworkSetup from './components/NetworkSetup';
import BiosEntry from './components/BiosEntry';
import InstallLogic from './components/InstallLogic';
import BonusDrivers from './components/BonusDrivers';
import Partitioning from './components/Partitioning';
import SystemSetup from './components/SystemSetup';
import RebootValidation from './components/RebootValidation';
import Leaderboard from './components/Leaderboard';
import { Check, Activity, HardDrive, AlertOctagon, ChevronLeft, Terminal } from 'lucide-react';

// FAIL-SAFE ERROR BOUNDARY
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0f172a', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <AlertOctagon size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 900 }}>SYSTEM_INTERRUPT</h1>
          <p style={{ opacity: 0.6, maxWidth: '400px', margin: '16px 0' }}>{this.state.error?.message || 'CRITICAL_FAULT_IN_DASHBOARD_CORE'}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 32px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}>REBOOT_SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HARDWARE_SELECT);
  const [gameData, setGameData] = useState<GameData>({
    leaderboard: []
  });

  // DEVVIT MESSAGE HANDLING
  useEffect(() => {
    const handleMessage = (ev: MessageEvent) => {
      const { type, data } = ev.data;
      if (type === 'INITIAL_STATE' || type === 'LEADERBOARD_UPDATE') {
        setGameData(prev => ({ ...prev, leaderboard: data.leaderboard }));
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'READY' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const nextStep = (newData: Partial<GameData>) => {
    const updatedData = { ...gameData, ...newData };
    setGameData(updatedData);
    
    const states = Object.values(GameState).filter(v => typeof v === 'number') as number[];
    const currentIndex = states.indexOf(gameState as number);
    
    if (gameState === GameState.REBOOT_VALIDATION) {
      // Calculate final score
      const base = 1000;
      const biosBonus = Math.max(0, 5000 - (updatedData.biosTime || 5000)) / 10;
      const finalScore = Math.floor(base + biosBonus + (updatedData.partitionScore || 0));
      
      setGameData(prev => ({ ...prev, finalScore }));
      setGameState(GameState.SUCCESS);
      
      // Send to Devvit
      window.parent.postMessage({ type: 'GAME_COMPLETE', data: { score: finalScore } }, '*');
      return;
    }

    if (currentIndex < states.length - 1) {
      setGameState(states[currentIndex + 1] as GameState);
    }
  };

  const prevStep = () => {
    const states = Object.values(GameState).filter(v => typeof v === 'number') as number[];
    const currentIndex = states.indexOf(gameState as number);
    if (currentIndex > 0) {
      setGameState(states[currentIndex - 1] as GameState);
    }
  };

  const STEPS = [
    { state: GameState.HARDWARE_SELECT, label: 'Platform' },
    { state: GameState.USB_PREP, label: 'Media Prep' },
    { state: GameState.BIOS_ENTRY, label: 'BIOS' },
    { state: GameState.PARTITIONING, label: 'Storage' },
    { state: GameState.INSTALL_LOGIC, label: 'Deployment' },
    { state: GameState.NETWORK_SETUP, label: 'Network' },
    { state: GameState.SYSTEM_SETUP, label: 'Profile' },
    { state: GameState.BONUS_DRIVERS, label: 'Drivers' },
    { state: GameState.REBOOT_VALIDATION, label: 'Finalize' },
  ];

  const getStorageTarget = () => {
    if (gameData.hardware === 'HYBRID_MOBILE' || gameData.hardware === 'RASPI_ARM') return 'eMMC_FLASH_0';
    return 'NVME_BLK_0';
  };

  return (
    <ErrorBoundary>
      <div style={{ height: '100vh', width: '100vw', background: '#020617', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        {/* MAIN WIZARD FRAME */}
        <div style={{ 
          width: '100%', 
          maxWidth: '800px', 
          height: '100%', 
          maxHeight: '600px', 
          background: 'rgba(15, 23, 42, 0.4)', 
          backdropFilter: 'blur(30px)', 
          borderRadius: '24px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)',
          overflow: 'hidden'
        }}>
          
          {/* WIZARD TITLE BAR */}
          <div style={{ height: '48px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Terminal size={16} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#fff', opacity: 0.6, letterSpacing: '0.1em' }}>LINUX_QUEST // SETUP_WIZARD_v9.0</span>
             </div>
             <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.5 }} />
             </div>
          </div>

          {/* WIZARD BODY */}
          <div style={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
             {/* LEFT NAVIGATION RAIL */}
             <div style={{ width: '200px', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {STEPS.map((step, i) => {
                  const isActive = gameState === step.state;
                  const isPast = (gameState as number) > (step.state as number);
                  
                  return (
                    <div 
                      key={step.label}
                      style={{ 
                        padding: '12px 24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        borderLeft: `3px solid ${isActive ? '#3b82f6' : 'transparent'}`,
                        transition: 'all 0.3s'
                      }}
                    >
                       <div style={{ 
                         width: '18px', 
                         height: '18px', 
                         borderRadius: '50%', 
                         border: `1.5px solid ${isActive || isPast ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         background: isPast ? '#3b82f6' : 'transparent'
                       }}>
                          {isPast ? <Check size={10} color="#fff" strokeWidth={3} /> : <span style={{ fontSize: '9px', fontWeight: 900, color: isActive ? '#3b82f6' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>}
                       </div>
                       <span style={{ fontSize: '11px', fontWeight: 800, color: isActive ? '#fff' : 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</span>
                    </div>
                  );
                })}
             </div>

             {/* CONTENT AREA */}
             <div key={gameState} className="animate-fade-in" style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)' }} />
                
                {gameState === GameState.HARDWARE_SELECT && <HardwareSelect onComplete={(hardware) => nextStep({ hardware })} />}
                {gameState === GameState.USB_PREP && <UsbPrep onComplete={(usbFormat, flashTool, scheme) => nextStep({ usbFormat, flashTool, scheme })} />}
                {gameState === GameState.BIOS_ENTRY && <BiosEntry hardware={gameData.hardware || 'INTEL_CORE'} onComplete={(biosTime) => nextStep({ biosTime })} />}
                {gameState === GameState.PARTITIONING && <Partitioning onComplete={(partitionScore) => nextStep({ partitionScore })} />}
                {gameState === GameState.INSTALL_LOGIC && <InstallLogic onComplete={() => nextStep({})} />}
                {gameState === GameState.NETWORK_SETUP && <NetworkSetup onComplete={(netData) => nextStep({ netData })} />}
                {gameState === GameState.SYSTEM_SETUP && <SystemSetup hardware={gameData.hardware} onComplete={(data) => nextStep(data)} />}
                {gameState === GameState.BONUS_DRIVERS && <BonusDrivers onComplete={(driversSuccess) => nextStep({ driversSuccess })} />}
                {gameState === GameState.REBOOT_VALIDATION && <RebootValidation gameData={gameData} onComplete={() => nextStep({})} />}

                {gameState === GameState.SUCCESS && (
                  <div style={{ height: '100%', display: 'flex', overflow: 'hidden', background: '#020617' }}>
                    {/* LEFT PANEL: SUCCESS INFO */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ padding: '40px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
                          <div style={{ position: 'relative' }}>
                             <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)', filter: 'blur(20px)', animation: 'pulse 2s infinite' }} />
                             <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Activity size={60} style={{ color: '#3b82f6', filter: 'drop-shadow(0 0 10px #3b82f6)' }} />
                             </div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                             <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '0.1em' }}>LINUX_QUEST_OS</h1>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                                <span style={{ fontSize: '8px', fontWeight: 900, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>v9.0.4-INDUSTRIAL</span>
                                <span style={{ fontSize: '8px', fontWeight: 900, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>KERNEL_ALIGNED</span>
                             </div>
                          </div>

                          {/* BOOT LOG SIMULATION */}
                          <div style={{ width: '100%', maxWidth: '300px', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                             {[
                               '[ OK ] INITIALIZING_CORE_DNA',
                               '[ OK ] MOUNTING_BLOCK_STORAGE',
                               '[ OK ] STARTING_WAYLAND_SHELL',
                               '[ OK ] USER_AUTH_COMMITTED'
                             ].map((log, i) => (
                               <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '9px', fontFamily: 'monospace', animation: `fadeIn ${0.5 + i * 0.2}s` }}>
                                  <span style={{ color: '#10b981', fontWeight: 900 }}>[ OK ]</span>
                                  <span style={{ color: '#fff', opacity: 0.4 }}>{log.split('] ')[1]}</span>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* SCORE OVERLAY */}
                       <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontSize: '8px', fontWeight: 900, color: '#fff', opacity: 0.3 }}>SYSTEM_EFFICIENCY_INDEX</span>
                             <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{gameData.finalScore || 0}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                             <span style={{ fontSize: '8px', fontWeight: 900, color: '#3b82f6' }}>STABILITY: 100%</span>
                             <p style={{ fontSize: '7px', opacity: 0.3, margin: 0 }}>READY_FOR_DEPLOYMENT</p>
                          </div>
                       </div>
                    </div>

                    {/* RIGHT PANEL: LEADERBOARD */}
                    <div style={{ width: '320px', background: 'rgba(0,0,0,0.2)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                       <Leaderboard scores={gameData.leaderboard || []} />
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* WIZARD FOOTER */}
          <div style={{ height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
                   <HardDrive size={14} style={{ color: '#3b82f6' }} />
                   <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>TARGET: {getStorageTarget()}</span>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={prevStep} 
                  disabled={gameState === 0 || gameState === GameState.SUCCESS}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: '12px', fontWeight: 800, opacity: (gameState === 0 || gameState === GameState.SUCCESS) ? 0.2 : 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                   <ChevronLeft size={16} />
                   Back
                </button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.3 }}>
                   <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>V9.0.0</span>
                   <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                </div>
             </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          *::-webkit-scrollbar { display: none !important; }
          * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        `}} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
