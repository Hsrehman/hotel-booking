# Hotel Booking System

A comprehensive hotel booking platform powered by TassPro API, built with Next.js 14, TypeScript, PostgreSQL, and Redis.

## Features

- 🔍 **Intelligent Destination Search** - Hybrid caching with autocomplete
- 🏨 **Hotel Search & Results** - Progressive loading with filters
- 🛏️ **Room Selection** - Multi-room booking with detailed options
- 💳 **Guest & User Checkout** - Flexible booking flow
- 👤 **User Authentication** - JWT-based auth with refresh tokens
- 🔧 **Admin Panel** - Complete system management
- 💰 **Price Overrides** - Global and hotel-specific markup
- 📧 **Email Notifications** - Booking confirmations and updates
- 💳 **Payment Integration** - Stripe payment processing
- 📱 **Responsive Design** - Mobile-first approach

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions, destinations, and search results
- **Styling**: Tailwind CSS
- **Authentication**: JWT with refresh tokens
- **Email**: SMTP configuration
- **Payment**: Stripe integration
- **Deployment**: Docker containers

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run setup script**
   ```bash
   ./setup.sh
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   ```
   http://localhost:3000
   ```

## Manual Setup (without Docker)

If you prefer to set up services manually:

1. **Install PostgreSQL and Redis locally**
2. **Update .env.local with your database URLs**
3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```
4. **Run migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/hotel_booking"

# Redis
REDIS_URL="redis://localhost:6379"

# TassPro API
TASSPRO_API_KEY="your-api-key"
TASSPRO_API_BASE_URL="http://uat-apiv2.giinfotech.ae/api/v2/hotel"
TASSPRO_CUSTOMER_CODE="your-customer-code"
TASSPRO_REGION_ID="your-region-id"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# SMTP Configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="noreply@yourdomain.com"

# Stripe (for payment integration)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
NODE_ENV="development"
```

## Project Structure

```
hotel-booking/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── search/            # Search-related components
│   │   ├── hotel/             # Hotel display components
│   │   ├── booking/           # Booking flow components
│   │   └── admin/             # Admin panel components
│   ├── lib/
│   │   ├── api/               # TassPro API client
│   │   ├── db/                # Database utilities
│   │   ├── cache/             # Redis utilities
│   │   ├── auth/              # Authentication logic
│   │   └── utils/             # Helper functions
│   ├── types/                 # TypeScript type definitions
│   ├── config/                # Configuration files
│   └── hooks/                 # Custom React hooks
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── docker-compose.yml         # Docker setup
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## API Integration

This application integrates with the TassPro Hotel Service API v2. The integration includes:

### Static Content APIs
- `destinationInfo` - Get destination details
- `hotelsInfoByDestination` - Get hotels list
- `hotelInfo` - Get single hotel details
- `countryInfo` - Get cities by country

### Hotel Service APIs
- `hotelSearch` - Search hotels
- `roomDetails` - Get room options
- `priceBreakup` - Get price breakdown
- `cancellationPolicy` - Get cancellation terms
- `preBook` - Verify price/availability
- `book` - Create booking
- `cancel` - Cancel booking
- `bookingDetails` - Retrieve booking

## Development Phases

The project is developed in phases:

1. **Phase 1-2**: Foundation, database, destination autocomplete
2. **Phase 3-4**: Search functionality, hotel details, room selection
3. **Phase 5**: Guest checkout and booking
4. **Phase 6**: User authentication and account management
5. **Phase 7-8**: Admin panel and payment integration
6. **Phase 9-10**: Optimization, testing, documentation
7. **Phase 11**: Figma design integration
8. **Phase 12**: Deployment
9. **Phase 13**: Maintenance and improvements

## Key Features

### Intelligent Caching
- **Destination Cache**: Popular destinations cached in PostgreSQL, API responses cached in Redis
- **Hotel Static Cache**: Hotel images, descriptions, and amenities cached for 24 hours
- **Search Results Cache**: Identical searches cached for 60 seconds
- **Live Pricing**: Always fetch live prices from API, never cache pricing/availability

### Admin Price Management
- **Global Markup**: Set percentage markup for all hotels
- **Hotel-Specific Overrides**: Set fixed prices or percentage markup per hotel
- **Price Preview**: See original vs. overridden prices
- **Active/Inactive Toggle**: Enable/disable overrides

### Multi-Room Booking
- Support for up to 6 rooms
- Up to 9 adults per room
- Up to 4 children per room (ages 1-17)
- Room compatibility validation
- Progressive room selection

### User Experience
- **Guest Checkout**: Complete bookings without registration
- **Post-Booking Registration**: Create account after successful booking
- **Booking History**: View past and upcoming bookings
- **Cancellation**: Cancel bookings with policy enforcement
- **Email Notifications**: Confirmation and cancellation emails

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts and authentication
- **Destinations**: Cached destination data
- **Hotels**: Cached hotel static data
- **PriceOverrides**: Admin price management
- **Bookings**: Booking records
- **BookingRooms**: Room-specific booking details
- **Payments**: Payment records (Stripe integration)
- **SearchLogs**: Search analytics
- **ApiLogs**: API call monitoring

## Deployment

### Docker Deployment

1. **Build production image**
   ```bash
   docker build -t hotel-booking .
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@yourdomain.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues]

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Backup automation
- [ ] Scaling optimizations