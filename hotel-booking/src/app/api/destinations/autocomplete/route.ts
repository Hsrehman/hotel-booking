import { NextRequest, NextResponse } from 'next/server';
import { tassProApi } from '@/lib/api/tasspro-client';
import { dbService } from '@/lib/db/prisma';
import { cacheService } from '@/lib/cache/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ destinations: [] });
    }

    const searchTerm = query.trim();

    // 1. Search local PostgreSQL database first
    const localResults = await dbService.searchDestinations(searchTerm, 5);
    
    // Increment search count for found destinations
    for (const destination of localResults) {
      await dbService.incrementDestinationSearchCount(destination.destinationId);
    }

    // 2. If we have enough results, return them immediately
    if (localResults.length >= 3) {
      return NextResponse.json({
        destinations: localResults.map((dest: any) => ({
          destinationId: dest.destinationId,
          cityName: dest.cityName,
          countryName: dest.countryName,
          countryCode: dest.countryCode,
        })),
      });
    }

    // 3. Check Redis cache for API results
    const cachedResults = await cacheService.getCachedDestinationSearch(searchTerm);
    if (cachedResults && Array.isArray(cachedResults)) {
      // Add cached results to database if not already present
      for (const dest of cachedResults) {
        await dbService.upsertDestination(dest);
      }
      
      return NextResponse.json({
        destinations: cachedResults,
      });
    }

    // 4. Call TassPro API for additional results
    try {
      const apiResponse = await tassProApi.destinationInfo({ destination: searchTerm });
      
      if (apiResponse.isSuccess && apiResponse.data && Array.isArray(apiResponse.data)) {
        const apiResults = apiResponse.data.map((dest: any) => ({
          destinationId: dest.destinationId,
          cityName: dest.cityName,
          countryName: dest.countryName,
          countryCode: dest.countryCode,
        }));

        // Cache API results in Redis (7 days)
        await cacheService.cacheDestinationSearch(searchTerm, apiResults, 7 * 24 * 60 * 60);

        // Add new destinations to database
        for (const dest of apiResults) {
          await dbService.upsertDestination(dest);
        }

        // Combine local and API results, remove duplicates
        const allResults = [...localResults, ...apiResults];
        const uniqueResults = allResults.filter((dest, index, self) => 
          index === self.findIndex(d => d.destinationId === dest.destinationId)
        );

        // Sort by relevance (exact match first, then by search count)
        const sortedResults = uniqueResults.sort((a, b) => {
          const aExactMatch = a.cityName.toLowerCase() === searchTerm.toLowerCase() || 
                             a.countryName.toLowerCase() === searchTerm.toLowerCase();
          const bExactMatch = b.cityName.toLowerCase() === searchTerm.toLowerCase() || 
                             b.countryName.toLowerCase() === searchTerm.toLowerCase();
          
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          
          // If both or neither are exact matches, sort by search count
          const aDest = localResults.find((d: any) => d.destinationId === a.destinationId);
          const bDest = localResults.find((d: any) => d.destinationId === b.destinationId);
          
          return (bDest?.searchCount || 0) - (aDest?.searchCount || 0);
        });

        return NextResponse.json({
          destinations: sortedResults.slice(0, 10),
        });
      }
    } catch (apiError) {
      console.error('[Destination API] Error calling TassPro API:', apiError);
      // Return local results even if API fails
    }

    // 5. Return local results if API fails
    return NextResponse.json({
      destinations: localResults.map((dest: any) => ({
        destinationId: dest.destinationId,
        cityName: dest.cityName,
        countryName: dest.countryName,
        countryCode: dest.countryCode,
      })),
    });

  } catch (error) {
    console.error('[Destination API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint for seeding destinations
export async function POST(request: NextRequest) {
  try {
    const { countryCode } = await request.json();

    if (!countryCode) {
      return NextResponse.json(
        { error: 'Country code is required' },
        { status: 400 }
      );
    }

    // Call TassPro API to get all cities for the country
    const apiResponse = await tassProApi.countryInfo({ countryCode });
    
    if (!apiResponse.isSuccess || !apiResponse.data) {
      return NextResponse.json(
        { error: 'Failed to fetch destinations from API' },
        { status: 500 }
      );
    }

    // Add all destinations to database
    const destinations = apiResponse.data.map(dest => ({
      destinationId: dest.key,
      cityName: dest.value,
      countryName: getCountryName(countryCode),
      countryCode: countryCode,
    }));

    for (const dest of destinations) {
      await dbService.upsertDestination(dest);
    }

    return NextResponse.json({
      message: `Successfully seeded ${destinations.length} destinations for ${countryCode}`,
      count: destinations.length,
    });

  } catch (error) {
    console.error('[Destination Seed API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get country name from country code
function getCountryName(countryCode: string): string {
  const countryNames: { [key: string]: string } = {
    'AE': 'United Arab Emirates',
    'US': 'United States',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'GR': 'Greece',
    'PT': 'Portugal',
    'IE': 'Ireland',
    'LU': 'Luxembourg',
    'MT': 'Malta',
    'CY': 'Cyprus',
    'EE': 'Estonia',
    'LV': 'Latvia',
    'LT': 'Lithuania',
    'SI': 'Slovenia',
    'SK': 'Slovakia',
    'HR': 'Croatia',
    'CA': 'Canada',
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'JP': 'Japan',
    'KR': 'South Korea',
    'CN': 'China',
    'IN': 'India',
    'TH': 'Thailand',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'VN': 'Vietnam',
    'RU': 'Russian Federation',
    'BR': 'Brazil',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru',
    'MX': 'Mexico',
    'ZA': 'South Africa',
    'EG': 'Egypt',
    'MA': 'Morocco',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'IL': 'Israel',
    'SA': 'Saudi Arabia',
    'KW': 'Kuwait',
    'QA': 'Qatar',
    'BH': 'Bahrain',
    'OM': 'Oman',
    'JO': 'Jordan',
    'LB': 'Lebanon',
  };

  return countryNames[countryCode] || countryCode;
}
