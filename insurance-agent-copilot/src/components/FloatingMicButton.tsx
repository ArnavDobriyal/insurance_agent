import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

interface FloatingMicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export default function FloatingMicButton({ isListening, onClick }: FloatingMicButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-24 right-6 z-[100] glass-effect rounded-lg px-4 py-2 max-w-[200px]"
          >
            <p className="text-xs text-white">Click to start voice input</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isListening
            ? 'bg-semantic-error animate-pulse'
            : 'bg-gradient-to-br from-primary to-purple-600 hover:scale-110'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        title={isListening ? 'Click to stop recording' : 'Click to start voice input'}
      >
        <Mic className="w-7 h-7 text-white" />
        
        {/* Ripple effect when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-semantic-error"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-semantic-error"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.button>
    </>
  );
}
