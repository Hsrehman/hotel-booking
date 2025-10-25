'use client';

import { useState, useEffect, useRef } from 'react';
import { debounce } from '@/lib/utils';
import { getCountryFlag } from '@/lib/utils';

interface Destination {
  destinationId: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}

interface DestinationAutocompleteProps {
  onSelect: (destination: Destination) => void;
  placeholder?: string;
  className?: string;
}

export function DestinationAutocomplete({ 
  onSelect, 
  placeholder = "Search destinations...",
  className = ""
}: DestinationAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = debounce(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setDestinations([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/destinations/autocomplete?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setDestinations(data.destinations || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (destination: Destination) => {
    setQuery(`${destination.cityName}, ${destination.countryName}`);
    setDestinations([]);
    setIsOpen(false);
    onSelect(destination);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < destinations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && destinations[selectedIndex]) {
          handleSelect(destinations[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node) &&
        listRef.current && !listRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => destinations.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && destinations.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {destinations.map((destination, index) => (
            <div
              key={destination.destinationId}
              onClick={() => handleSelect(destination)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">
                  {getCountryFlag(destination.countryCode)}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {destination.cityName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {destination.countryName}
                  </div>
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  {destination.countryCode}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && destinations.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No destinations found
          </div>
        </div>
      )}
    </div>
  );
}

