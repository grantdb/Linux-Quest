import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import type { GameData } from './types';
import HardwareSelect from './components/HardwareSelect';
import UsbPrep from './components/UsbPrep';
import BiosEntry from './components/BiosEntry';
import InstallLogic from './components/InstallLogic';
import RebootValidation from './components/RebootValidation';
import BonusDrivers from './components/BonusDrivers';
import Leaderboard from './components/Leaderboard';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HARDWARE_SELECT);
  const [gameData, setGameData] = useState<GameData>({});
  // Ref mirror of gameData to avoid stale closures inside nextStep callbacks
  const gameDataRef = useRef<GameData>({});

  // Communication with Devvit
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      const { type, data } = event.data;
      if (type === 'INITIAL_STATE' || type === 'LEADERBOARD_UPDATE') {
        setGameData(prev => {
          const next = { ...prev, leaderboard: data?.leaderboard };
          gameDataRef.current = next;
          return next;
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Signal to Devvit that we are ready for data
    window.parent.postMessage({ type: 'READY' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const calculateScore = (data: GameData) => {
    const base = 1000;
    const biosBonus = Math.max(0, 500 - (data.biosTime || 5000) / 10);
    const driverBonus = data.driversSuccess ? 500 : 0;
    const multiplier = data.hardware === 'LAPTOP' ? 2.5 : data.hardware === 'PC' ? 1.0 : 0.5;
    return Math.round((base + biosBonus + driverBonus) * multiplier);
  };

  const sendScoreToDevvit = (score: number) => {
    window.parent.postMessage({
      type: 'GAME_COMPLETE',
      data: { score }
    }, '*');
  };

  const nextStep = (dataUpdates: Partial<GameData>) => {
    // Merge into ref first so we always have fresh state
    const merged = { ...gameDataRef.current, ...dataUpdates };
    gameDataRef.current = merged;
    setGameData(merged);

    switch (gameState) {
      case GameState.HARDWARE_SELECT:
        setGameState(GameState.USB_PREP);
        break;
      case GameState.USB_PREP:
        setGameState(GameState.BIOS_ENTRY);
        break;
      case GameState.BIOS_ENTRY:
        if (dataUpdates.biosTime === 99999) {
          setGameState(GameState.FAILURE);
          gameDataRef.current = { ...merged, error: 'Boot sequence timed out. Systems failed to initialize.' };
          setGameData(gameDataRef.current);
        } else {
          setGameState(GameState.INSTALL_LOGIC);
        }
        break;
      case GameState.INSTALL_LOGIC:
        setGameState(GameState.BONUS_DRIVERS);
        break;
      case GameState.BONUS_DRIVERS:
        setGameState(GameState.REBOOT_VALIDATION);
        break;
      case GameState.REBOOT_VALIDATION:
        if (merged.error) {
          setGameState(GameState.FAILURE);
        } else {
          // Use ref to guarantee all accumulated data is present
          const score = calculateScore(merged);
          const withScore = { ...merged, finalScore: score };
          gameDataRef.current = withScore;
          setGameData(withScore);
          setGameState(GameState.SUCCESS);
          sendScoreToDevvit(score);
        }
        break;
      default:
        break;
    }
  };

  const renderState = () => {
    switch (gameState) {
      case GameState.HARDWARE_SELECT:
        return <HardwareSelect onComplete={(hardware) => nextStep({ hardware })} />;
      case GameState.USB_PREP:
        return <UsbPrep onComplete={(usbFormat, flashTool) => nextStep({ usbFormat, flashTool })} />;
      case GameState.BIOS_ENTRY:
        return <BiosEntry hardware={gameData.hardware!} onComplete={(biosTime) => nextStep({ biosTime })} />;
      case GameState.INSTALL_LOGIC:
        return <InstallLogic hardware={gameData.hardware!} onComplete={() => nextStep({})} />;
      case GameState.BONUS_DRIVERS:
        return <BonusDrivers onComplete={(driversSuccess) => nextStep({ driversSuccess })} />;
      case GameState.REBOOT_VALIDATION:
        return (
          <RebootValidation
            hardware={gameData.hardware!}
            usbFormat={gameData.usbFormat!}
            onComplete={(error) => nextStep({ error })}
          />
        );
      case GameState.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h1 className="text-4xl font-bold text-terminal-bright animate-pulse tracking-widest">SYSTEM BOOT SUCCESSFUL</h1>
            <div className="text-center">
              <p className="text-xl">Welcome to Linux Quest OS</p>
              {/* Display the stored finalScore — identical to what was submitted to Redis */}
              <p className="text-terminal-bright font-bold mt-2">FINAL SCORE: {gameData.finalScore ?? 0}</p>
            </div>
            {gameData.leaderboard && <Leaderboard scores={gameData.leaderboard} />}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border-2 border-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-colors font-bold"
            >
              REBOOT SYSTEM
            </button>
          </div>
        );
      case GameState.FAILURE:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h1 className="text-4xl font-bold text-red-500">BOOT ERROR: NO BOOTABLE MEDIUM</h1>
            <p className="text-xl text-red-400">{gameData.error || 'A fatal error occurred during boot.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-terminal-bg transition-colors"
            >
              Retry Installation
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen crt-monitor bg-terminal-bg p-4 flex items-center justify-center">
      <div className="scanlines"></div>
      <div className="scanline-sweep"></div>
      <div className="static-noise"></div>
      <div className="w-full h-full max-w-4xl max-h-[90vh] border-8 border-terminal-dim rounded-lg shadow-2xl relative bg-black/20">
        <div className="crt-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full"
            >
              {renderState()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;
