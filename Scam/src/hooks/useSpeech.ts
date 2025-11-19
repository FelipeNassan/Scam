import { useCallback, useState, useEffect, useRef } from 'react';

export const useSpeech = () => {
  // Todos os hooks devem estar no topo, na mesma ordem sempre
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopAudio = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, []);

  const speak = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('BR')
      );

      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }

      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;   // Mais devagar (padrão é 1)
      utterance.pitch = 1;

      utterance.onend = () => resolve();
      utterance.onerror = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const playAudio = useCallback(async (text: string) => {
    // Se já está falando, para o áudio
    if (isSpeakingRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      return;
    }

    setIsSpeaking(true);
    isSpeakingRef.current = true;
    window.speechSynthesis.cancel();

    // Divide o texto em partes, separadas por ponto final, quebra de linha ou ponto e vírgula
    const parts = text
      .split(/[\.\n;]/)
      .map(part => part.trim())
      .filter(part => part.length > 0);

    try {
      for (const part of parts) {
        // Verifica se foi cancelado antes de continuar
        if (!isSpeakingRef.current) break;
        await speak(part);
        // Verifica novamente após cada parte
        if (!isSpeakingRef.current) break;
        await new Promise(res => setTimeout(res, 300)); // Pausa de 300ms entre partes
      }
    } finally {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  }, [speak]);

  return { playAudio, stopAudio, isSpeaking };
};
