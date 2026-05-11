import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUnlock = async () => {
    if (auth) {
        try {
            await signInAnonymously(auth);
        } catch (e) {
            console.error("Auth failed", e);
        }
    }
    setUnlocked(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-pink flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-brand-pink min-h-screen">
      <AnimatePresence mode="wait">
        {!unlocked && !user ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Landing onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
