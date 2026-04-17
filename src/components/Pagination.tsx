import { PaginationInfo } from '../lib/api';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({ pagination, onPageChange, loading }: PaginationProps) {
  const { current_page, last_visible_page, has_next_page, has_prev_page } = pagination;
  
  const handlePrev = () => {
    if (has_prev_page && !loading) {
      onPageChange(current_page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleNext = () => {
    if (has_next_page && !loading) {
      onPageChange(current_page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePageNum = (page: number) => {
    if (page !== current_page && !loading) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    let end = Math.min(last_visible_page, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (start > 1) {
      pages.unshift('...');
      pages.unshift(1);
    }
    
    if (end < last_visible_page) {
      if (end < last_visible_page - 1) {
        pages.push('...');
      }
      pages.push(last_visible_page);
    }
    
    return pages;
  };
  
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <span className="text-xs text-[var(--color-foreground-muted)]">
        Page {current_page} of {last_visible_page}
      </span>
      <div className="flex items-center gap-1">
      <button
        onClick={handlePrev}
        disabled={!has_prev_page || loading}
        className="p-2 rounded-lg text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex items-center gap-1">
        {renderPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={`${page}-${idx}`}
              onClick={() => handlePageNum(page)}
              disabled={loading}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                page === current_page
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`} className="px-1 text-[var(--color-foreground-muted)]">...</span>
          )
        ))}
      </div>
      
      <button
        onClick={handleNext}
        disabled={!has_next_page || loading}
        className="p-2 rounded-lg text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      </div>
    </div>
  );
}