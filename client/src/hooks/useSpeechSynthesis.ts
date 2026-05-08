import { useCallback } from 'react';

export function useSpeechSynthesis() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      // Try to pick a good English voice
      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find((v) => v.name.includes('Samantha')) ||
        voices.find((v) => v.lang.startsWith('en-US'));
      if (enVoice) utterance.voice = enVoice;

      if (onEnd) utterance.onend = onEnd;

      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, cancel, isSupported };
}
