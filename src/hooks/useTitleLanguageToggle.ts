import { useState, useCallback, useEffect } from 'react';

type TitleLanguage = 'english' | 'japanese' | 'kanji';

const STORAGE_KEY = 'anime-tracker-title-language';

function getStoredLanguage(): TitleLanguage {
  if (typeof window === 'undefined') return 'english';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'japanese' || stored === 'kanji') return stored;
  return 'english';
}

export function useTitleLanguageToggle() {
  const [titleLanguage, setTitleLanguage] = useState<TitleLanguage>(() => getStoredLanguage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, titleLanguage);
  }, [titleLanguage]);

  const toggle = useCallback(() => {
    setTitleLanguage(prev => {
      if (prev === 'english') return 'japanese';
      if (prev === 'japanese') return 'kanji';
      return 'english';
    });
  }, []);

  return { titleLanguage, toggle };
}