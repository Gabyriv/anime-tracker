import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'anime-tracker-title-language';

function getStoredLanguage(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'japanese';
}

export function useTitleLanguageToggle() {
  const [isJapanese, setIsJapanese] = useState<boolean>(() => getStoredLanguage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isJapanese ? 'japanese' : 'english');
  }, [isJapanese]);

  const toggle = useCallback(() => {
    setIsJapanese(prev => !prev);
  }, []);

  return { isJapanese, toggle };
}