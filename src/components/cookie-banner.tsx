import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-20 z-50"
        >
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08] backdrop-blur-xl text-xs text-foreground/50 font-mono">
              <span>This site uses cookies for analytics.</span>
              <button
                type="button"
                onClick={decline}
                className="px-2.5 py-0.5 rounded text-foreground/40 hover:text-foreground/60 transition-colors"
              >
                No
              </button>
              <button
                type="button"
                onClick={accept}
                className="px-2.5 py-0.5 rounded bg-foreground/10 text-foreground/70 hover:bg-foreground/15 hover:text-foreground transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
