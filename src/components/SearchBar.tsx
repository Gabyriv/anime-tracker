import { DefaultView } from '../hooks/useSearch';

type TitleLanguage = 'english' | 'japanese' | 'kanji';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  loading?: boolean;
  error?: string | null;
  titleLanguage?: TitleLanguage;
  onTitleLanguageToggle?: () => void;
}

export function SearchBar({ 
  query, 
  setQuery, 
  loading, 
  error, 
  titleLanguage = 'english', 
  onTitleLanguageToggle
}: SearchBarProps) {
  const isJapanese = titleLanguage === 'japanese' || titleLanguage === 'kanji';
  
  return (
    <div className="w-full space-y-3">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[#7b8ae8] rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none" />
        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl px-5 py-4 pr-24
                     placeholder-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 
                     focus:ring-[var(--color-accent-glow)] transition-all duration-200 text-lg"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {onTitleLanguageToggle && (
            <button
              onClick={onTitleLanguageToggle}
              className={`text-xs px-2 py-1.5 rounded-lg font-medium transition-colors ${
                isJapanese 
                  ? 'bg-[var(--color-accent)] text-white' 
                  : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
              }`}
              aria-label={isJapanese ? 'Show English titles' : 'Show Japanese titles'}
            >
              {isJapanese ? 'JP' : 'EN'}
            </button>
          )}
          {query.length > 0 && !loading && (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] p-1 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {loading && (
            <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => setQuery('')}
            className="text-red-300 text-xs mt-2 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}