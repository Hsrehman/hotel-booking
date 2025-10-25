import { NextRequest, NextResponse } from 'next/server';
import { tassProApi } from '@/lib/api/tasspro-client';
import { prisma } from '@/lib/db/prisma';
import { cacheService, CacheService } from '@/lib/cache/redis';
import { TassProDestinationInfo } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ destinations: [] });
    }

    const searchTerm = query.trim().toLowerCase();
    const cacheKey = CacheService.destinationKey(searchTerm);

    // 1. Check Redis cache first
    let cachedResults = await cacheService.get<TassProDestinationInfo[]>(cacheKey);
    if (cachedResults) {
      console.log(`[Destination API] Cache hit for: ${searchTerm}`);
      return NextResponse.json({ destinations: cachedResults });
    }

    // 2. Search local PostgreSQL database
    const dbResults = await prisma.destination.findMany({
      where: {
        OR: [
          { cityName: { contains: query, mode: 'insensitive' } },
          { countryName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: [
        { searchCount: 'desc' },
        { cityName: 'asc' },
      ],
      take: 10,
    });

    // Update search count for found results
    if (dbResults.length > 0) {
      await prisma.destination.updateMany({
        where: {
          id: { in: dbResults.map(r => r.id) },
        },
        data: {
          searchCount: { increment: 1 },
          lastUsed: new Date(),
        },
      });
    }

    // 3. If we have good results from DB, return them
    if (dbResults.length >= 3) {
      const results = dbResults.map(dest => ({
        destinationId: dest.destinationId,
        cityName: dest.cityName,
        countryName: dest.countryName,
        countryCode: dest.countryCode,
      }));

      // Cache the results for 7 days
      await cacheService.set(cacheKey, results, 7 * 24 * 60 * 60);
      
      return NextResponse.json({ destinations: results });
    }

    // 4. If insufficient results, call TassPro API
    console.log(`[Destination API] Calling TassPro API for: ${query}`);
    const apiResults = await tassProApi.destinationInfo(query);

    if (apiResults.length === 0) {
      return NextResponse.json({ destinations: [] });
    }

    // 5. Process API results and add to database
    const processedResults = [];
    for (const dest of apiResults) {
      // Check if destination already exists
      const existing = await prisma.destination.findUnique({
        where: { destinationId: dest.destinationId },
      });

      if (!existing) {
        // Add new destination to database
        await prisma.destination.create({
          data: {
            destinationId: dest.destinationId,
            cityName: dest.cityName,
            countryName: dest.countryName,
            countryCode: dest.countryCode,
            searchCount: 1,
            lastUsed: new Date(),
          },
        });
        console.log(`[Destination API] Added new destination: ${dest.cityName}, ${dest.countryName}`);
      } else {
        // Update existing destination
        await prisma.destination.update({
          where: { destinationId: dest.destinationId },
          data: {
            searchCount: { increment: 1 },
            lastUsed: new Date(),
          },
        });
      }

      processedResults.push({
        destinationId: dest.destinationId,
        cityName: dest.cityName,
        countryName: dest.countryName,
        countryCode: dest.countryCode,
      });
    }

    // 6. Cache API results for 7 days
    await cacheService.set(cacheKey, processedResults, 7 * 24 * 60 * 60);

    return NextResponse.json({ destinations: processedResults });

  } catch (error) {
    console.error('[Destination API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}
