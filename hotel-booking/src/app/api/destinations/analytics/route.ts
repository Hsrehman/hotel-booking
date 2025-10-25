import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const { destinationId, action } = await request.json();

    if (!destinationId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: destinationId and action' },
        { status: 400 }
      );
    }

    if (action === 'select') {
      // Only increment when user actually selects a destination
      await dbService.incrementDestinationSearchCount(destinationId);
      
      return NextResponse.json({
        success: true,
        message: 'Analytics updated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: select' },
      { status: 400 }
    );

  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
