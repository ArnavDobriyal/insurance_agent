import { motion } from 'framer-motion';
import { Zap, UserPlus } from 'lucide-react';

interface FloatingActionsProps {
  onAutoPilot: () => void;
  onQuickLead: () => void;
}

export default function FloatingActions({ onAutoPilot, onQuickLead }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 flex items-center justify-center gap-4 px-4">
      <motion.button
        onClick={onAutoPilot}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg shadow-primary/50 font-medium transition-colors"
      >
        <Zap size={20} />
        <span>AutoPilot</span>
      </motion.button>

      <motion.button
        onClick={onQuickLead}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-6 py-3 glass-effect text-white rounded-full shadow-lg font-medium hover:border-primary/50 transition-all"
      >
        <UserPlus size={20} />
        <span>Quick Lead</span>
      </motion.button>
    </div>
  );
}
