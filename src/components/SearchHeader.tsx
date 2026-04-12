import { useState, useRef, useEffect } from 'react';

interface SearchHeaderProps {
  query: string;
  setQuery: (q: string) => void;
  loading?: boolean;
  titleLanguage: 'english' | 'japanese' | 'kanji';
  onLanguageToggle: () => void;
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
}

export function SearchHeader({ query, setQuery, loading, titleLanguage, onLanguageToggle, expanded: controlledExpanded, setExpanded: controlledSetExpanded }: SearchHeaderProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const setExpanded = controlledSetExpanded || setInternalExpanded;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanded becomes true
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded, controlledExpanded]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (expanded && query.length === 0) {
          setExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded, query]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setExpanded(false);
      setQuery('');
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {/* Language Toggle - outside search bar */}
      <button
        onClick={onLanguageToggle}
        className="text-xs px-3 rounded-xl font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors flex-shrink-0 h-10 flex items-center"
      >
        <span className={titleLanguage === 'english' ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-foreground-muted)]'}>EN</span>
        <span className="mx-0.5 text-[var(--color-foreground-muted)]">/</span>
        <span className={titleLanguage === 'japanese' ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-foreground-muted)]'}>JP</span>
        <span className="mx-0.5 text-[var(--color-foreground-muted)]">/</span>
        <span className={titleLanguage === 'kanji' ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-foreground-muted)]'}>漢</span>
      </button>

      {/* Search Input */}
      <div className={`relative flex items-center transition-all duration-300 ${expanded ? 'w-40 sm:w-56' : 'w-10'}`}>
        {expanded ? (
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl px-4 py-2 pr-10 h-10
                         placeholder-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-all duration-200 text-sm"
            />
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleToggle}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}