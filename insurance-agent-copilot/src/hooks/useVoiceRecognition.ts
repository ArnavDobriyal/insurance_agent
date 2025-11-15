import { useState, useEffect, useRef } from 'react';
import { VoiceLanguage } from '../types/models';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceRecognition(language: VoiceLanguage = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const languageMap: Record<VoiceLanguage, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
  };

  useEffect(() => {
    // Check for browser support (Brave uses webkitSpeechRecognition)
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Brave.');
      console.error('❌ Speech Recognition API not available');
      return;
    }

    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();

      // Brave browser compatibility settings
      recognition.continuous = false; // Changed to false for better Brave compatibility
      recognition.interimResults = true;
      recognition.lang = languageMap[language];

      console.log('✅ Speech Recognition initialized for:', languageMap[language]);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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

      const result = finalTranscript || interimTranscript;
      console.log('🎤 Transcript:', result);
      setTranscript(result);
    };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('🎤 Speech recognition error:', event.error);
        
        // Handle specific errors for Brave browser
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access in Brave settings (brave://settings/content/microphone)');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.');
        } else if (event.error === 'network') {
          setError('Network error. Speech recognition requires internet connection.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('❌ Failed to initialize Speech Recognition:', err);
      setError('Failed to initialize speech recognition. Please check browser permissions.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized');
      return;
    }

    if (isListening) {
      console.log('🎤 Already listening, ignoring start request');
      return;
    }

    setTranscript('');
    setError(null);
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      console.log('🎤 Voice recognition started successfully');
    } catch (err: any) {
      console.error('❌ Error starting recognition:', err);
      
      // Handle "already started" error (common in Brave)
      if (err.message && (err.message.includes('already started') || err.message.includes('recognition has already started'))) {
        console.log('🎤 Recognition already active, setting state');
        setIsListening(true);
      } else {
        setError('Failed to start voice recognition. Please check microphone permissions in Brave settings.');
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (!isListening) {
      console.log('🎤 Not listening, ignoring stop request');
      return;
    }

    try {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log('🎤 Voice recognition stopped successfully');
    } catch (err) {
      console.error('❌ Error stopping recognition:', err);
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
