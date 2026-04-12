import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutsOptions {
  onEscape?: () => void;
  onSlash?: () => void;
}

export function useKeyboardShortcuts({
  onEscape,
  onSlash,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Escape: always works - closes modal/dialog
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }

      // Slash: only when not typing in input/textarea
      if (event.key === '/' && onSlash) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';

        if (!isTyping) {
          event.preventDefault(); // Prevent "/" from being typed
          onSlash();
        }
      }
    },
    [onEscape, onSlash]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}