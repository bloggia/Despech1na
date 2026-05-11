import { useState, useEffect } from 'react';
import { Lock, Heart, Calendar, MapPin, Camera, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PASSWORD, PARTY_DATE, GameState } from '../types';
import { cn, formatTimeLeft } from '../lib/utils';

export default function Landing({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(PARTY_DATE.getTime() - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = PARTY_DATE.getTime() - Date.now();
      setTimeLeft(formatTimeLeft(diff));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    if (password.toUpperCase() === PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 bg-brand-pink relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-red opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-2 z-10"
      >
        <h1 className="text-7xl retro-title">
          Despechina
        </h1>
        <p className="text-3xl tattoo-font text-black">La Despedida de Agustina</p>
      </motion.div>

      {/* Countdown Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="neo-border bg-white p-6 w-full max-w-sm z-10"
      >
        <div className="flex items-center justify-center space-x-2 text-black mb-4">
          <Calendar size={20} className="text-red-600" />
          <span className="font-bold uppercase tracking-widest text-sm italic">Sábado 16 Mayo • 10:00 AM</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="flex flex-col bg-red-600 neo-border p-2 text-white">
              <span className="text-3xl font-black italic leading-none">
                {Math.max(0, value).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lock Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs space-y-4 z-10"
      >
        <div className={cn(
          "neo-border bg-white p-4 flex items-center space-x-3 transition-colors",
          error && "bg-red-100"
        )}>
          <Lock className={cn("text-red-600", error && "animate-bounce")} />
          <input
            type="text"
            placeholder="LOCKED"
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className="bg-transparent border-none outline-none font-black text-black placeholder:text-gray-400 w-full uppercase"
          />
          <button onClick={handleUnlock} className="bg-black text-white p-2 neo-border hover:scale-110 transition-transform">
            <Play fill="currentColor" size={16} />
          </button>
        </div>
        <p className="text-xs font-bold uppercase text-black/80 px-4">
          Pronto recibirás más info. De momento invita a todo el mundo que quieras para el sábado a las 18:00.
        </p>
      </motion.div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm z-10">
        <div className="neo-border bg-white p-4 text-left relative text-black">
          <div className="absolute top-2 right-2 text-red-600/10">
            <MapPin size={64} />
          </div>
          <h3 className="tattoo-font text-3xl mb-1">Roadmap</h3>
          <div className="space-y-1 font-bold uppercase text-[10px]">
             <p>10:00 AM - Recogida sorpresas</p>
             <p>13:00 PM - Comida & Bebida</p>
             <p>18:00 PM - Open Party Vistillas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
