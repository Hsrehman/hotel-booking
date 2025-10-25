export const config = {
  app: {
    name: 'Hotel Booking System',
    description: 'A comprehensive hotel booking platform powered by TassPro API',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  
  api: {
    tassPro: {
      baseUrl: process.env.TASSPRO_API_BASE_URL || 'http://uat-apiv2.giinfotech.ae/api/v2/hotel',
      apiKey: process.env.TASSPRO_API_KEY || '',
      customerCode: process.env.TASSPRO_CUSTOMER_CODE || '',
      regionId: process.env.TASSPRO_REGION_ID || '',
    },
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/hotel_booking',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
  
  cache: {
    ttl: {
      destination: 7 * 24 * 60 * 60, // 7 days
      hotelStatic: 24 * 60 * 60, // 24 hours
      searchResults: 60, // 60 seconds
      session: 15 * 60, // 15 minutes
    },
  },
  
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },
  
  booking: {
    maxRooms: 6,
    maxAdultsPerRoom: 9,
    maxChildrenPerRoom: 4,
    minChildAge: 1,
    maxChildAge: 17,
  },
  
  currencies: ['AED', 'USD', 'EUR', 'GBP'],
  
  countries: [
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'BE', name: 'Belgium' },
    { code: 'DK', name: 'Denmark' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'FI', name: 'Finland' },
    { code: 'IE', name: 'Ireland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
  ],
  
  titles: [
    { code: 'Mr', text: 'Mr.' },
    { code: 'Mrs', text: 'Mrs.' },
    { code: 'Miss', text: 'Miss' },
    { code: 'Master', text: 'Master' },
  ],
  
  mealTypes: [
    'Room Only',
    'Bed and Breakfast',
    'Half Board',
    'Full Board',
    'All Inclusive',
  ],
  
  rateTypes: [
    'Refundable',
    'Non-Refundable',
  ],
  
  bookingStatuses: [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'FAILED',
  ],
} as const;
