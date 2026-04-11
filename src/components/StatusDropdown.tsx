import { useState, useRef, useEffect } from 'react';
import { AnimeStatus } from '../types/anime';

interface StatusDropdownProps {
  currentStatus: AnimeStatus | null;
  onStatusChange: (status: AnimeStatus) => void;
  isInList: boolean;
}

const STATUS_OPTIONS: { value: AnimeStatus; label: string; color: string }[] = [
  { value: 'watching', label: 'Watching', color: 'bg-[var(--color-status-watching)]' },
  { value: 'completed', label: 'Completed', color: 'bg-[var(--color-status-completed)]' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-[var(--color-status-plan)]' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-[var(--color-status-onhold)]' },
  { value: 'dropped', label: 'Dropped', color: 'bg-[var(--color-status-dropped)]' }
];

export function StatusDropdown({ currentStatus, onStatusChange, isInList }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);

  const handleSelect = (status: AnimeStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`${
          currentOption?.color || 'bg-[var(--color-surface)]'
        } text-white text-sm px-4 py-2 rounded-xl w-40 justify-between flex items-center gap-2 transition-all duration-200 hover:opacity-90`}
      >
        {currentOption?.label || (isInList ? 'In List' : '+ Add')}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-[var(--color-bg-elevated)] rounded-xl shadow-xl py-1 z-[100] min-w-[160px] border border-[var(--color-border)]">
          {STATUS_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.value);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-colors ${option.value === currentStatus ? 'bg-[var(--color-surface)]' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
