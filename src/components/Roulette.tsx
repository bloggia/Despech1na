import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MainTheme } from '../types';
import { RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface RouletteProps {
  themes: MainTheme[];
  onSpinEnd: (theme: MainTheme) => void;
  disabled: boolean;
}

export default function Roulette({ themes, onSpinEnd, disabled }: RouletteProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinRef = useRef(0);

  const spin = () => {
    if (isSpinning || disabled) return;
    
    setIsSpinning(true);
    const extraRotations = 10; // 10 full turns
    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = spinRef.current + (extraRotations * 360) + randomAngle;
    
    spinRef.current = newRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate which theme was selected
      const normalizedAngle = (360 - (newRotation % 360)) % 360;
      const themeIndex = Math.floor(normalizedAngle / (360 / themes.length));
      onSpinEnd(themes[themeIndex]);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative w-64 h-64">
        {/* Pointer */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-20 w-8 h-10 bg-black neo-border rounded-b-full flex items-center justify-center">
            <div className="w-2 h-4 bg-red-600 rounded-full animate-pulse" />
        </div>
        
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.44, 0, 0, 1] }}
          className="w-full h-full rounded-full border-8 border-black bg-white overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        >
          {themes.map((theme, index) => {
            const angle = 360 / themes.length;
            const rotate = index * angle;
            return (
              <div
                key={theme.id}
                className="absolute inset-0 origin-center"
                style={{
                  transform: `rotate(${rotate}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.tan((angle * Math.PI) / 360)}% 0)`
                }}
              >
                <div 
                  className={index % 2 === 0 ? "bg-red-600 h-full w-full" : "bg-white h-full w-full"}
                  style={{ transform: `rotate(${angle / 2}deg)` }}
                >
                    <span className={cn(
                      "absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase whitespace-nowrap rotate-90",
                      index % 2 === 0 ? "text-white" : "text-black"
                    )}>
                        {theme.title}
                    </span>
                </div>
              </div>
            );
          })}
          {/* Inner circle */}
          <div className="absolute inset-0 m-auto w-16 h-16 bg-black rounded-full border-4 border-white flex items-center justify-center z-10 shadow-lg">
             <span className="text-white text-2xl font-black italic">!</span>
          </div>
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={cn(
          "neo-border bg-black text-white py-4 px-12 font-black uppercase text-xl transform active:scale-95 transition-all",
          (isSpinning || disabled) && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center space-x-3">
          <RotateCw className={cn(isSpinning && "animate-spin")} />
          <span>{isSpinning ? "Girando..." : "¡GIRAR!"}</span>
        </div>
      </button>
    </div>
  );
}
