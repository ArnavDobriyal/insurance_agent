import { useState, useEffect } from 'react';

export function useVoicePermission() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasPermission(false);
        setIsChecking(false);
        return;
      }

      // Check if permission was previously granted
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (error) {
      setHasPermission(false);
    } finally {
      setIsChecking(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      return false;
    }
  };

  return { hasPermission, isChecking, requestPermission };
}
