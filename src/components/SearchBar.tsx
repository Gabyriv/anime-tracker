import { useSearch } from '../hooks/useSearch';

export function SearchBar() {
  const { query, setQuery, loading, error } = useSearch();
  
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 
                     placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 p-3 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => setQuery('')}
            className="text-red-300 text-xs mt-1 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}