# Hotel Booking System

A comprehensive hotel booking system built with Next.js 14, TypeScript, PostgreSQL, and Redis, integrated with the TassPro Hotel API.

## Features

- **Destination Autocomplete**: Intelligent search with hybrid caching (Database + Redis + API)
- **Hotel Search**: Advanced search with progressive loading and price overrides
- **Room Selection**: Detailed room options with pricing and policies
- **Booking Management**: Complete booking flow with guest and user options
- **Admin Panel**: Full administrative control with price management
- **Payment Integration**: Stripe payment processing
- **Multi-currency Support**: Support for AED, USD, EUR, GBP
- **Responsive Design**: Mobile-first responsive design

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache Layer**: Redis for sessions, destinations, and search results
- **Styling**: Tailwind CSS
- **API Integration**: TassPro Hotel API
- **Payment**: Stripe
- **Deployment**: Docker containers

## Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Redis 7+
- Docker (optional, for containerized deployment)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd hotel-booking
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hotel_booking?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# TassPro API Configuration
TASSPRO_API_BASE_URL="http://uat-apiv2.giinfotech.ae/api/v2/hotel"
TASSPRO_API_KEY="VyBZUyOkbCSNvvDEMOV2=="
TASSPRO_CUSTOMER_CODE="4805"
TASSPRO_REGION_ID="123"

# SMTP Configuration (for Phase 5)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM_EMAIL=""

# Stripe Configuration (for Phase 8)
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Application Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial destinations (optional)
npm run seed:destinations
```

### 4. Start Development Servers

```bash
# Start PostgreSQL and Redis (if using Docker)
docker-compose up -d postgres redis

# Start the Next.js development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
hotel-booking/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── search/            # Search-related components
│   │   ├── hotel/             # Hotel display components
│   │   └── booking/           # Booking flow components
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
└── README.md                 # This file
```

## API Endpoints

### Destination Autocomplete
- `GET /api/destinations/autocomplete?q={query}` - Search destinations
- `POST /api/destinations/autocomplete` - Seed destinations for a country

### Hotel Search (Phase 3)
- `POST /api/hotels/search` - Search hotels
- `GET /api/hotels/[hotelCode]` - Get hotel details
- `POST /api/hotels/[hotelCode]/rooms` - Get room options

### Booking (Phase 5)
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/[bookingId]` - Get booking details
- `POST /api/bookings/[bookingId]/cancel` - Cancel booking

### Authentication (Phase 6)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

## Development Phases

The project is implemented in phases:

1. **Phase 1-2**: Foundation, database, destination autocomplete ✅
2. **Phase 3-4**: Search functionality, hotel details, room selection
3. **Phase 5**: Guest checkout and booking
4. **Phase 6**: User authentication and account management
5. **Phase 7-8**: Admin panel and payment integration
6. **Phase 9-10**: Optimization, testing, documentation
7. **Phase 11**: Figma design integration
8. **Phase 12**: Deployment

## Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build
npm run build
```

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling and logging
4. Update documentation for new features
5. Test thoroughly before submitting changes

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions, please contact the development team.