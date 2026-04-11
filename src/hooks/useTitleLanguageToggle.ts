import { useState, useCallback } from 'react';

type TitleLanguage = 'english' | 'japanese';

const STORAGE_KEY = 'anime-tracker-title-language';

function getStoredLanguage(): TitleLanguage {
  if (typeof window === 'undefined') return 'english';
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored === 'japanese' || stored === 'english') ? stored : 'english';
}

export function useTitleLanguageToggle() {
  const [isJapanese, setIsJapanese] = useState<TitleLanguage>(() => getStoredLanguage());

  const toggle = useCallback(() => {
    setIsJapanese(prev => {
      const next = prev === 'japanese' ? 'english' : 'japanese';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { isJapanese, toggle };
}