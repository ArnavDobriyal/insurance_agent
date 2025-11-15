import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoicePermission } from '../hooks/useVoicePermission';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { VoiceLanguage } from '../types/models';

interface VoiceAssistantProps {
  onTranscript?: (transcript: string) => void;
}

export default function VoiceAssistant({ onTranscript }: VoiceAssistantProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [language] = useState<VoiceLanguage>('en');
  const { hasPermission, requestPermission } = useVoicePermission();
  const { isListening, transcript, error, startListening, stopListening } = useVoiceRecognition(language);

  const handleClick = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        alert('Microphone permission is required for voice commands');
        return;
      }
    }

    if (isListening) {
      stopListening();
      if (transcript && onTranscript) {
        onTranscript(transcript);
      }
      setShowOverlay(false);
    } else {
      startListening();
      setShowOverlay(true);
    }
  };

  return (
    <>
      {/* Floating Voice Button */}
      <motion.button
        onClick={handleClick}
        className={`
          fixed bottom-8 right-8 w-16 h-16 rounded-full
          flex items-center justify-center text-2xl
          shadow-visionos z-50
          ${isListening 
            ? 'bg-semantic-error text-white' 
            : 'bg-primary text-white hover:bg-primary-glow'
          }
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? {
          boxShadow: [
            '0 0 0 0 rgba(229, 57, 53, 0.7)',
            '0 0 0 20px rgba(229, 57, 53, 0)',
          ],
        } : {}}
        transition={isListening ? {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        } : {}}
      >
        {isListening ? '⏹️' : '🎤'}
      </motion.button>

      {/* Voice Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={() => {
              stopListening();
              setShowOverlay(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-card rounded-panel shadow-visionos p-8 max-w-2xl w-full mx-4"
            >
              {/* Microphone Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={isListening ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-5xl"
                >
                  🎤
                </motion.div>
              </div>

              {/* Status */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-heading text-neutral-heading mb-2">
                  {isListening ? 'Listening...' : 'Voice Assistant'}
                </h3>
                <p className="text-neutral-body">
                  {isListening ? 'Speak your command' : 'Click to start'}
                </p>
              </div>

              {/* Transcript */}
              <div className="bg-neutral-bg rounded-card p-4 min-h-[100px] mb-6">
                <p className="text-neutral-heading">
                  {transcript || 'Your speech will appear here...'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-semantic-error/10 border border-semantic-error rounded-card p-4 mb-6">
                  <p className="text-semantic-error text-sm">
                    Error: {error}
                  </p>
         

                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleClick}
                  className={`
                    px-6 py-3 rounded-button font-subhead transition-colors
                    ${isListening 
                      ? 'bg-semantic-error text-white hover:bg-semantic-error/90' 
                      : 'bg-primary text-white hover:bg-primary-glow'
                    }
                  `}
                >
                  {isListening ? 'Stop' : 'Start'}
                </button>
                <button
                  onClick={() => setShowOverlay(false)}
                  className="px-6 py-3 bg-neutral-bg text-neutral-heading rounded-button font-subhead hover:bg-neutral-body/10 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Language Indicator */}
              <div className="text-center mt-4 text-sm text-neutral-body">
                Language: {language.toUpperCase()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
