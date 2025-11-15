import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-semantic-success" />,
    error: <AlertCircle className="w-5 h-5 text-semantic-error" />,
    info: <Info className="w-5 h-5 text-semantic-info" />,
  };

  const colors = {
    success: 'border-semantic-success/30 bg-semantic-success/10',
    error: 'border-semantic-error/30 bg-semantic-error/10',
    info: 'border-semantic-info/30 bg-semantic-info/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-[100] glass-effect rounded-lg px-4 py-3 flex items-center gap-3 min-w-[300px] max-w-[500px] ${colors[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
