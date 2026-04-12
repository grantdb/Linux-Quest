import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: (success: boolean) => void;
}

// Defined outside component — stable, no re-creation on render
const DRIVERS = [
  { id: 'invidia', label: '1) invidia (Proprietary)', key: '1' },
  { id: 'amd', label: '2) amd (Open Source)', key: '2' },
  { id: 'generic', label: '3) generic-default', key: '3' }
];

const TIMER_DURATION = 5;

const BonusDrivers: React.FC<Props> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [targetDriver, setTargetDriver] = useState('');
  // Refs so interval/keydown callbacks see latest values without being in deps
  const statusRef = useRef<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const randomDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    setTargetDriver(randomDriver.id);
  }, []);

  // Single, stable interval — uses functional updater so timeLeft is not a dep
  useEffect(() => {
    const timer = setInterval(() => {
      if (statusRef.current !== 'IDLE') {
        clearInterval(timer);
        return;
      }
      setTimeLeft(prev => {
        const next = Math.max(0, prev - 0.1);
        if (next === 0) {
          clearInterval(timer);
          statusRef.current = 'FAILED';
          setStatus('FAILED');
          setTimeout(() => onCompleteRef.current(false), 1500);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []); // runs once on mount

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'IDLE') return;

      const driver = DRIVERS.find(d => d.key === e.key);
      if (driver) {
        if (driver.id === targetDriver) {
          statusRef.current = 'SUCCESS';
          setStatus('SUCCESS');
          setTimeout(() => onCompleteRef.current(true), 1500);
        } else {
          statusRef.current = 'FAILED';
          setStatus('FAILED');
          setTimeout(() => onCompleteRef.current(false), 1500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetDriver]);

  return (
    <div className="flex flex-col h-full items-center justify-center space-y-8 bg-black/40 p-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-terminal-bright tracking-tighter">DRIVER INJECTION REQUIRED</h2>
        <div className="flex items-center justify-center space-x-2 text-terminal-dim">
          <Cpu className="w-4 h-4" />
          <span className="text-xs uppercase">
            Detected GPU: {targetDriver === 'invidia' ? 'NVIDIA GeForce RTX 4090 (Virtual)' : targetDriver === 'amd' ? 'AMD Radeon RX 7900 (Virtual)' : 'Unknown Graphics Adapter'}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        {DRIVERS.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              if (statusRef.current !== 'IDLE') return;
              if (d.id === targetDriver) {
                statusRef.current = 'SUCCESS';
                setStatus('SUCCESS');
                setTimeout(() => onCompleteRef.current(true), 1500);
              } else {
                statusRef.current = 'FAILED';
                setStatus('FAILED');
                setTimeout(() => onCompleteRef.current(false), 1500);
              }
            }}
            disabled={status !== 'IDLE'}
            className={`w-full p-4 border-2 text-left font-mono transition-all ${
              status === 'IDLE'
                ? 'border-terminal-dim hover:border-terminal-bright hover:bg-terminal-dim/20'
                : d.id === targetDriver && status === 'SUCCESS'
                ? 'border-terminal-green bg-terminal-green/20'
                : d.id !== targetDriver && status === 'FAILED'
                ? 'border-red-500 bg-red-500/20'
                : 'border-terminal-dim opacity-50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-5 h-5 ${timeLeft < 2 ? 'text-red-500 animate-pulse' : 'text-terminal-dim'}`} />
          <span className="text-sm font-bold uppercase tracking-widest">
            {status === 'IDLE' ? `KERNEL PANIC IN: ${timeLeft.toFixed(1)}s` : status === 'SUCCESS' ? 'INJECTION SUCCESSFUL' : 'DRIVER MISMATCH - SYSTEM UNSTABLE'}
          </span>
        </div>
        <div className="w-64 h-1 bg-terminal-dim">
          <motion.div
            className={`h-full ${timeLeft < 2 ? 'bg-red-500' : 'bg-terminal-green'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {status === 'SUCCESS' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-terminal-green"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Performance Optimization Applied</span>
        </motion.div>
      )}
    </div>
  );
};

export default BonusDrivers;
