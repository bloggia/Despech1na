import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full space-y-3 bg-white neo-border p-4 text-black">
      <div className="flex justify-between items-center px-1">
        <span className="font-black uppercase text-sm italic">
          Felicidad de la Novia
        </span>
        <motion.div
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 1, repeat: Infinity }}
        >
          <Heart fill={progress === 100 ? "#ff0000" : "none"} className="text-red-600" size={24} />
        </motion.div>
      </div>
      <div className="h-8 bg-gray-200 border-2 border-black overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-red-600"
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold uppercase italic opacity-70">
        <span>Resaca</span>
        <span>{Math.round(progress)}% Completo</span>
        <span>Éxtasis Total</span>
      </div>
      {progress === 100 && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center tattoo-font text-3xl text-red-600"
        >
          ¡Agustina está pletórica! ¡Premio desbloqueado!
        </motion.p>
      )}
    </div>
  );
}
