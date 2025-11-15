import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CommandSuggestion } from '../types/models';
import { useIntentDetection } from '../hooks/useAI';

interface CommandBarProps {
  onCommand?: (command: string) => void;
  suggestions?: CommandSuggestion[];
  isLoading?: boolean;
}

export default function CommandBar({ onCommand, suggestions = [], isLoading = false }: CommandBarProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<CommandSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const intentMutation = useIntentDetection();

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Navigate suggestions with arrow keys
      if (isFocused && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, suggestions, selectedIndex]);

  const handleSelectSuggestion = (suggestion: CommandSuggestion) => {
    setValue('');
    setIsFocused(false);
    suggestion.action();
    onCommand(suggestion.text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      // Call AI intent detection
      try {
        const result = await intentMutation.mutateAsync({
          text: value,
          context: { currentPage: window.location.pathname },
        });

        // Execute action based on intent
        if (result.action) {
          executeAction(result.action);
        }

        if (onCommand) {
          onCommand(value);
        }
      } catch (error) {
        console.error('Intent detection failed:', error);
      }

      setValue('');
      setIsFocused(false);
    }
  };

  const executeAction = (action: any) => {
    switch (action.type) {
      case 'navigate':
        if (action.payload.route) {
          navigate(action.payload.route);
        }
        break;
      case 'search':
        if (action.payload.query) {
          navigate(`/leads?search=${encodeURIComponent(action.payload.query)}`);
        }
        break;
      case 'create':
        if (action.payload.entity === 'lead') {
          navigate('/leads/new');
        }
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };

  const allSuggestions = [...suggestions, ...aiSuggestions];
  const filteredSuggestions = allSuggestions.filter((s) =>
    s.text.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <motion.div
          className={`
            relative flex items-center bg-neutral-card rounded-input px-4 py-3
            border-2 transition-all duration-200
            ${isFocused 
              ? 'border-primary-glow shadow-[0_0_20px_rgba(106,90,224,0.3)]' 
              : 'border-transparent shadow-visionos'
            }
          `}
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        >
          {/* Search Icon */}
          <span className="text-neutral-body mr-3 text-xl">🔍</span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-neutral-heading placeholder-neutral-body/50"
          />

          {/* Keyboard Shortcut Hint */}
          {!isFocused && !value && (
            <div className="flex items-center gap-1 text-xs text-neutral-body/50">
              <kbd className="px-2 py-1 bg-neutral-bg rounded">⌘</kbd>
              <kbd className="px-2 py-1 bg-neutral-bg rounded">K</kbd>
            </div>
          )}

          {/* Loading Indicator */}
          {(isLoading || intentMutation.isPending) && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
            />
          )}
        </motion.div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-neutral-card rounded-card shadow-visionos overflow-hidden z-50"
          >
            <div className="py-2">
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 text-left
                    transition-colors duration-150
                    ${index === selectedIndex 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-neutral-bg text-neutral-heading'
                    }
                  `}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.text}</div>
                    <div className="text-xs text-neutral-body capitalize">
                      {suggestion.category}
                    </div>
                  </div>
                  {index === selectedIndex && (
                    <span className="text-xs text-neutral-body">↵</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
