import { motion } from 'framer-motion';
import { X, Mic, Volume2 } from 'lucide-react';

interface MicGuideProps {
  onClose: () => void;
}

export default function MicGuide({ onClose }: MicGuideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Voice Input Guide</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Click the Mic Button</h4>
              <p className="text-xs text-gray-400">
                Click the floating mic button in the bottom-right corner to start voice input.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-semantic-error/20 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-semantic-error" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Speak Clearly</h4>
              <p className="text-xs text-gray-400">
                When the button turns red, speak your query clearly. Your words will appear in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-semantic-success/20 flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-semantic-success" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Auto-Send</h4>
              <p className="text-xs text-gray-400">
                Click the mic again to stop. Your message will be sent automatically!
              </p>
            </div>
          </div>

          <div className="bg-semantic-warning/10 border border-semantic-warning/30 rounded-lg p-3">
            <p className="text-xs text-semantic-warning">
              <strong>Brave Browser Users:</strong> Make sure to allow microphone access in Brave settings. 
              Check the BRAVE_MIC_SETUP.md guide if you have issues.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-primary hover:bg-primary-dark text-white rounded-lg py-3 text-sm font-medium transition-colors"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}
