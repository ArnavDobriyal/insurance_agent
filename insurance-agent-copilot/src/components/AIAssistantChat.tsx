import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles, X } from 'lucide-react';
import { useWhisperRecognition } from '../hooks/useWhisperRecognition';
import Toast from './Toast';
import TypingIndicator from './TypingIndicator';

const suggestedPrompts = [
  'Show me hot leads',
  'Summarize today',
  'Create new lead',
  'Show renewals due',
  'Find Priya Sharma',
];

// Voice with Whisper (works offline!)
const VOICE_ENABLED = true;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  table?: { type: string; data: any[] };
}

export default function AIAssistantChat() {
  const location = useLocation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, error: voiceError, startListening, stopListening } = useWhisperRecognition();

  // Auto-start recording when navigated from floating mic button
  // Or auto-send message if provided in state
  useEffect(() => {
    const state = location.state as { startRecording?: boolean; message?: string };
    if (state?.startRecording) {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        startListening();
        setToast({ message: 'Recording... Speak now', type: 'info' });
      }, 300);
    } else if (state?.message) {
      // Auto-send message if provided
      setTimeout(() => {
        setInput(state.message);
        setTimeout(() => handleSend(), 100);
      }, 300);
    }
  }, [location.state]);

  // Update input when transcription is ready
  useEffect(() => {
    if (transcript && transcript.trim()) {
      setInput(transcript);
      // Auto-send after transcription
      setTimeout(() => {
        if (transcript.trim()) {
          handleSend();
        }
      }, 500);
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
    setIsTyping(true);

    // Add empty assistant message for streaming
    const assistantMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/agent/stream', {
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

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let actions: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content') {
                // Hide typing indicator on first content
                if (isTyping) {
                  setIsTyping(false);
                }
                accumulatedContent += data.data;
                // Update the last message with accumulated content
                setMessages(prev => {
                  const updated = [...prev];
                  updated[assistantMessageIndex] = {
                    ...updated[assistantMessageIndex],
                    content: accumulatedContent
                  };
                  return updated;
                });
              } else if (data.type === 'action') {
                // Collect actions to execute at the end
                console.log('🎬 Action received:', data.data);
                actions.push(data.data);
              } else if (data.type === 'tool_start') {
                // Don't show tool usage - just continue
              } else if (data.type === 'tool_end') {
                // Don't show tool completion - just continue
              } else if (data.type === 'done') {
                // Finalize message and execute actions
                generateSuggestions(userMessage, accumulatedContent);
                if (actions.length > 0) {
                  console.log('🚀 Executing actions:', actions);
                  handleActions(actions);
                }
              } else if (data.type === 'error') {
                throw new Error(data.data);
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI error:', error);
      setIsTyping(false);
      setMessages(prev => {
        const updated = [...prev];
        updated[assistantMessageIndex] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        return updated;
      });
    }
  };

  const generateSuggestions = (userQuery: string, agentResponse: string) => {
    const query = userQuery.toLowerCase();
    const response = agentResponse.toLowerCase();
    
    let suggestions: string[] = [];
    
    // Context-aware suggestions based on conversation
    if (query.includes('hot lead') || response.includes('hot lead')) {
      suggestions = ['Show warm leads', 'Show renewals due', 'Call the first lead'];
    } else if (query.includes('lead') && response.includes('found')) {
      suggestions = ['Show more details', 'Call this lead', 'Create a task'];
    } else if (query.includes('summarize') || query.includes('today')) {
      suggestions = ['Show hot leads', 'Show tasks due today', 'Show renewals'];
    } else if (query.includes('task')) {
      suggestions = ['Show overdue tasks', 'Create new task', 'Show hot leads'];
    } else if (query.includes('renewal')) {
      suggestions = ['Call renewal leads', 'Send renewal reminder', 'Show hot leads'];
    } else if (query.includes('call') || query.includes('phone')) {
      suggestions = ['Send message instead', 'Schedule meeting', 'Create follow-up task'];
    } else if (query.includes('create') || query.includes('add')) {
      suggestions = ['Show all leads', 'Show all tasks', 'Summarize today'];
    } else if (response.includes('priya') || response.includes('name')) {
      suggestions = ['Call this lead', 'Send message', 'Show lead details'];
    } else {
      // Default suggestions
      suggestions = ['Show me hot leads', 'Summarize today', 'Show renewals due'];
    }
    
    setSuggestedActions(suggestions.slice(0, 3));
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
      setToast({ message: 'Processing... Please wait', type: 'info' });
      // Transcript will appear in input field - user can review and press send
    } else {
      setInput('');
      startListening();
      setToast({ message: 'Recording... Speak now', type: 'info' });
    }
  };

  const handleActions = (actions: any[]) => {
    actions.forEach(action => {
      console.log('🎯 Handling action:', action.action, action);
      switch (action.action) {
        case 'navigate':
          if (action.target) window.location.href = action.target;
          break;
        case 'call':
          window.location.href = `tel:${action.phone}`;
          break;
        case 'open_maps':
          // Open Google Maps with location
          console.log('🗺️ Opening maps for:', action.location);
          const location = encodeURIComponent(action.location);
          window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
          setToast({ message: `Opening maps for ${action.leadName}`, type: 'success' });
          break;
        case 'schedule_meeting':
          // Open calendar (could be Google Calendar or native)
          const title = encodeURIComponent(`Meeting with ${action.leadName}`);
          const details = encodeURIComponent(`Insurance consultation meeting`);
          if (action.date) {
            // If date provided, try to open Google Calendar
            window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`, '_blank');
          } else {
            // Otherwise just show toast
            setToast({ message: action.message, type: 'info' });
          }
          break;
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-40">

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-400 mb-6">Ask me anything about your leads, tasks, or insurance queries</p>
            
            <div className="space-y-3 w-full max-w-md">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Send directly without showing in input
                    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
                    setIsTyping(true);
                    const assistantMessageIndex = messages.length + 1;
                    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
                    
                    // Call API
                    fetch('/api/agent/stream', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        message: prompt,
                        context: { 
                          currentPage: window.location.pathname,
                          history: messages.map(m => ({ role: m.role, content: m.content }))
                        }
                      }),
                    }).then(response => {
                      if (!response.body) throw new Error('No response body');
                      const reader = response.body.getReader();
                      const decoder = new TextDecoder();
                      let accumulatedContent = '';
                      
                      const readStream = async () => {
                        while (true) {
                          const { done, value } = await reader.read();
                          if (done) break;
                          
                          const chunk = decoder.decode(value);
                          const lines = chunk.split('\n');
                          
                          for (const line of lines) {
                            if (line.startsWith('data: ')) {
                              try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'content') {
                                  if (isTyping) setIsTyping(false);
                                  accumulatedContent += data.data;
                                  setMessages(prev => {
                                    const updated = [...prev];
                                    updated[assistantMessageIndex] = {
                                      ...updated[assistantMessageIndex],
                                      content: accumulatedContent
                                    };
                                    return updated;
                                  });
                                } else if (data.type === 'done') {
                                  generateSuggestions(prompt, accumulatedContent);
                                }
                              } catch (e) {}
                            }
                          }
                        }
                      };
                      readStream();
                    }).catch(error => {
                      console.error('AI error:', error);
                      setIsTyping(false);
                    });
                  }}
                  className="glass-effect rounded-xl p-4 text-left hover:border-primary/50 hover:shadow-lg transition-all w-full active:scale-[0.98]"
                >
                  <p className="text-sm font-medium text-gray-300">{prompt}</p>
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
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white'
                      : 'glass-effect text-gray-300'
                  }`}
                >
                  {/* Show typing indicator if message is empty and bot is typing */}
                  {message.role === 'assistant' && !message.content && isTyping ? (
                    <TypingIndicator />
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  
                  {/* Table in message */}
                  {message.table && (
                    <div className="mt-3 overflow-x-auto">
                      <div className="text-xs font-semibold text-white mb-2">
                        {message.table.type === 'leads' && `${message.table.data.length} Leads`}
                        {message.table.type === 'tasks' && `${message.table.data.length} Tasks`}
                        {message.table.type === 'templates' && `${message.table.data.length} Templates`}
                      </div>
                      <div className="bg-dark-bg/50 rounded-lg p-2">
                        {message.table.type === 'leads' && message.table.data.map((lead: any, idx: number) => (
                          <div key={idx} className="border-b border-dark-border/30 last:border-0 py-2">
                            <div className="font-medium text-white">{lead.name}</div>
                            <div className="flex gap-2 mt-1 text-xs">
                              <span className={`px-2 py-0.5 rounded ${
                                lead.temperature === 'hot' ? 'bg-semantic-error/20 text-semantic-error' :
                                lead.temperature === 'warm' ? 'bg-semantic-warning/20 text-semantic-warning' :
                                'bg-semantic-info/20 text-semantic-info'
                              }`}>
                                {lead.temperature}
                              </span>
                              <span className="text-gray-400">{lead.phone}</span>
                              <span className="text-gray-400">₹{lead.premium?.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                        {message.table.type === 'tasks' && message.table.data.map((task: any, idx: number) => (
                          <div key={idx} className="border-b border-dark-border/30 last:border-0 py-2">
                            <div className="font-medium text-white">{task.title}</div>
                            <div className="flex gap-2 mt-1 text-xs">
                              <span className={`px-2 py-0.5 rounded ${
                                task.priority === 'urgent' ? 'bg-semantic-error/20 text-semantic-error' :
                                task.priority === 'high' ? 'bg-semantic-warning/20 text-semantic-warning' :
                                'bg-semantic-info/20 text-semantic-info'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-gray-400">{task.leadName}</span>
                              <span className="text-gray-400">{task.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Fixed Input Bar at Bottom - Above Navigation */}
      <div className="fixed bottom-16 left-0 right-0 bg-dark-card/95 backdrop-blur-xl border-t border-dark-border px-4 py-4 z-40 shadow-2xl">
        {/* Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 flex items-center gap-2 text-semantic-error"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-semantic-error"
              />
              <span className="text-xs font-medium">Recording... Speak now</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions */}
        <AnimatePresence>
          {suggestedActions.length > 0 && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 flex gap-2 flex-wrap"
            >
              {suggestedActions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Send directly without showing in input
                    setInput(suggestion);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="glass-effect rounded-full px-3 py-1 text-xs text-gray-300 hover:text-white hover:border-primary/50 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Row */}
        <div className="flex items-center gap-3">
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-dark-hover rounded-full px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/50 border border-dark-border shadow-inner"
          />

          {/* Mic Button - On Right */}
          {VOICE_ENABLED && (
            <button
              onClick={handleVoiceClick}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-xl ${
                isListening
                  ? 'bg-semantic-error text-white animate-pulse scale-110'
                  : 'bg-gradient-to-br from-primary to-purple-600 text-white hover:scale-110 active:scale-95'
              }`}
            >
              <Mic size={22} />
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-xl hover:scale-110 active:scale-95"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
