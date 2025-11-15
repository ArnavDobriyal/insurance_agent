import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload, X, UserPlus, Save } from 'lucide-react';
import { useVoicePermission } from '../hooks/useVoicePermission';
import leadsData from '../data/mock/leads.json';

interface CallRecorderProps {
  onClose: () => void;
  onSave?: (summary: string, leadId: string) => void;
}

export default function CallRecorder({ onClose, onSave }: CallRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedLead, setSelectedLead] = useState('');
  const [showLeadSelection, setShowLeadSelection] = useState(false);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const { hasPermission, requestPermission } = useVoicePermission();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const startRecording = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        alert('Microphone permission required');
        return;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Start Web Speech API for transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPiece + ' ';
            } else {
              interimTranscript += transcriptPiece;
            }
          }

          setTranscript(prev => prev + finalTranscript);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setIsRecording(false);
      
      // Generate summary (simulate AI processing)
      setTimeout(() => {
        generateSummary(transcript);
      }, 1000);
    }
  };

  const generateSummary = (text: string) => {
    // Simulate AI summarization
    const mockSummary = `📌 Summary\n• Customer discussed insurance needs\n• Interested in term life coverage\n• Budget: ₹20,000-30,000 annually\n\n🧠 Insights\n• Positive tone, ready to proceed\n• Concerns about premium costs\n\n🎯 Next Action\n• Send policy comparison\n• Schedule follow-up call`;
    
    setSummary(mockSummary);
    setShowLeadSelection(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file processing
      setTranscript('Processing uploaded call log...');
      setTimeout(() => {
        setTranscript('Customer: I need insurance for my family...\nAgent: I can help you with that...');
        generateSummary('Sample transcript from uploaded file');
      }, 2000);
    }
  };

  const handleSave = () => {
    if (selectedLead && onSave) {
      onSave(summary, selectedLead);
    }
    onClose();
  };

  const handleCreateNewLead = () => {
    if (newLeadName.trim()) {
      // Create new lead logic here
      alert(`New lead "${newLeadName}" created!`);
      setShowNewLeadForm(false);
      setShowLeadSelection(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-xl font-semibold text-white">Call Recording & Summary</h2>
            <p className="text-sm text-gray-400 mt-1">Record or upload call logs for AI summarization</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recording Controls */}
          {!summary && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <>
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-colors"
                    >
                      <Mic size={20} />
                      <span>Start Recording</span>
                    </button>
                    
                    <label className="flex items-center gap-2 px-6 py-3 glass-effect text-white rounded-full font-medium cursor-pointer hover:border-primary/50 transition-all">
                      <Upload size={20} />
                      <span>Upload Call Log</span>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-semantic-error mb-4">
                      {formatTime(recordingTime)}
                    </div>
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-semantic-error hover:bg-semantic-error/90 text-white rounded-full font-medium transition-colors mx-auto"
                    >
                      <Square size={20} />
                      <span>Stop Recording</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Live Transcript */}
              {transcript && (
                <div className="glass-effect rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Live Transcript</h3>
                  <div className="text-white text-sm max-h-40 overflow-y-auto">
                    {transcript}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {summary && !showLeadSelection && (
            <div className="space-y-4">
              <div className="glass-effect rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">AI Generated Summary</h3>
                <div className="text-white text-sm whitespace-pre-line">
                  {summary}
                </div>
              </div>

              <button
                onClick={() => setShowLeadSelection(true)}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
              >
                Continue to Lead Selection
              </button>
            </div>
          )}

          {/* Lead Selection */}
          {showLeadSelection && !showNewLeadForm && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-3">Who was this conversation about?</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {leadsData.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedLead === lead.id
                          ? 'bg-primary text-white'
                          : 'glass-effect text-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm opacity-75">{lead.phone}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowNewLeadForm(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 glass-effect text-white rounded-xl font-medium hover:border-primary/50 transition-all"
              >
                <UserPlus size={20} />
                <span>Create New Lead</span>
              </button>

              {selectedLead && (
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-semantic-success hover:bg-semantic-success/90 text-white rounded-xl font-medium transition-colors"
                >
                  <Save size={20} />
                  <span>Save Summary</span>
                </button>
              )}
            </div>
          )}

          {/* New Lead Form */}
          {showNewLeadForm && (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Lead Name</label>
                <input
                  type="text"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-dark-hover rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewLeadForm(false)}
                  className="flex-1 px-6 py-3 glass-effect text-white rounded-xl font-medium hover:border-primary/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewLead}
                  disabled={!newLeadName.trim()}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Lead
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
