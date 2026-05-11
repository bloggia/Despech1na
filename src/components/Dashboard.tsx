import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ChevronLeft, Image as ImageIcon, Camera, CheckCircle2, RotateCcw, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GAME_THEMES } from '../constants';
import { MainTheme, SubTheme, GameState } from '../types';
import ProgressBar from './ProgressBar';
import Roulette from './Roulette';
import PhotoUploader from './PhotoUploader';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [gameState, setGameState] = useState<GameState>({
    isUnlocked: true,
    totalPoints: 0,
    completedSubThemes: [],
    happinessLevel: 0,
  });
  const [selectedTheme, setSelectedTheme] = useState<MainTheme | null>(null);
  const [activeSubTheme, setActiveSubTheme] = useState<SubTheme | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [photosMap, setPhotosMap] = useState<Record<string, string>>({});

  // Load progress from Firestore
  useEffect(() => {
    if (!auth?.currentUser) return;
    const fetchProgress = async () => {
      const docRef = doc(db!, 'progress', auth.currentUser!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGameState({
          isUnlocked: true,
          totalPoints: data.totalPoints,
          completedSubThemes: data.completedSubThemes,
          happinessLevel: data.happinessLevel,
        });
        setPhotosMap(data.photos || {});
      }
    };
    fetchProgress();
  }, []);

  const saveProgress = async (newTotalPoints: number, newCompleted: string[], newHappiness: number, newPhoto?: string, subThemeId?: string) => {
    if (!auth?.currentUser || !db) return;
    
    const newPhotos = { ...photosMap };
    if (newPhoto && subThemeId) {
      newPhotos[subThemeId] = newPhoto;
    }
    
    await setDoc(doc(db, 'progress', auth.currentUser.uid), {
      userId: auth.currentUser.uid,
      totalPoints: newTotalPoints,
      completedSubThemes: newCompleted,
      happinessLevel: newHappiness,
      photos: newPhotos,
      updatedAt: serverTimestamp(),
    });
    setPhotosMap(newPhotos);
  };

  const handleSubThemeComplete = (subTheme: SubTheme, photoUrl: string) => {
    const newPoints = gameState.totalPoints + subTheme.points;
    const newCompleted = [...gameState.completedSubThemes, subTheme.id];
    const newHappiness = Math.min(100, gameState.happinessLevel + (subTheme.points / 5)); // Scaling happiness

    const newState = {
      ...gameState,
      totalPoints: newPoints,
      completedSubThemes: newCompleted,
      happinessLevel: newHappiness,
    };

    setGameState(newState);
    saveProgress(newPoints, newCompleted, newHappiness, photoUrl, subTheme.id);
    setActiveSubTheme(null);
  };

  const availableThemes = GAME_THEMES.filter(theme => 
    theme.subThemes.some(st => !gameState.completedSubThemes.includes(st.id))
  );

  useEffect(() => {
    if (gameState.happinessLevel >= 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff1493', '#d00000', '#ffffff']
      });
    }
  }, [gameState.happinessLevel]);

  return (
    <div className="min-h-screen bg-brand-pink p-4 pb-24 font-sans max-w-md mx-auto">
      {/* Header */}
      <header className="relative z-10 flex flex-col mb-8 text-black">
        <h2 className="text-6xl retro-title">Dashboard</h2>
        <div className="flex justify-between items-end">
          <p className="tattoo-font text-2xl ml-1">La Despedida de Agustina</p>
          <div className="bg-white neo-border p-3 text-center min-w-[100px]">
             <div className="text-[10px] font-black uppercase italic mb-1">Puntos</div>
             <div className="text-xl font-black italic">{gameState.totalPoints}</div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="mb-10 relative z-10">
        <ProgressBar progress={gameState.happinessLevel} />
      </div>

      <AnimatePresence mode="wait">
        {showProgress ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 relative z-10"
          >
            <h3 className="tattoo-font text-4xl text-black">Pruebas Superadas</h3>
            {gameState.completedSubThemes.length === 0 ? (
                <div className="neo-border bg-white p-8 text-center text-black">
                    <p className="font-bold uppercase text-[10px] opacity-50 italic">Aún no has completado ninguna prueba.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2">
                {GAME_THEMES.flatMap(t => t.subThemes)
                    .filter(st => gameState.completedSubThemes.includes(st.id))
                    .map(st => (
                  <div key={st.id} className="flex items-center gap-3 p-3 glass neo-border text-black">
                    <div className="w-12 h-12 bg-white neo-border flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {photosMap[st.id] ? (
                        <img src={photosMap[st.id]} alt={st.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🔥</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-sm uppercase">{st.title}</div>
                      <div className="text-[10px] font-bold opacity-80 uppercase">+{st.points} Puntos • Foto Subida</div>
                    </div>
                    <CheckCircle2 className="text-black" size={20} />
                  </div>
                ))}
                </div>
            )}
          </motion.div>
        ) : selectedTheme ? (
          <motion.div
            key="selected-theme"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6 relative z-10"
          >
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedTheme(null)} 
                className="bg-black text-white p-3 neo-border hover:scale-105 transition-transform"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="tattoo-font text-4xl text-black">{selectedTheme.title}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {selectedTheme.subThemes.map(st => {
                const isCompleted = gameState.completedSubThemes.includes(st.id);
                return (
                  <button
                    key={st.id}
                    disabled={isCompleted}
                    onClick={() => setActiveSubTheme(st)}
                    className={cn(
                      "neo-border p-4 text-left transition-all relative overflow-hidden group flex flex-col",
                      isCompleted 
                        ? "bg-gray-400/50 opacity-60 text-black grayscale" 
                        : "bg-white text-black hover:bg-brand-light-pink"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black uppercase text-sm italic">{st.title}</span>
                      <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black neo-border">
                        {st.points} PTS
                      </span>
                    </div>
                    <p className="text-[10px] font-bold uppercase opacity-70 leading-tight italic">{st.description}</p>
                    {isCompleted && (
                        <div className="absolute top-1/2 right-4 -translate-y-1/2">
                             <CheckCircle2 className="text-black" />
                        </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="roulette"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="py-10 relative z-10"
          >
            <div className="bg-white neo-border p-4 flex flex-col items-center">
                <div className="absolute top-0 right-4 bg-red-600 text-white px-4 py-1 font-black text-[10px] uppercase -mt-3 neo-border z-20">
                  ¿Qué toca ahora?
                </div>
                <Roulette 
                  themes={availableThemes} 
                  onSpinEnd={(theme) => setSelectedTheme(theme)}
                  disabled={availableThemes.length === 0}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Prize Content */}
      <AnimatePresence>
        {gameState.happinessLevel >= 100 && !showProgress && !selectedTheme && !activeSubTheme && (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="neo-border bg-white p-8 text-center space-y-6 my-8 relative z-10"
            >
                <div className="bg-red-600 neo-border p-4 text-white">
                    <Trophy className="mx-auto mb-2" size={48} />
                    <h3 className="retro-title text-4xl">¡PREMIO FINAL!</h3>
                </div>
                <p className="tattoo-font text-2xl text-black">Has completado los retos de San Isidro.</p>
                <div className="bg-brand-light-pink neo-border p-6 text-black border-dashed">
                    <p className="font-black text-2xl uppercase italic">Tu regalo te espera en la Pradera</p>
                    <p className="text-[10px] font-bold uppercase opacity-80 mt-4 border-t-2 border-black pt-2">Enseña esta pantalla al organizador</p>
                </div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="flex justify-center text-red-600"
                >
                    <PartyPopper size={48} />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* SubTheme Action Modal */}
      <AnimatePresence>
        {activeSubTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-pink/95 flex flex-col p-6 overflow-y-auto"
          >
             <div className="w-full max-w-sm mx-auto space-y-8 py-10">
                <header className="space-y-2">
                    <h4 className="text-3xl font-display text-brand-red uppercase leading-none">{activeSubTheme.title}</h4>
                    <p className="font-retro text-sm text-brand-cream">{activeSubTheme.description}</p>
                </header>

                <div className="roadmap-border bg-white p-6 space-y-6">
                    {activeSubTheme.type === 'trivia' ? (
                        <div className="space-y-4">
                            <p className="font-display text-brand-red text-center">Trivia Visual: ¿Es Esteban?</p>
                            {/* Trivia placeholder since we don't have the assets, but I'll make a generic structure */}
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3].map(i => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSubThemeComplete(activeSubTheme, 'trivia-url')}
                                        className="roadmap-border aspect-square bg-gray-200 flex items-center justify-center font-retro text-xs"
                                    >
                                        OMBLIGO {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <PhotoUploader 
                            folder={activeSubTheme.type}
                            onUploadSuccess={(url) => handleSubThemeComplete(activeSubTheme, url)} 
                        />
                    )}
                </div>

                <button 
                  onClick={() => setActiveSubTheme(null)}
                  className="w-full font-retro text-brand-cream uppercase text-sm border-b border-brand-cream pb-1"
                >
                    Cancelar y volver
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-brand-cream roadmap-border border-x-0 border-b-0 flex justify-around">
          <button onClick={() => {setSelectedTheme(null); setShowProgress(false)}} className="flex flex-col items-center">
             <RotateCcw className="text-brand-red" size={24} />
             <span className="text-[10px] font-retro uppercase">Ruleta</span>
          </button>
          <button onClick={() => setShowProgress(true)} className="flex flex-col items-center">
             <ImageIcon className="text-brand-red" size={24} />
             <span className="text-[10px] font-retro uppercase">Progreso</span>
          </button>
      </nav>
    </div>
  );
}
