import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Minimize2, X } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useVoicePermission } from '../hooks/useVoicePermission';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AutoPilotChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function AutoPilotChatBot({ isOpen, onClose, onMinimize }: AutoPilotChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { hasPermission, requestPermission } = useVoicePermission();
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceClick = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: userMessage,
          context: { currentPage: window.location.pathname }
        }),
      });

      const data = await response.json();
      
      const aiResponse = generateResponse(data, userMessage);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);

      // Execute action if needed
      if (data.action) {
        executeAction(data.action);
      }
    } catch (error) {
      console.error('AI error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running and the API key is configured.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateResponse = (intentData: any, userMessage: string) => {
    const { intent, action } = intentData;

    if (intent === 'navigation') {
      return `✅ Taking you to ${action.payload.route}${action.payload.filter ? ` (${action.payload.filter})` : ''}`;
    } else if (intent === 'search') {
      return `🔍 Searching for "${action.payload.query}"...`;
    } else if (intent === 'action' && action.type === 'create') {
      return `➕ Opening ${action.payload.entity} creation form...`;
    } else {
      return `I'll help you with: "${userMessage}"`;
    }
  };

  const executeAction = (action: any) => {
    if (action.type === 'navigate' && action.payload.route) {
      setTimeout(() => {
        window.location.href = action.payload.route;
      }, 500);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-20 left-4 w-80 md:w-96 z-50"
    >
      <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden border border-primary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h3 className="text-white font-semibold text-sm">AutoPilot Agent</h3>
              <p className="text-white/70 text-xs">Voice-powered assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMinimize}
              className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Minimize2 size={14} className="text-white" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-dark-bg/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-2">👋</span>
              <p className="text-sm text-gray-400">Hi! I'm your AutoPilot agent.</p>
              <p className="text-xs text-gray-500 mt-1">Ask me anything or use voice!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-dark-hover text-gray-300'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-dark-hover rounded-2xl px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-dark-card border-t border-dark-border">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-semantic-error text-white animate-pulse'
                  : 'bg-dark-hover text-gray-400 hover:text-white hover:bg-primary'
              }`}
            >
              <Mic size={16} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type or speak..."
              className="flex-1 bg-dark-hover rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/50"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
