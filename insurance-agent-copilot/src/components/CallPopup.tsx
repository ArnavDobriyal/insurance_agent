import { Phone, X, Target, Clock, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface CallPopupProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  leadPhone: string;
  nextBestAction?: {
    action: string;
    timing: string;
    confidence?: number;
    urgency?: string;
    reasoning?: string;
  };
}

export default function CallPopup({ isOpen, onClose, leadName, leadPhone, nextBestAction }: CallPopupProps) {
  const handleCall = () => {
    // Redirect to phone call manager
    window.location.href = `tel:${leadPhone}`;
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-effect rounded-xl p-4 max-w-sm w-full relative mx-3"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-hover flex items-center justify-center hover:bg-red-500/20 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-white">
                {leadName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-base font-bold text-primary-content mb-0.5">{leadName}</h3>
            <p className="text-xs text-secondary-content">{leadPhone}</p>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-3 mb-4">
            {/* Next Best Action */}
            {nextBestAction && (
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium text-sm">AI Recommended Action</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-secondary-content" />
                    <span className="text-xs text-primary-content">
                      <strong>Timing:</strong> {nextBestAction.timing}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-content">
                    <strong>Why now:</strong> {nextBestAction.reasoning}
                  </p>
                </div>
              </div>
            )}

            {/* Call Talking Points */}
            <div className="bg-dark-hover rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3 h-3 text-yellow-400" />
                <span className="text-primary-content font-medium text-xs">What to Discuss</span>
              </div>
              <ul className="space-y-1 text-[10px] text-secondary-content">
                <li className="flex items-start gap-1">
                  <span className="text-primary">•</span>
                  <span>Warm greeting and current insurance needs</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-primary">•</span>
                  <span>Family protection and financial security goals</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-primary">•</span>
                  <span>Present suitable LIC products</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-primary">•</span>
                  <span>Address premium or coverage concerns</span>
                </li>
              </ul>
            </div>

            {/* Key Points */}
            <div className="bg-semantic-success/10 rounded-lg p-3">
              <h4 className="text-xs font-medium text-semantic-success mb-1">Key Points</h4>
              <ul className="space-y-0.5 text-[10px] text-secondary-content">
                <li>• Be empathetic and listen actively</li>
                <li>• Focus on benefits, not features</li>
                <li>• Use simple, clear language</li>
                <li>• Maintain IRDAI compliance</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 glass-effect rounded-lg py-3 text-sm text-secondary-content hover:border-gray-400/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCall}
              className="flex-1 bg-semantic-success text-white rounded-lg py-3 text-sm font-medium hover:bg-semantic-success/80 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Start Call
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}