import { useState, useEffect } from 'react';
import { Lock, Heart, Calendar, MapPin, Camera, Play, CheckCircle2, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PASSWORD, PARTY_DATE, GameState } from '../types';
import { cn, formatTimeLeft } from '../lib/utils';

export default function Landing({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isPrompted, setIsPrompted] = useState(false);
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
    <div className="min-h-screen bg-brand-pink p-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-sm h-auto min-h-[85vh] bg-brand-pink relative overflow-hidden flex flex-col items-center justify-center space-y-6 p-8 border-[6px] border-brand-red rounded-[40px] shadow-2xl">
        {/* Decorative elements from flyer */}
        <div className="absolute top-8 left-8 opacity-40"><Heart className="text-brand-red" size={32} /></div>
        <div className="absolute top-8 right-8 opacity-40 flex space-x-1">
          <PartyPopper className="text-brand-red" size={32}/>
        </div>
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center space-y-2 z-10"
        >
          <span className="font-display text-4xl uppercase tracking-widest text-brand-red">Agustina</span>
          <div className="w-16 h-16 rounded-full border-2 border-brand-red border-dashed flex items-center justify-center bg-white/20">
             <span className="text-3xl animate-pulse">🪩</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="text-center z-10"
        >
           <h1 className="font-display text-6xl leading-[0.8] text-brand-red flex flex-col">
              <span>AFTERPARTY</span>
              <span className="text-4xl mt-2">DESPEDIDA</span>
           </h1>
        </motion.div>

        <div className="z-10 py-2">
            <span className="text-6xl animate-bounce">🍸</span>
        </div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="z-10"
        >
          <p className="font-script text-5xl text-brand-red drop-shadow-sm">¡Viva la novia!</p>
        </motion.div>

        <div className="z-10 text-center space-y-1">
           <p className="font-bold text-sm uppercase tracking-wider">Sábado 16 MAYO | 10:00h</p>
           <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60">Pradera - Vistillas</p>
        </div>

        {/* Lock Section */}
        <div className="w-full z-20 space-y-4 pt-2">
          {!isPrompted ? (
             <motion.button
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsPrompted(true)}
               className="group w-full bg-brand-red text-white py-4 font-display text-xl uppercase rounded-2xl shadow-[0_6px_0_rgb(160,0,0)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center space-x-3 outline-none focus:ring-4 focus:ring-brand-red/30"
             >
                <Lock size={20} className="group-hover:animate-bounce" />
                <span>ACCEDER</span>
             </motion.button>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col space-y-2"
            >
              <div className={cn(
                "neo-border bg-white p-2 flex items-center space-x-3 transition-all rounded-2xl",
                error && "bg-red-50 shake-animation border-red-600"
              )}>
                <input
                  autoFocus
                  type="text"
                  placeholder="PALABRA MÁGICA"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  className="bg-transparent border-none outline-none font-black text-brand-red placeholder:text-brand-red/20 w-full uppercase text-center text-lg py-2"
                />
                <button 
                  onClick={handleUnlock}
                  className="bg-brand-red text-white p-3 rounded-xl hover:bg-brand-red/90 transition-all shadow-md active:scale-95"
                >
                  <Play fill="currentColor" size={18} />
                </button>
              </div>
              <p className="text-[9px] font-black uppercase text-brand-red text-center opacity-70 tracking-widest">
                {error ? "CONTRASEÑA INCORRECTA" : "Introduce la contraseña"}
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {!isPrompted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-brand-red/5 p-4 rounded-3xl border-2 border-brand-red/20 border-dashed"
              >
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(timeLeft).map(([label, value]) => (
                        <div key={label} className="flex flex-col items-center">
                        <span className="text-xl font-display text-brand-red">
                            {Math.max(0, value).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[8px] uppercase font-bold text-brand-red/60">{label}</span>
                        </div>
                    ))}
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
