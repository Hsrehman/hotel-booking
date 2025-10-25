'use client';

import { useState } from 'react';
import DestinationAutocomplete from '@/components/search/DestinationAutocomplete';

interface Destination {
  destinationId: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}

export default function Home() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    console.log('Selected destination:', destination);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Hotel Booking System
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Test Destination Autocomplete
            </h2>
            
            <DestinationAutocomplete
              onSelect={handleDestinationSelect}
              placeholder="Search for a destination..."
              className="mb-4"
            />
            
            {selectedDestination && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Selected Destination:</h3>
                <div className="text-sm text-blue-800">
                  <p><strong>City:</strong> {selectedDestination.cityName}</p>
                  <p><strong>Country:</strong> {selectedDestination.countryName}</p>
                  <p><strong>Country Code:</strong> {selectedDestination.countryCode}</p>
                  <p><strong>Destination ID:</strong> {selectedDestination.destinationId}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>This is a test page for the destination autocomplete component.</p>
            <p>Try searching for destinations like "Dubai", "London", "Paris", etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}