import { useState, useRef } from 'react';

export function useWhisperRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      setError(null);
      setTranscript('');
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording stops, send to Whisper
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Send to Whisper server
        await transcribeAudio(audioBlob);
      };

      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      console.log('🎤 Whisper recording started');
    } catch (err: any) {
      console.error('❌ Error starting recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      console.log('🎤 Whisper recording stopped');
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      console.log('📤 Sending audio to Whisper server...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:5001/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.text) {
        console.log('✅ Transcription:', data.text);
        setTranscript(data.text);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error('❌ Transcription error:', err);
      setError('Failed to transcribe audio. Make sure Whisper server is running on port 5001.');
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
