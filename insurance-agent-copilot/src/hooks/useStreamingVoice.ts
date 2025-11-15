import { useState, useRef, useEffect } from 'react';

export function useStreamingVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();

      // Enable continuous and interim results for streaming
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPiece + ' ';
          } else {
            interim += transcriptPiece;
          }
        }

        // Update interim (streaming) transcript
        if (interim) {
          setInterimTranscript(interim);
        }

        // Update final transcript
        if (final) {
          setTranscript(prev => prev + final);
          setInterimTranscript(''); // Clear interim when we get final
        }
      };

      recognition.onerror = (event: any) => {
        console.error('🎤 Speech error:', event.error);
        if (event.error === 'network') {
          setError('Network error - check internet connection');
        } else if (event.error === 'not-allowed') {
          setError('Microphone permission denied');
        } else {
          setError(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('🎤 Recognition ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('❌ Failed to initialize:', err);
      setError('Failed to initialize speech recognition');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized');
      return;
    }

    if (isListening) {
      return;
    }

    setTranscript('');
    setInterimTranscript('');
    setError(null);

    try {
      recognitionRef.current.start();
      setIsListening(true);
      console.log('🎤 Streaming voice started');
    } catch (err: any) {
      console.error('❌ Error starting:', err);
      if (err.message && err.message.includes('already started')) {
        setIsListening(true);
      } else {
        setError('Failed to start recording');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log('🎤 Streaming voice stopped');
    }
  };

  // Combined transcript (final + interim for display)
  const fullTranscript = transcript + (interimTranscript ? ' ' + interimTranscript : '');

  return {
    isListening,
    transcript: fullTranscript,
    finalTranscript: transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
  };
}
