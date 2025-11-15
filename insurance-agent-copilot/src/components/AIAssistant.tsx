import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles, X } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useVoicePermission } from '../hooks/useVoicePermission';
import Toast from './Toast';
import MicGuide from './MicGuide';

interface AIAssistantProps {
  onCommand?: (command: string) => void;
}

const suggestedPrompts = [
  'Show me hot leads',
  'Summarize today',
  'Create new lead',
  'Start AutoPilot',
  'Show renewals due',
  'Find Priya Sharma',
];

export default function AIAssistant({ onCommand }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showMicGuide, setShowMicGuide] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { hasPermission, requestPermission } = useVoicePermission();
  const { isListening, transcript, error: voiceError, startListening, stopListening } = useVoiceRecognition();

  // Show mic guide on first visit
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenMicGuide');
    if (!hasSeenGuide) {
      setTimeout(() => setShowMicGuide(true), 2000); // Show after 2 seconds
    }
  }, []);

  useEffect(() => {
    if (transcript && transcript.trim()) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (voiceError) {
      setToast({ message: voiceError, type: 'error' });
    }
  }, [voiceError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Show typing indicator
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    try {
      // Call AI agent with conversation history
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: { 
            currentPage: window.location.pathname,
            history: messages.map(m => ({ role: m.role, content: m.content }))
          }
        }),
      });

      const data = await response.json();
      
      // Update table data if available
      if (data.table) {
        setTableData(data.table);
      }
      
      // Handle actions if available
      if (data.actions && data.actions.length > 0) {
        handleActions(data.actions);
      }
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1);
        return [...withoutTyping, {
          role: 'assistant',
          content: data.response || 'I processed your request.'
        }];
      });

      // Generate contextual suggestions based on the response
      generateSuggestions(userMessage, data.response);

      // Execute the action if there is one
      if (onCommand) {
        onCommand(userMessage);
      }
    } catch (error) {
      console.error('AI error:', error);
      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1);
        return [...withoutTyping, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }];
      });
    }
  };

  const generateSuggestions = (userQuery: string, agentResponse: string) => {
    const query = userQuery.toLowerCase();
    const response = agentResponse.toLowerCase();
    
    let suggestions: string[] = [];
    
    // Context-aware suggestions based on what was asked
    if (query.includes('lead') || response.includes('lead')) {
      suggestions = [
        'Show me all leads',
        'Find hot leads',
        'Get lead details',
        'Search for a specific lead'
      ];
    } else if (query.includes('template') || response.includes('template')) {
      suggestions = [
        'Show all templates',
        'Find follow-up templates',
        'Search templates by category'
      ];
    } else if (query.includes('compliant') || query.includes('compliance')) {
      suggestions = [
        'Check another message',
        'Show compliance guidelines',
        'Validate content'
      ];
    } else if (query.includes('interaction') || query.includes('sentiment')) {
      suggestions = [
        'Analyze sentiment for a lead',
        'Show recent interactions',
        'Summarize interactions'
      ];
    } else {
      // Default suggestions
      suggestions = [
        'Show me hot leads',
        'Check compliance',
        'Get all templates',
        'Summarize today'
      ];
    }
    
    setSuggestedActions(suggestions.slice(0, 3));
  };

  const handleVoiceClick = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setToast({ 
          message: 'Microphone permission is required. Please enable it in your browser settings.', 
          type: 'error' 
        });
        return;
      } else {
        setToast({ 
          message: 'Microphone access granted! Click again to start recording.', 
          type: 'success' 
        });
        return;
      }
    }

    if (isListening) {
      stopListening();
      setToast({ message: 'Voice recording stopped', type: 'info' });
      // Auto-send after stopping if there's content
      if (input.trim()) {
        setTimeout(() => handleSend(), 500);
      }
    } else {
      setInput(''); // Clear input before starting
      startListening();
      setToast({ message: 'Listening... Speak now', type: 'info' });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleActions = (actions: any[]) => {
    actions.forEach(action => {
      switch (action.action) {
        case 'navigate':
          // Navigate to lead profile
          if (action.target) {
            window.location.href = action.target;
          }
          break;
        case 'open_maps':
          // Open Google Maps
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(action.location)}`;
          window.open(mapsUrl, '_blank');
          break;
        case 'send_message':
          // Open WhatsApp/SMS
          if (action.type === 'whatsapp') {
            const whatsappUrl = `https://wa.me/${action.phone.replace(/[^0-9]/g, '')}`;
            window.open(whatsappUrl, '_blank');
          } else if (action.type === 'sms') {
            window.location.href = `sms:${action.phone}`;
          }
          break;
        case 'call':
          // Initiate call
          window.location.href = `tel:${action.phone}`;
          break;
        case 'schedule_meeting':
          // Open calendar (could integrate with Google Calendar)
          console.log('Schedule meeting:', action);
          break;
        case 'create_task':
          // Navigate to tasks page
          window.location.href = '/tasks';
          break;
        case 'send_template':
          // Navigate to templates
          console.log('Send template:', action);
          break;
        case 'show_form':
          // Show form modal
          handleShowForm(action);
          break;
      }
    });
  };

  const handleShowForm = (action: any) => {
    // For now, show an alert with form info
    // In a real app, this would open a modal form
    const formType = action.formType;
    const prefilledData = action.prefilledData || {};
    
    if (formType === 'lead') {
      const message = action.type === 'create_lead' 
        ? 'Create New Lead Form\n\nPlease provide:\n• Name (required)\n• Phone (required)\n• Email\n• Location\n• Product Interest\n• Premium'
        : `Edit Lead: ${prefilledData.name || 'Unknown'}`;
      
      alert(message + '\n\nNote: Form UI not yet implemented. Use chat to create/edit leads.');
    } else if (formType === 'task') {
      const message = 'Create New Task Form\n\nPlease provide:\n• Title (required)\n• Lead (required)\n• Priority\n• Due Date';
      alert(message + '\n\nNote: Form UI not yet implemented. Use chat to create tasks.');
    }
  };

  const handlePromptClick = async (prompt: string) => {
    setInput(prompt);
    setIsExpanded(true);
    
    // Send the message after a short delay to ensure the chat is expanded
    setTimeout(async () => {
      setMessages(prev => [...prev, { role: 'user', content: prompt }]);
      
      // Show typing indicator
      setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

      try {
        // Call AI agent with conversation history
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: prompt,
            context: { 
              currentPage: window.location.pathname,
              history: messages.map(m => ({ role: m.role, content: m.content }))
            }
          }),
        });

        const data = await response.json();
        
        // Update table data if available
        if (data.table) {
          setTableData(data.table);
        }
        
        // Handle actions if available
        if (data.actions && data.actions.length > 0) {
          handleActions(data.actions);
        }
        
        // Remove typing indicator and add real response
        setMessages(prev => {
          const withoutTyping = prev.slice(0, -1);
          return [...withoutTyping, {
            role: 'assistant',
            content: data.response || 'I processed your request.'
          }];
        });

        // Generate contextual suggestions
        generateSuggestions(prompt, data.response);

        // Execute the action if there is one
        if (onCommand) {
          onCommand(prompt);
        }
      } catch (error) {
        console.error('AI error:', error);
        setMessages(prev => {
          const withoutTyping = prev.slice(0, -1);
          return [...withoutTyping, {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.'
          }];
        });
      }
      
      setInput('');
    }, 100);
  };

  return (
    <>
      {/* Mic Guide - First time users */}
      <AnimatePresence>
        {showMicGuide && (
          <MicGuide
            onClose={() => {
              setShowMicGuide(false);
              localStorage.setItem('hasSeenMicGuide', 'true');
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>



      {/* Collapsed State - Search Bar */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            {/* Siri-style Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary-glow to-purple-600 flex items-center justify-center shadow-lg shadow-primary/50"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Search Bar */}
            <div className="glass-effect rounded-2xl px-5 py-4 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  readOnly
                  onClick={() => setIsExpanded(true)}
                  className="flex-1 bg-transparent text-gray-400 outline-none cursor-pointer"
                />
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!hasPermission) {
                      const granted = await requestPermission();
                      if (!granted) {
                        setToast({ 
                          message: 'Microphone permission denied. Please enable it in browser settings.', 
                          type: 'error' 
                        });
                        return;
                      }
                    }
                    setIsExpanded(true);
                    setToast({ message: 'Starting voice input...', type: 'info' });
                    setTimeout(() => {
                      if (!isListening) {
                        startListening();
                      }
                    }, 300);
                  }}
                  className={`flex-shrink-0 transition-colors ${
                    isListening ? 'text-semantic-error animate-pulse' : 'text-gray-500 hover:text-primary'
                  }`}
                  title="Click to use voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>


          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State - Split Screen */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 md:left-20 z-[60] bg-dark-bg flex flex-col"
          >
            {/* Header */}
            <div className="glass-effect border-b border-dark-border px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">AI Assistant</h2>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Full Screen Chat */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Table Data Box - Floating */}
              <AnimatePresence>
                {tableData && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mx-4 mt-4 mb-2"
                  >
                    <div className="glass-effect rounded-xl p-4 border border-primary/30">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white">
                          {tableData.type === 'leads' && `Leads (${tableData.data.length})`}
                          {tableData.type === 'tasks' && `Tasks (${tableData.data.length})`}
                          {tableData.type === 'templates' && `Templates (${tableData.data.length})`}
                        </h3>
                        <button
                          onClick={() => setTableData(null)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-dark-border">
                              {tableData.type === 'leads' && (
                                <>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Name</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Status</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Phone</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Location</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Premium</th>
                                </>
                              )}
                              {tableData.type === 'tasks' && (
                                <>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Task</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Lead</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Priority</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Status</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Due Date</th>
                                </>
                              )}
                              {tableData.type === 'templates' && (
                                <>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Name</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Category</th>
                                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Language</th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.type === 'leads' && tableData.data.map((lead: any, idx: number) => (
                              <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark-hover/30">
                                <td className="py-2 px-2 text-white">{lead.name}</td>
                                <td className="py-2 px-2">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    lead.temperature === 'hot' ? 'bg-semantic-error/20 text-semantic-error' :
                                    lead.temperature === 'warm' ? 'bg-semantic-warning/20 text-semantic-warning' :
                                    'bg-semantic-info/20 text-semantic-info'
                                  }`}>
                                    {lead.temperature}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-gray-300">{lead.phone}</td>
                                <td className="py-2 px-2 text-gray-300">{lead.location}</td>
                                <td className="py-2 px-2 text-gray-300">₹{lead.premium?.toLocaleString()}</td>
                              </tr>
                            ))}
                            {tableData.type === 'tasks' && tableData.data.map((task: any, idx: number) => (
                              <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark-hover/30">
                                <td className="py-2 px-2 text-white">{task.title}</td>
                                <td className="py-2 px-2 text-gray-300">{task.leadName}</td>
                                <td className="py-2 px-2">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    task.priority === 'urgent' ? 'bg-semantic-error/20 text-semantic-error' :
                                    task.priority === 'high' ? 'bg-semantic-warning/20 text-semantic-warning' :
                                    'bg-semantic-info/20 text-semantic-info'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-gray-300">{task.status}</td>
                                <td className="py-2 px-2 text-gray-300">{task.dueDate}</td>
                              </tr>
                            ))}
                            {tableData.type === 'templates' && tableData.data.map((template: any, idx: number) => (
                              <tr key={idx} className="border-b border-dark-border/50 hover:bg-dark-hover/30">
                                <td className="py-2 px-2 text-white">{template.name}</td>
                                <td className="py-2 px-2 text-gray-300">{template.category}</td>
                                <td className="py-2 px-2 text-gray-300">{template.language}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-3">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Chat with AI</h3>
                    <p className="text-xs text-gray-400 mb-4">Ask me anything</p>
                    
                    {/* Suggested Prompts */}
                    <div className="space-y-2 w-full max-w-md">
                      {suggestedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handlePromptClick(prompt)}
                          className="glass-effect rounded-lg p-3 text-left hover:border-primary/50 transition-all w-full"
                        >
                          <p className="text-sm text-gray-300">{prompt}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                            message.role === 'user'
                              ? 'bg-primary text-white'
                              : 'glass-effect text-gray-300'
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-dark-border px-4 py-4 flex-shrink-0">
                {/* Listening Indicator */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-3 flex items-center gap-2 text-semantic-error"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-semantic-error"
                      />
                      <span className="text-xs font-medium">Listening...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Suggestions */}
                <AnimatePresence>
                  {suggestedActions.length > 0 && messages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-3 flex gap-2 flex-wrap"
                    >
                      {suggestedActions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="glass-effect rounded-full px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:border-primary/50 transition-all"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVoiceClick}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                      isListening
                        ? 'bg-semantic-error text-white animate-pulse'
                        : 'bg-dark-hover text-gray-400 hover:text-white'
                    }`}
                  >
                    <Mic size={18} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 bg-dark-hover rounded-full px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  />

                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors flex-shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
