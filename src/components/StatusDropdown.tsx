import { useState } from 'react';
import { AnimeStatus } from '../types/anime';

interface StatusDropdownProps {
  currentStatus: AnimeStatus | null;
  onStatusChange: (status: AnimeStatus) => void;
  isInList: boolean;
}

const STATUS_OPTIONS: { value: AnimeStatus; label: string; color: string }[] = [
  { value: 'watching', label: 'Watching', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'plan_to_watch', label: 'Plan to Watch', color: 'bg-yellow-500' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-orange-500' },
  { value: 'dropped', label: 'Dropped', color: 'bg-red-500' }
];

export function StatusDropdown({ currentStatus, onStatusChange, isInList }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = STATUS_OPTIONS.find(opt => opt.value === currentStatus);

  const handleSelect = (status: AnimeStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  if (isInList && currentOption) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${currentOption.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}
        >
          {currentOption.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute top-full mt-1 right-0 bg-gray-800 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
            {STATUS_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-700 ${option.value === currentStatus ? 'bg-gray-700' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-full"
    >
      + Add to list
    </button>
  );
}