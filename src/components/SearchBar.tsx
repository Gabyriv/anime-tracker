interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function SearchBar({ query, setQuery, loading, error }: SearchBarProps) {
  
  return (
    <div className="w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[#7b8ae8] rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none" />
        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-xl px-5 py-4 
                     placeholder-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 
                     focus:ring-[var(--color-accent-glow)] transition-all duration-200 text-lg"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
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