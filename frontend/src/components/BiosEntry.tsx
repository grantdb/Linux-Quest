import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Hardware } from '../types';

interface Props {
  hardware: Hardware;
  onComplete: (time: number) => void;
}

// Defined outside component so it's stable across renders
const KEYS = ['F2', 'F10', 'F8', 'DEL'];

const BiosEntry: React.FC<Props> = ({ hardware, onComplete }) => {
  const totalTime = hardware === 'LAPTOP' ? 2 : hardware === 'PC' ? 4 : 8;
  const [fKey, setFKey] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const startTime = useRef(Date.now());
  // Ref so the interval callback can read latest success without a dependency
  const successRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setFKey(KEYS[Math.floor(Math.random() * KEYS.length)]);
  }, []);

  // Single, stable interval — uses functional updater so it never needs timeLeft in deps
  useEffect(() => {
    if (success) return;

    const timer = setInterval(() => {
      if (successRef.current) {
        clearInterval(timer);
        return;
      }
      setTimeLeft(prev => {
        const next = Math.max(0, prev - 0.1);
        if (next === 0) {
          clearInterval(timer);
          onCompleteRef.current(99999);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [success]); // only restarts if success flips

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (successRef.current) return;
      const pressed = e.key.toUpperCase();
      if (pressed === fKey || (pressed === 'DELETE' && fKey === 'DEL')) {
        successRef.current = true;
        setSuccess(true);
        setTimeout(() => onCompleteRef.current(Date.now() - startTime.current), 1000);
      } else {
        setAttempts(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fKey]);

  return (
    <div className="flex flex-col h-full items-center justify-center space-y-8 bg-black/50 p-8">
      <div className="text-terminal-bright font-mono text-lg space-y-1 self-start">
        <p>PhoenixBIOS Setup Utility</p>
        <p>Copyright 1985-2026 Phoenix Technologies Ltd.</p>
        <p>CPU: Virtual Pro x64 @ 3.40GHz</p>
        <p>Memory: 8192MB System RAM Passed</p>
        <p className="text-terminal-dim">Detected: {hardware} Hardware Profile</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {!success ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="text-5xl font-bold text-white bg-red-600 px-12 py-6 border-4 border-white shadow-2xl"
            >
              PRESS {fKey}
            </motion.div>
            <div className="w-64 h-2 bg-terminal-dim rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-terminal-bright"
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / totalTime) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-terminal-green/50 italic animate-pulse">TIME TO BOOT: {timeLeft.toFixed(1)}s</p>
            {attempts > 0 && <p className="text-red-400">MISFIRE! Total Attempts: {attempts}</p>}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            className="text-4xl font-bold text-terminal-bright"
          >
            Entering Setup...
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-12 grid grid-cols-4 gap-6">
        {KEYS.map(k => (
          <div
            key={k}
            className={`w-20 h-20 border-2 flex items-center justify-center font-bold text-2xl transition-all ${k === fKey && !success ? 'border-terminal-bright shadow-[0_0_15px_#00ff41]' : 'border-terminal-dim opacity-30'}`}
          >
            {k}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiosEntry;
