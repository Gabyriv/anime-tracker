import { useState, useRef, useEffect } from 'react';

interface SearchHeaderProps {
  query: string;
  setQuery: (q: string) => void;
  loading?: boolean;
  isJapanese: boolean;
  onLanguageToggle: () => void;
}

export function SearchHeader({ query, setQuery, loading, isJapanese, onLanguageToggle }: SearchHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setExpanded(false);
      setQuery('');
    }
  };

  return (
    <div className="relative flex items-center">
      <div className={`relative flex items-center transition-all duration-300 ${expanded ? 'w-64' : 'w-10'}`}>
        {expanded ? (
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl px-4 py-2 pr-24
                         placeholder-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-all duration-200 text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={onLanguageToggle}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                  isJapanese 
                    ? 'bg-[var(--color-accent)] text-white' 
                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                }`}
              >
                {isJapanese ? 'JP' : 'EN'}
              </button>
              {query.length > 0 && !loading && (
                <button
                  onClick={() => setQuery('')}
                  className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleToggle}
                className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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