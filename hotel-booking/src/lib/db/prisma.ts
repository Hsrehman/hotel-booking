import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Database utility functions
export class DatabaseService {
  /**
   * Get destination by destination ID
   */
  async getDestinationByDestinationId(destinationId: string) {
    return await prisma.destination.findUnique({
      where: { destinationId },
    });
  }

  /**
   * Create or update destination
   */
  async upsertDestination(data: {
    destinationId: string;
    cityName: string;
    countryName: string;
    countryCode: string;
  }) {
    return await prisma.destination.upsert({
      where: { destinationId: data.destinationId },
      update: {
        cityName: data.cityName,
        countryName: data.countryName,
        countryCode: data.countryCode,
        lastUsed: new Date(),
      },
      create: {
        destinationId: data.destinationId,
        cityName: data.cityName,
        countryName: data.countryName,
        countryCode: data.countryCode,
        searchCount: 0,
        lastUsed: new Date(),
      },
    });
  }

  /**
   * Increment destination search count
   */
  async incrementDestinationSearchCount(destinationId: string) {
    return await prisma.destination.update({
      where: { destinationId },
      data: {
        searchCount: { increment: 1 },
        lastUsed: new Date(),
      },
    });
  }

  /**
   * Search destinations by name
   */
  async searchDestinations(query: string, limit: number = 10) {
    return await prisma.destination.findMany({
      where: {
        OR: [
          { cityName: { contains: query, mode: 'insensitive' } },
          { countryName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: [
        { searchCount: 'desc' },
        { lastUsed: 'desc' },
      ],
      take: limit,
    });
  }

  /**
   * Get hotel by hotel code
   */
  async getHotelByCode(hotelCode: string) {
    return await prisma.hotel.findUnique({
      where: { hotelCode },
      include: { destination: true },
    });
  }

  /**
   * Create or update hotel
   */
  async upsertHotel(data: {
    hotelCode: string;
    name: string;
    description?: string;
    starRating?: string;
    address?: string;
    lat?: string;
    lon?: string;
    imageUrl?: string;
    images?: string[];
    amenities?: string[];
    destinationId?: string;
  }) {
    return await prisma.hotel.upsert({
      where: { hotelCode: data.hotelCode },
      update: {
        name: data.name,
        description: data.description,
        starRating: data.starRating,
        address: data.address,
        lat: data.lat,
        lon: data.lon,
        imageUrl: data.imageUrl,
        images: data.images,
        amenities: data.amenities,
        destinationId: data.destinationId,
        updatedAt: new Date(),
      },
      create: {
        hotelCode: data.hotelCode,
        name: data.name,
        description: data.description,
        starRating: data.starRating,
        address: data.address,
        lat: data.lat,
        lon: data.lon,
        imageUrl: data.imageUrl,
        images: data.images || [],
        amenities: data.amenities || [],
        destinationId: data.destinationId,
      },
    });
  }

  /**
   * Get active price override for hotel
   */
  async getActivePriceOverride(hotelCode: string) {
    return await prisma.priceOverride.findFirst({
      where: {
        hotelCode,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active global markup
   */
  async getActiveGlobalMarkup() {
    return await prisma.globalMarkup.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create price override
   */
  async createPriceOverride(data: {
    hotelCode: string;
    overrideType: 'PERCENTAGE' | 'FIXED';
    value: number;
    currency?: string;
  }) {
    return await prisma.priceOverride.create({
      data: {
        hotelCode: data.hotelCode,
        overrideType: data.overrideType,
        value: data.value,
        currency: data.currency,
        isActive: true,
      },
    });
  }

  /**
   * Create global markup
   */
  async createGlobalMarkup(percentage: number) {
    // Deactivate existing global markups
    await prisma.globalMarkup.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new global markup
    return await prisma.globalMarkup.create({
      data: {
        percentage,
        isActive: true,
      },
    });
  }

  /**
   * Create booking
   */
  async createBooking(data: {
    userId?: string;
    guestEmail?: string;
    sessionId: string;
    adsConfirmationNumber?: string;
    hotelConfirmationNumber?: string;
    supplierConfirmationNumber?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    currency: string;
    guestDetails: any;
    specialRequests?: string;
  }) {
    return await prisma.booking.create({
      data: {
        userId: data.userId,
        guestEmail: data.guestEmail,
        sessionId: data.sessionId,
        adsConfirmationNumber: data.adsConfirmationNumber,
        hotelConfirmationNumber: data.hotelConfirmationNumber,
        supplierConfirmationNumber: data.supplierConfirmationNumber,
        status: data.status,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice: data.totalPrice,
        currency: data.currency,
        guestDetails: data.guestDetails,
        specialRequests: data.specialRequests,
      },
    });
  }

  /**
   * Create booking room
   */
  async createBookingRoom(data: {
    bookingId: string;
    roomIdentifier: number;
    rateKey: string;
    roomName?: string;
    meal?: string;
    rateType?: string;
    price: number;
    adults: number;
    children?: any;
  }) {
    return await prisma.bookingRoom.create({
      data: {
        bookingId: data.bookingId,
        roomIdentifier: data.roomIdentifier,
        rateKey: data.rateKey,
        roomName: data.roomName,
        meal: data.meal,
        rateType: data.rateType,
        price: data.price,
        adults: data.adults,
        children: data.children,
      },
    });
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string) {
    return await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        rooms: true,
        user: true,
      },
    });
  }

  /**
   * Get booking by confirmation number
   */
  async getBookingByConfirmationNumber(confirmationNumber: string) {
    return await prisma.booking.findFirst({
      where: { adsConfirmationNumber: confirmationNumber },
      include: {
        rooms: true,
        user: true,
      },
    });
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED') {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string, limit: number = 20, offset: number = 0) {
    return await prisma.booking.findMany({
      where: { userId },
      include: { rooms: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get guest bookings by email
   */
  async getGuestBookings(email: string, limit: number = 20, offset: number = 0) {
    return await prisma.booking.findMany({
      where: { guestEmail: email },
      include: { rooms: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Log search
   */
  async logSearch(data: {
    destinationCode?: string;
    checkIn?: Date;
    checkOut?: Date;
    rooms?: any;
    resultCount?: number;
  }) {
    return await prisma.searchLog.create({
      data: {
        destinationCode: data.destinationCode,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        rooms: data.rooms,
        resultCount: data.resultCount,
      },
    });
  }

  /**
   * Log API call
   */
  async logApiCall(data: {
    endpoint: string;
    method: string;
    requestBody?: any;
    responseBody?: any;
    statusCode: number;
    responseTime: number;
  }) {
    return await prisma.apiLog.create({
      data: {
        endpoint: data.endpoint,
        method: data.method,
        requestBody: data.requestBody,
        responseBody: data.responseBody,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
      },
    });
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(limit: number = 10) {
    return await prisma.destination.findMany({
      orderBy: { searchCount: 'desc' },
      take: limit,
    });
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [total, confirmed, cancelled, pending] = await Promise.all([
      prisma.booking.count({ where: whereClause }),
      prisma.booking.count({ where: { ...whereClause, status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { ...whereClause, status: 'CANCELLED' } }),
      prisma.booking.count({ where: { ...whereClause, status: 'PENDING' } }),
    ]);

    const revenue = await prisma.booking.aggregate({
      where: { ...whereClause, status: 'CONFIRMED' },
      _sum: { totalPrice: true },
    });

    return {
      total,
      confirmed,
      cancelled,
      pending,
      revenue: revenue._sum.totalPrice || 0,
    };
  }
}

// Export singleton instance
export const dbService = new DatabaseService();
