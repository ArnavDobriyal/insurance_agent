import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Only show on home page
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-primary" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
