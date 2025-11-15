import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

// Voice is now enabled with Whisper!
const VOICE_ENABLED = true;

export default function UniversalMicButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show if voice is disabled
  if (!VOICE_ENABLED) {
    return null;
  }

  // Don't show on AI page
  if (location.pathname === '/ai') {
    return null;
  }

  const handleClick = () => {
    // Navigate to AI page with a flag to start recording
    navigate('/ai', { state: { startRecording: true } });
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-24 right-6 z-[100] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      title="Voice input - Click to speak"
    >
      <Mic className="w-6 h-6" />
    </motion.button>
  );
}
