'use client';

import { useState } from 'react';
import { DestinationAutocomplete } from '@/components/search/DestinationAutocomplete';
import { Button } from '@/components/ui/Button';

interface Destination {
  destinationId: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}

export default function TestPage() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    console.log('Selected destination:', destination);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Destination Autocomplete Test
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Destination
              </label>
              <DestinationAutocomplete
                onSelect={handleDestinationSelect}
                placeholder="Type a city or country name..."
                className="w-full"
              />
            </div>

            {selectedDestination && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Selected Destination
                </h3>
                <div className="space-y-1 text-green-700">
                  <p><strong>City:</strong> {selectedDestination.cityName}</p>
                  <p><strong>Country:</strong> {selectedDestination.countryName}</p>
                  <p><strong>Country Code:</strong> {selectedDestination.countryCode}</p>
                  <p><strong>Destination ID:</strong> {selectedDestination.destinationId}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => setSelectedDestination(null)}
                variant="outline"
                disabled={!selectedDestination}
              >
                Clear Selection
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Features
              </h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>✅ Debounced search (300ms delay)</li>
                <li>✅ Hybrid caching (DB + Redis + API)</li>
                <li>✅ Keyboard navigation (arrow keys, enter, escape)</li>
                <li>✅ Country flags display</li>
                <li>✅ Loading states</li>
                <li>✅ Click outside to close</li>
                <li>✅ Auto-adds new destinations to database</li>
                <li>✅ Search count tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

