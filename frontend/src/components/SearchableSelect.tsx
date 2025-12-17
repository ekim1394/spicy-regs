'use client';

import { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface SearchableSelectProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  isLoading = false,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Memoize processed options to avoid creating new strings on every render
  const processedOptions = useMemo(() => {
    return options.map(opt => ({ original: opt, lower: opt.toLowerCase() }));
  }, [options]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return processedOptions
      .filter(opt => opt.lower.includes(lowerSearch))
      .map(opt => opt.original);
  }, [processedOptions, searchTerm]);

  // Sync search term when value changes
  useEffect(() => {
    if (value && value !== searchTerm) {
      setSearchTerm(value);
    } else if (!value && searchTerm !== '') {
      // Only clear if value is null but search term has something (and we are not typing?)
      // Actually, if value is null, we should probably clear search term unless user is typing.
      // But we can't easily distinguish "user typing" from "parent set null".
      // Given the usage, `value` usually drives the input when selected.
      setSearchTerm('');
    }
    // We only want to run this when `value` changes, not `searchTerm`.
    // But we need `searchTerm` in the condition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If we close and the search term doesn't match the value, reset it
        if (value) {
            setSearchTerm(value);
        } else {
            setSearchTerm('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value]);


  const handleSelect = (option: string) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '') {
                 onChange(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled || isLoading}
        />
        
        {/* Loading Indicator */}
        {isLoading && (
            <div className="absolute right-3 top-2.5 text-gray-400">
                <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
            </div>
        )}

        {/* Clear Button */}
        {!isLoading && value && (
          <button
            onClick={clearSelection}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            {filteredOptions.length > 0 ? (
               <Virtuoso
                  style={{ height: `${Math.min(filteredOptions.length * 40, 240)}px` }}
                  data={filteredOptions}
                  components={{
                    List: VirtuosoList,
                    Item: VirtuosoItem,
                  }}
                  itemContent={(index, option) => (
                    <div
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        value === option ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </div>
                  )}
                />
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Extract components to avoid re-creation and fix lint/display name issues
const VirtuosoList = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>((props, ref) => (
  <ul {...props} ref={ref} className="py-1" />
));
VirtuosoList.displayName = 'VirtuosoList';

const VirtuosoItem = forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>((props, ref) => (
  <li {...props} ref={ref} />
));
VirtuosoItem.displayName = 'VirtuosoItem';
