'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Globe, Loader2 } from 'lucide-react';

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
  disabled?: boolean;
}

export default function DestinationAutocomplete({
  onSelect,
  placeholder = "Where are you going?",
  className = "",
  disabled = false,
}: DestinationAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const searchDestinations = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setDestinations([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/destinations/autocomplete?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }

      const data = await response.json();
      setDestinations(data.destinations || []);
      setIsOpen(data.destinations && data.destinations.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to load destinations');
      setDestinations([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      searchDestinations(value);
    }, 300);
  };

  // Handle destination selection
  const handleSelect = (destination: Destination) => {
    setQuery(destination.cityName);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect(destination);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || destinations.length === 0) return;

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
        if (selectedIndex >= 0 && selectedIndex < destinations.length) {
          handleSelect(destinations[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Get country flag emoji
  const getCountryFlag = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Determine if destination is a country or city
  const isCountry = (destination: Destination): boolean => {
    return destination.cityName === destination.countryName;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (destinations.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {isOpen && destinations.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {destinations.map((destination, index) => (
            <div
              key={destination.destinationId}
              onClick={() => handleSelect(destination)}
              className={`px-4 py-3 cursor-pointer flex items-center space-x-3 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === destinations.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {isCountry(destination) ? (
                  <Globe className="h-5 w-5 text-gray-400" />
                ) : (
                  <MapPin className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {destination.cityName}
                  </span>
                  <span className="text-lg">
                    {getCountryFlag(destination.countryCode)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {destination.countryName}
                </div>
              </div>
              {isCountry(destination) && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Country
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && destinations.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No destinations found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
