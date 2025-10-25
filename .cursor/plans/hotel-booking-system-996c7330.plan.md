<!-- 996c7330-d3e4-43eb-88a1-598e9669c7b7 eca659e4-12c8-4d7a-ab5b-48e951364030 -->
# Hotel Booking System - Full Development Plan

## Architecture Overview

**Tech Stack:**

- **Frontend & Backend:** Next.js 14 (App Router) - TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Cache Layer:** Redis for sessions, destinations, and search results
- **Styling:** Tailwind CSS (prepare for Figma integration)
- **Email:** SMTP configuration (implemented in Phase 5)
- **Payment:** Stripe (Phase 8)
- **Deployment:** Docker containers for easy deployment to in-home server

**Key Architecture Decisions:**

1. **Destination Caching:** Hybrid approach - popular destinations in PostgreSQL, Redis cache for API responses, auto-add new destinations to DB
2. **Search Results:** 60-second Redis cache for identical searches + separate permanent cache for hotel static data (images, descriptions)
3. **Live Pricing:** Always fetch live prices from API, never cache pricing/availability
4. **Session Management:** JWT tokens with Redis for token blacklist and session data
5. **Admin Overrides:** Support both percentage markup and fixed price per hotel, stored in PostgreSQL

---

## Phase 1: Project Foundation & Setup

**Objective:** Set up project structure, database, and core infrastructure

### 1.1 Initialize Project Structure

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
├── .env.example              # Environment variables template
└── README.md                 # Documentation
```

### 1.2 Environment Configuration

Create `.env.local` with:

- TassPro API credentials (API Key, endpoints)
- PostgreSQL connection string
- Redis connection URL
- JWT secret keys
- SMTP configuration placeholders (for Phase 5)

### 1.3 Database Schema Design

**Core Tables:**

```prisma
// Users & Authentication
- User (id, email, password_hash, firstName, lastName, phone, createdAt)
- Session (id, userId, token, expiresAt)

// Hotel Static Data (cached from API)
- Destination (id, destinationId, cityName, countryName, countryCode, searchCount, lastUsed)
- Hotel (id, hotelCode, name, description, starRating, address, lat, lon, imageUrl, images[], amenities[], destinationId)

// Admin Price Management
- PriceOverride (id, hotelCode, overrideType[PERCENTAGE|FIXED], value, currency, isActive, createdAt)
- GlobalMarkup (id, percentage, isActive, createdAt)

// Bookings
- Booking (id, userId/guestEmail, sessionId, adsConfirmationNumber, hotelConfirmationNumber, status, checkIn, checkOut, totalPrice, currency, rooms[], guests[], createdAt)
- BookingRoom (id, bookingId, roomIdentifier, rateKey, roomName, meal, rateType, price, adults, children[])

// Search History (for analytics)
- SearchLog (id, destinationCode, checkIn, checkOut, rooms, timestamp, resultCount)
```

### 1.4 TassPro API Client Setup

Create abstracted API service layer in `src/lib/api/tasspro-client.ts`:

- HTTP client with axios/fetch
- Request/response type definitions matching API documentation
- Error handling and retry logic
- Session management (SessionId tracking across API calls)
- Rate limiting protection

**API Methods to implement:**

- `destinationInfo(destination)` - Get destination details
- `hotelsInfoByDestination(destinationId)` - Get hotels list
- `hotelInfo(hotelCode)` - Get single hotel details
- `countryInfo(countryCode)` - Get cities by country
- `hotelSearch(params)` - Search hotels
- `roomDetails(sessionId, hotelCode, params)` - Get room options
- `priceBreakup(sessionId, rateKeys)` - Get price breakdown
- `cancellationPolicy(sessionId, rateKeys)` - Get cancellation terms
- `preBook(sessionId, rateKeys)` - Verify price/availability
- `book(sessionId, bookingDetails)` - Create booking
- `cancel(sessionId, confirmationNumber)` - Cancel booking
- `bookingDetails(sessionId, confirmationNumber)` - Retrieve booking

### 1.5 Redis Cache Setup

**Cache Strategies:**

1. **Destination Cache:** Key: `dest:{searchTerm}`, TTL: 7 days
2. **Hotel Static Cache:** Key: `hotel:static:{hotelCode}`, TTL: 24 hours
3. **Search Results Cache:** Key: `search:{hash}`, TTL: 60 seconds
4. **Session Data:** Key: `session:{token}`, TTL: based on JWT expiry

Create cache utility functions:

- `getCached(key)` / `setCached(key, value, ttl)`
- `invalidateCache(pattern)`
- `generateSearchHash(searchParams)` - Consistent hash for search caching

### 1.6 Docker Configuration

Create `docker-compose.yml` for local development:

- PostgreSQL container
- Redis container
- Next.js app container (for production deployment)

---

## Phase 2: Destination Search & Autocomplete

**Objective:** Implement intelligent destination autocomplete with hybrid caching

### 2.1 Destination Data Seeding

- Create script to seed database with popular destinations from API
- Fetch destinations for major countries (AE, US, GB, etc.)
- Store in `Destination` table with initial `searchCount = 0`

### 2.2 Autocomplete API Endpoint

Create `/api/destinations/autocomplete?q={query}`:

**Logic:**

1. Search local PostgreSQL database first (LIKE query on cityName/countryName)
2. If results found, return immediately + increment `searchCount`
3. If no results OR < 3 results:

   - Call TassPro `DestinationInfo` API
   - Cache response in Redis (7 days)
   - Add new destinations to PostgreSQL
   - Return combined results

4. Sort by relevance (exact match first, then by searchCount)

**Response Format:**

```json
{
  "destinations": [
    {
      "destinationId": "160-0",
      "cityName": "Dubai",
      "countryName": "United Arab Emirates",
      "countryCode": "AE"
    }
  ]
}
```

### 2.3 Autocomplete UI Component

Build `DestinationAutocomplete.tsx`:

- Debounced input (300ms) to reduce API calls
- Show loading state while fetching
- Display results with country flags (use emoji flags or icon library)
- Highlight matching text
- Keyboard navigation (arrow keys, enter)
- Click outside to close
- Show "Country" vs "City" distinction

**Special Handling:**

- Clicking a **country** → Navigate to `/destinations/{countryCode}` (country overview page)
- Clicking a **city** → Proceed to hotel search with that destinationId

---

## Phase 3: Hotel Search & Results

**Objective:** Implement optimized hotel search with progressive loading

### 3.1 Search Form Component

Create `HotelSearchForm.tsx`:

- Destination autocomplete (Phase 2 component)
- Check-in / Check-out date pickers (validate: check-in < check-out, no past dates)
- Rooms configuration modal:
  - Add/remove rooms (max 6)
  - Adults per room (1-9)
  - Children per room (0-4) with age selectors (1-17)
  - Validation: Max 4 people per room (show warning to add room)
- Nationality selector (ISO country codes)
- Currency selector (AED, USD, EUR, GBP - from API documentation)
- Search button

**Form Validation:**

- All fields required
- Date range validation
- Room occupancy validation

### 3.2 Search API Endpoint

Create `/api/hotels/search` (POST):

**Process:**

1. Validate request parameters
2. Generate search hash for caching
3. Check Redis cache (60-second TTL)

   - If cached, return immediately

4. Call TassPro `HotelSearch` API
5. For each hotel in results:

   - Check if hotel static data exists in DB
   - If not, fetch from `HotelInfo` API and cache
   - Apply admin price overrides (if any)

6. Cache entire result set in Redis (60 seconds)
7. Return paginated results (10 hotels per page)

**Price Override Logic:**

```javascript
function applyPriceOverride(hotel, basePrice) {
  // Check hotel-specific override first
  const hotelOverride = await PriceOverride.findActive(hotel.code)
  if (hotelOverride) {
    if (hotelOverride.type === 'FIXED') return hotelOverride.value
    if (hotelOverride.type === 'PERCENTAGE') return basePrice * (1 + hotelOverride.value/100)
  }
  
  // Apply global markup
  const globalMarkup = await GlobalMarkup.findActive()
  if (globalMarkup) return basePrice * (1 + globalMarkup.percentage/100)
  
  return basePrice
}
```

**Response Format:**

```json
{
  "sessionId": "unique-session-id",
  "results": {
    "totalCount": 150,
    "page": 1,
    "pageSize": 10,
    "hotels": [...]
  },
  "currency": {
    "code": "AED",
    "exchangeRate": 0.274
  }
}
```

### 3.3 Search Results Page

Create `/search/results` page:

**Progressive Loading Strategy:**

1. Initial load: Fetch first 10 hotels from API
2. Display immediately
3. Implement infinite scroll:

   - When user scrolls to hotel #7 (3 before end), trigger next batch
   - Fetch next 10 hotels in background
   - Seamlessly append to list

4. "Load More" button as fallback

**Hotel Card Component:** (`HotelCard.tsx`)

- Hotel image (with fallback)
- Hotel name, star rating
- Location, address
- Minimum price per night
- "View Rooms" button → Navigate to hotel details page

**Filters & Sorting:**

- Price range slider
- Star rating filter
- Meal type filter (Room Only, Breakfast, Half Board, Full Board)
- Sort by: Price (Low to High), Price (High to Low), Star Rating, Name

**State Management:**

- Store sessionId in React state/context (needed for all subsequent API calls)
- Store search parameters for back navigation
- Track loaded hotels to avoid duplicates

### 3.4 Hotel Static Data Caching

Background job (can be manual trigger initially):

- Periodically refresh hotel static data (images, descriptions, amenities)
- Update `Hotel` table in database
- Keep Redis cache in sync

---

## Phase 4: Hotel Details & Room Selection

**Objective:** Display comprehensive hotel information and room options

### 4.1 Hotel Details Page

Create `/hotels/[hotelCode]` page:

**Data Fetching:**

1. Retrieve sessionId from search context (URL param or state)
2. Call `/api/hotels/[hotelCode]/rooms` (which calls TassPro `RoomDetails`)
3. Fetch hotel static data from cache/DB

**Page Sections:**

- **Hero Section:** Image gallery (lightbox for full-size images)
- **Hotel Info:** Name, star rating, location on map (embed Google Maps/OpenStreetMap)
- **Description:** Hotel description, check-in/out times
- **Amenities:** Icon grid of hotel amenities
- **Room Options:** Table/cards of available rooms

**Room Options Display:**

Each room shows:

- Room name, bed type
- Occupancy (adults + children)
- Meal plan
- Rate type (Refundable / Non-Refundable) with badge
- Price per room (total for stay)
- Price breakup button → Modal showing nightly rates
- Cancellation policy button → Modal with policy details
- "Select Room" button

### 4.2 Room Details APIs

Create endpoints:

**`/api/hotels/[hotelCode]/rooms` (POST):**

- Accepts sessionId, room configuration
- Calls TassPro `RoomDetails` API
- Applies admin price overrides to all room prices
- Returns room options with applied pricing

**`/api/hotels/rooms/price-breakup` (POST):**

- Accepts sessionId, rateKey
- Calls TassPro `PriceBreakup` API
- Shows per-night pricing, taxes, extra charges

**`/api/hotels/rooms/cancellation-policy` (POST):**

- Accepts sessionId, rateKey
- Calls TassPro `CancellationPolicy` API
- Returns formatted cancellation terms

### 4.3 Room Selection & Cart

**Multi-Room Selection:**

- User selects one room per RoomIdentifier from search
- "Select Room" button → Add to cart/booking context
- Show selected rooms in sticky sidebar
- Display total price (sum of all selected rooms)
- "Proceed to Checkout" button (disabled until all rooms selected)

**Validation:**

- Must select exactly N rooms (based on search criteria)
- Each room selection must match original occupancy requirements

---

## Phase 5: Guest Checkout & Booking Flow

**Objective:** Implement complete booking flow with guest and user options

### 5.1 Pre-Booking Validation

Before showing checkout form:

1. Call `/api/hotels/prebook` → TassPro `PreBook` API
2. Verify:

   - Rooms still available (`IsSoldOut = false`)
   - Price unchanged (`IsPriceChanged = false`)
   - Still bookable (`IsBookable = true`)

3. If any check fails:

   - Show error message
   - Redirect back to room selection with updated info

### 5.2 Checkout Page

Create `/booking/checkout` page:

**Two Paths:**

1. **Existing User:** Show "Log in to use saved details" button
2. **Guest Checkout:** Full guest form (default)

**Guest Information Form:**

- Email (required, for booking confirmation)
- Phone number (required)

**Guest Details per Room:**

For each room, collect guest information:

- Lead passenger (one per booking):
  - Title (Mr/Mrs/Miss/Master)
  - First Name, Last Name
  - Age
- Additional guests:
  - Title, First Name, Last Name
  - Age
  - Type (Adult/Child - based on age)

**Form Validation:**

- Email format validation
- All required fields
- Age validation (children 1-17, adults 18+)
- One lead passenger required

**Special Requests:** (Optional text area)

**Price Summary Sidebar:**

- Room-by-room breakdown
- Subtotal
- Taxes & fees
- **Total price** (large, bold)
- Currency display

**Terms & Conditions:** Checkbox (required)

### 5.3 Booking API

Create `/api/bookings/create` (POST):

**Process:**

1. Validate all form data
2. Call TassPro `PreBook` again (final check)
3. If validation passes, call TassPro `Book` API
4. Store booking in database:

   - Create `Booking` record
   - Create `BookingRoom` records
   - Store guest details as JSON

5. Generate booking reference
6. (Phase 5.4) Send confirmation email
7. Return booking confirmation

**Response:**

```json
{
  "success": true,
  "bookingId": "internal-id",
  "confirmationNumber": "46F0D8CFE",
  "hotelConfirmationNumber": "501654455",
  "status": "Confirmed"
}
```

### 5.4 Email Confirmation Setup

**SMTP Configuration:**

- Add SMTP credentials to `.env` (host, port, user, password)
- Use `nodemailer` library
- Create email templates:
  - Booking confirmation email (HTML + plain text)
  - Cancellation confirmation email

**Booking Confirmation Email Content:**

- Booking reference numbers
- Hotel details (name, address, image)
- Check-in / Check-out dates
- Room details
- Guest names
- Total amount paid
- Cancellation policy summary
- Contact information

### 5.5 Booking Confirmation Page

Create `/booking/confirmation/[bookingId]` page:

- Display all booking details
- Print-friendly format
- "Email Confirmation" button (resend email)
- "View Booking Details" button

### 5.6 Post-Booking Account Creation

After successful booking, show modal:

- "Create an account to manage your bookings"
- Pre-fill email from booking
- Password field
- Optional: First name, last name (if not provided)
- "Create Account" or "Skip" buttons

**If user creates account:**

- Hash password (bcrypt)
- Create `User` record
- Associate booking with user
- Send welcome email with email verification link

---

## Phase 6: User Authentication & Account Management

**Objective:** Full user authentication system with booking history

### 6.1 Authentication System

**JWT Token Strategy:**

- Access token (short-lived, 15 minutes)
- Refresh token (long-lived, 7 days, stored in httpOnly cookie)
- Token payload: userId, email, role (user/admin)

**Endpoints:**

- `/api/auth/register` (POST) - Create new user account
- `/api/auth/login` (POST) - Login with email/password
- `/api/auth/logout` (POST) - Invalidate tokens (add to Redis blacklist)
- `/api/auth/refresh` (POST) - Get new access token
- `/api/auth/verify-email` (GET) - Email verification link handler
- `/api/auth/forgot-password` (POST) - Request password reset
- `/api/auth/reset-password` (POST) - Complete password reset

**Security Measures:**

- Password hashing with bcrypt (salt rounds: 10)
- Rate limiting on login endpoint (5 attempts per 15 minutes)
- CSRF protection
- HttpOnly cookies for refresh tokens
- Token blacklist in Redis for logout

### 6.2 User Dashboard

Create `/account` page (protected route):

**Sections:**

1. **Profile Overview:**

   - Name, email, phone
   - Edit profile button

2. **My Bookings:**

   - List of all bookings (past and upcoming)
   - Filter: Upcoming, Past, Cancelled
   - Sort: Date (newest first)
   - Each booking card shows:
     - Hotel name, image
     - Check-in/out dates
     - Booking reference
     - Status badge
     - "View Details" button
     - "Cancel Booking" button (if cancellable)

3. **Saved Payment Methods:** (Phase 8 - Stripe integration)

4. **Account Settings:**

   - Change password
   - Email preferences
   - Delete account

### 6.3 Booking Details Page

Create `/account/bookings/[bookingId]` page:

- Full booking information (same as confirmation page)
- Retrieve booking details from database
- Option to call TassPro `BookingDetails` API for latest status
- Download booking confirmation (PDF generation or print)

### 6.4 Booking Cancellation

**Cancellation Flow:**

1. User clicks "Cancel Booking"
2. Show modal with cancellation policy and charges
3. Confirm cancellation
4. Call `/api/bookings/[bookingId]/cancel`:

   - Call TassPro `Cancel` API
   - Update booking status in database
   - Send cancellation confirmation email

5. Show cancellation confirmation with refund details (if applicable)

**Cancellation Rules:**

- Check if booking is cancellable (based on rate type)
- Calculate cancellation charges from policy
- Display charges before confirmation

---

## Phase 7: Admin Panel - Core Features

**Objective:** Build comprehensive admin dashboard with full system control

### 7.1 Admin Authentication & Routing

**Admin Role:**

- Add `role` enum to User model: `USER`, `ADMIN`
- Protect all `/admin/*` routes with admin role check
- Admin login: `/admin/login` (separate from user login)

### 7.2 Admin Dashboard Overview

Create `/admin/dashboard` page:

**Key Metrics Cards:**

- Total bookings (today, this week, this month)
- Revenue (with currency breakdown)
- Active bookings
- Cancelled bookings
- Average booking value
- Top destinations

**Charts:**

- Bookings over time (line chart)
- Revenue by destination (bar chart)
- Booking status distribution (pie chart)

**Recent Activity:**

- Latest 10 bookings
- Recent searches
- Failed booking attempts

### 7.3 Booking Management

Create `/admin/bookings` page:

**Features:**

- Table view of all bookings
- Filters:
  - Date range
  - Status (Confirmed, Cancelled, Failed)
  - Destination
  - Hotel
  - Customer email/name
- Search by booking reference
- Export to CSV
- Bulk actions (if needed)

**Booking Detail Modal:**

- Full booking information
- Customer details
- Payment information (Phase 8)
- Action buttons:
  - View in TassPro (external link if available)
  - Cancel booking
  - Resend confirmation email
  - Add internal notes

### 7.4 Price Override Management

Create `/admin/pricing` page:

**Global Markup:**

- Set global percentage markup (e.g., 10% on all hotels)
- Enable/disable toggle
- Shows affected hotel count
- Apply/Save button

**Hotel-Specific Overrides:**

- Search for hotel by code or name
- Add new override:
  - Hotel selector (autocomplete)
  - Override type: Percentage or Fixed Price
  - Value input
  - Currency (for fixed price)
  - Active toggle
- Table of existing overrides:
  - Hotel name, code
  - Override type, value
  - Status (Active/Inactive)
  - Created date
  - Actions: Edit, Delete, Toggle Active

**Price Preview:**

- Select a hotel
- Show original API price
- Show price after override
- Difference calculation

### 7.5 Customer Management

Create `/admin/customers` page:

**Customer List:**

- Table with: Name, Email, Total Bookings, Total Spent, Join Date
- Search by name/email
- Filter: Registered users vs Guest bookings
- Sort options

**Customer Detail View:**

- Customer profile information
- Booking history
- Total revenue from customer
- Option to merge guest bookings with registered account
- Send email to customer

### 7.6 Hotel & Destination Management

Create `/admin/hotels` page:

**Hotel Cache Management:**

- View cached hotels
- Refresh hotel data from API
- Bulk refresh destinations
- Clear cache selectively

**Destination Analytics:**

- Popular destinations (by search count)
- Conversion rates (searches → bookings)
- Add new destinations manually

### 7.7 API Monitoring

Create `/admin/api-logs` page:

**API Call Logs:**

- Log all TassPro API calls to database:
  - Endpoint, method
  - Request/response payloads
  - Status code
  - Response time
  - Timestamp
- Filter by endpoint, status, date range
- Show error rate
- Performance metrics

**Search Logs:**

- View all searches (from `SearchLog` table)
- Analyze search patterns
- Popular destinations/date ranges
- Searches with no results

---

## Phase 8: Payment Integration (Stripe)

**Objective:** Integrate Stripe for secure payment processing

### 8.1 Stripe Setup

**Configuration:**

- Create Stripe account
- Add Stripe keys to `.env` (publishable key, secret key)
- Install Stripe SDK: `npm install stripe @stripe/stripe-js @stripe/react-stripe-js`

**Webhook Setup:**

- Create webhook endpoint: `/api/webhooks/stripe`
- Handle events:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`

### 8.2 Payment Flow Integration

**Modify Booking Flow:**

1. **On Checkout Page:**

   - Add "Payment Method" section
   - Stripe Card Element component
   - Support saved cards for registered users

2. **Before calling TassPro Book API:**

   - Create Stripe Payment Intent
   - Amount: Total booking price (after admin overrides)
   - Currency: Selected currency
   - Metadata: booking details
   - Wait for payment confirmation

3. **After successful payment:**

   - Call TassPro `Book` API
   - Store payment information in database:
     - Add `Payment` table: (id, bookingId, stripePaymentIntentId, amount, currency, status, createdAt)
   - Send confirmation email with payment receipt

4. **Handle payment failures:**

   - Show error message
   - Option to retry payment
   - Don't call TassPro Book API if payment fails

### 8.3 Refund Handling

**Cancellation with Refund:**

- When booking is cancelled, calculate refund amount
- Trigger Stripe refund API
- Update payment status in database
- Send refund confirmation email

**Admin Refund Control:**

- Admin can issue partial/full refunds
- Override automatic refund amounts
- View refund history per booking

### 8.4 Payment Dashboard (Admin)

Create `/admin/payments` page:

**Features:**

- All transactions list
- Filter by status (Succeeded, Failed, Refunded)
- Revenue analytics
- Failed payment investigation
- Reconciliation tools (compare Stripe vs internal records)

---

## Phase 9: Advanced Features & Optimization

**Objective:** Polish, optimize, and add advanced features

### 9.1 Performance Optimization

**Backend:**

- Database query optimization (add indexes on frequently queried fields)
- API response time monitoring
- Redis connection pooling
- Implement database read replicas (if needed for scaling)

**Frontend:**

- Image optimization (Next.js Image component)
- Code splitting for large components
- Lazy loading for hotel images
- Service worker for offline capability (basic)

**Caching Strategy Review:**

- Analyze cache hit rates
- Optimize TTL values based on usage patterns
- Implement cache warming for popular destinations

### 9.2 Search Enhancements

**Advanced Filters:**

- Hotel amenities filter (Pool, WiFi, Gym, Parking, etc.)
- Distance from landmarks
- Guest rating (if available from API)
- Bed type preference

**Map View:**

- Show hotels on interactive map
- Cluster markers for better UX
- Click on hotel marker → Show info popup
- Filter by map bounds

**Search History:**

- Show recent searches to logged-in users
- Quick re-run search
- Save favorite searches

### 9.3 User Experience Improvements

**Wishlist/Favorites:**

- Users can save hotels to wishlist
- View saved hotels
- Email alerts for price drops (advanced)

**Compare Hotels:**

- Select up to 3 hotels to compare
- Side-by-side comparison table
- Compare prices, amenities, locations

**Mobile App Considerations:**

- Ensure all APIs support mobile app (if future plan)
- API documentation for mobile team

### 9.4 Internationalization (i18n)

**Multi-Language Support:**

- Implement i18n framework (next-intl)
- Support languages: English, Arabic (RTL support), others
- Translate UI strings
- Hotel descriptions remain in original language from API

**Regional Settings:**

- Date format based on locale
- Number/currency formatting
- Default currency based on user location

### 9.5 Security Hardening

**Security Measures:**

- Rate limiting on all public APIs
- Input sanitization and validation
- SQL injection prevention (Prisma ORM handles this)
- XSS protection
- CORS configuration
- Security headers (helmet.js)
- Regular dependency updates
- Environment variable validation

**Audit Logging:**

- Log all admin actions
- Log booking modifications
- Track price override changes
- User login/logout logs

### 9.6 Error Handling & Monitoring

**Error Handling:**

- Global error boundary in React
- API error standardization
- User-friendly error messages
- Graceful degradation

**Monitoring & Alerting:**

- Application performance monitoring (APM) - consider free tier of services like Sentry
- Error tracking and reporting
- Uptime monitoring
- Alert on critical errors (email/SMS to admin)

---

## Phase 10: Testing & Documentation

**Objective:** Comprehensive testing and documentation

### 10.1 Manual Testing Checklist

**Functional Testing:**

- [ ] Destination autocomplete (various scenarios)
- [ ] Hotel search with different parameters
- [ ] Room selection for multiple rooms
- [ ] Guest checkout flow (complete booking)
- [ ] User registration and login
- [ ] Booking cancellation
- [ ] Admin login and all admin features
- [ ] Price override application
- [ ] Payment flow (Stripe test mode)
- [ ] Email delivery (all types)

**Edge Cases:**

- [ ] No search results
- [ ] API timeout handling
- [ ] Sold out hotels
- [ ] Price changes during booking
- [ ] Invalid booking attempts
- [ ] Concurrent bookings
- [ ] Payment failures
- [ ] Network errors

**Cross-Browser Testing:**

- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)

**Performance Testing:**

- Search response time under load
- Simultaneous bookings
- Admin dashboard with large datasets

### 10.2 API Documentation

Create comprehensive API documentation in `/docs/api`:

**For Each Endpoint:**

- URL and HTTP method
- Authentication requirements
- Request parameters (with types, validations)
- Request body examples
- Response format
- Response examples (success and error cases)
- Status codes
- Rate limiting info

**Use Tool:** Consider Swagger/OpenAPI specification for interactive docs

### 10.3 Code Documentation

**Code Comments:**

- JSDoc for all functions
- Explain complex business logic
- Document API integration quirks
- Type definitions with descriptions

**README Files:**

- Main README.md (project overview, setup instructions)
- `/docs/SETUP.md` - Detailed setup guide
- `/docs/DEPLOYMENT.md` - Deployment guide
- `/docs/ARCHITECTURE.md` - System architecture overview
- `/docs/API_INTEGRATION.md` - TassPro API integration notes

### 10.4 Automated Testing (Optional for Future)

**Test Suite Structure:**

- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows (using Playwright or Cypress)

**Testing Framework:**

- Jest for unit/integration tests
- React Testing Library for component tests
- Playwright for E2E tests

---

## Phase 11: Figma Design Integration

**Objective:** Apply Figma designs to replace placeholder UI

### 11.1 Design Handoff

**Prerequisites:**

- Receive Figma file or design specifications
- Extract design tokens (colors, typography, spacing, shadows)
- Identify reusable components

### 11.2 Design System Setup

**Create Design Tokens:**

```typescript
// tailwind.config.js
colors: {
  primary: {...},
  secondary: {...},
  // Based on Figma colors
}
fontSize: {...}
spacing: {...}
borderRadius: {...}
```

**Component Library:**

- Button variants
- Input fields, textareas
- Cards, modals
- Navigation, headers, footers
- Form components

### 11.3 Page-by-Page Design Implementation

**Priority Order:**

1. Homepage (search form)
2. Search results page
3. Hotel details page
4. Checkout page
5. User dashboard
6. Admin panel

**For Each Page:**

- Match exact spacing, colors, typography
- Implement responsive breakpoints
- Add animations/transitions from design
- Ensure accessibility (contrast, focus states)

### 11.4 Asset Optimization

- Export and optimize images/icons from Figma
- Use SVGs where possible
- Implement lazy loading for images
- Add loading skeletons matching design

---

## Phase 12: Deployment & Production Setup

**Objective:** Deploy application to in-home server

### 12.1 Production Environment Setup

**Server Requirements:**

- Ubuntu/Debian server (or preferred OS)
- Docker and Docker Compose installed
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)
- Domain name configured

### 12.2 Docker Production Configuration

**Create Production Dockerfile:**

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
# Build Next.js app
FROM node:18-alpine AS runner
# Production runtime
```

**Docker Compose for Production:**

- Next.js app container
- PostgreSQL container (with volume for persistence)
- Redis container (with volume for persistence)
- Nginx container (reverse proxy)

### 12.3 Environment Configuration

**Production `.env`:**

- All production API keys
- Secure JWT secrets
- Production database URL
- Redis URL
- SMTP credentials (production email)
- Stripe production keys
- Set `NODE_ENV=production`

**Environment Variables Security:**

- Never commit `.env` files
- Use Docker secrets or environment files
- Restrict server access

### 12.4 Database Migration

**Production Database Setup:**

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Seed initial data (destinations, admin user)
npx prisma db seed
```

### 12.5 SSL & Domain Configuration

**Nginx Configuration:**

- Set up reverse proxy to Next.js app
- Configure SSL with Let's Encrypt (certbot)
- HTTP → HTTPS redirect
- Security headers
- Rate limiting at nginx level

### 12.6 Monitoring & Logging

**Production Monitoring:**

- Set up log aggregation (consider free tiers)
- Database backup automation (daily backups)
- Disk space monitoring
- CPU/Memory usage alerts
- Uptime monitoring

### 12.7 Deployment Process

**Initial Deployment:**

1. Build Docker images
2. Push to container registry (or build on server)
3. Pull images on server
4. Run docker-compose up
5. Run database migrations
6. Verify all services running
7. Test critical user flows

**CI/CD Pipeline (Optional):**

- GitHub Actions workflow
- Automated tests on push
- Build and deploy on main branch merge

---

## Phase 13: Post-Launch & Maintenance

**Objective:** Ongoing maintenance and improvements

### 13.1 Launch Checklist

- [ ] All features tested and working
- [ ] Production environment stable
- [ ] Backups configured and tested
- [ ] Monitoring and alerts active
- [ ] Documentation complete
- [ ] Admin trained on system usage
- [ ] Customer support process defined

### 13.2 User Feedback Collection

- Add feedback form on website
- Monitor booking conversion rates
- Track user behavior (analytics)
- Identify pain points

### 13.3 Iterative Improvements

**Based on Usage Data:**

- Optimize slow pages
- Improve search relevance
- Add frequently requested features
- Fix bugs and edge cases

### 13.4 Regular Maintenance

**Monthly Tasks:**

- Review and clear old logs
- Database optimization (vacuum, analyze)
- Update dependencies (security patches)
- Review admin price overrides
- Check API usage and costs

**Quarterly Tasks:**

- Refresh destination database
- Review and update hotel static data
- Analyze booking trends
- Security audit

---

## Technical Considerations & Best Practices

### API Rate Limiting Protection

- Implement request queuing for TassPro API
- Exponential backoff on failures
- Circuit breaker pattern for API unavailability

### Session Management for TassPro API

- TassPro SessionId is critical - must be maintained throughout booking flow
- Store SessionId in:
  - React context for frontend
  - Redis with user session for persistence
  - Pass in all API requests after search

### Multi-Room Booking Complexity

- TassPro API returns room combinations (MarriageIdentifier, RoomCombinationId)
- Ensure selected rooms are compatible (same combination ID)
- Validate all rooms selected before proceeding to checkout

### Currency Handling

- Store all prices in original currency + converted currency
- Display prices in user-selected currency
- Handle exchange rate fluctuations (show warning if rate changes)
- Admin overrides should specify currency

### Guest vs User Bookings

- Guest bookings: Store email as identifier
- Allow guests to "claim" bookings when they register
- Merge booking history when email matches

### Price Accuracy Critical Points

- Prices can change between search and booking
- Always call PreBook before final booking
- Show clear message if price increases
- Require user confirmation for price changes

### Error Recovery

- Save user progress (form data) in localStorage
- Allow resume if session expires
- Clear recovery data after successful booking

---

## File Organization Best Practices

### Component Structure

```
components/
├── ui/              # Generic reusable UI components
├── forms/           # Form components
├── search/          # Search-specific components
├── hotel/           # Hotel display components
├── booking/         # Booking flow components
├── admin/           # Admin panel components
└── layouts/         # Layout components
```

### API Routes Structure

```
app/api/
├── auth/            # Authentication endpoints
├── destinations/    # Destination autocomplete
├── hotels/          # Hotel search, details
├── bookings/        # Booking CRUD operations
├── admin/           # Admin-only endpoints
├── payments/        # Stripe integration
└── webhooks/        # External webhooks
```

### Type Definitions

- Create types matching TassPro API responses
- Separate types for database models (Prisma)
- Shared types for frontend-backend communication

---

## Phased Implementation Summary

**Phase 1-2 (Week 1-2):** Foundation, database, destination autocomplete

**Phase 3-4 (Week 3-4):** Search functionality, hotel details, room selection

**Phase 5 (Week 5):** Guest checkout and booking

**Phase 6 (Week 6):** User authentication and account management

**Phase 7 (Week 7-8):** Admin panel core features

**Phase 8 (Week 9):** Payment integration

**Phase 9-10 (Week 10-11):** Optimization, testing, documentation

**Phase 11 (Week 12):** Figma design integration

**Phase 12 (Week 13):** Deployment

**Phase 13 (Ongoing):** Maintenance and improvements

**Note:** Timeline is approximate and depends on development pace. Each phase builds on previous phases.

### To-dos

- [ ] Complete project foundation: Initialize Next.js project, setup PostgreSQL + Redis with Docker, configure environment variables, design database schema with Prisma
- [ ] Build TassPro API client with all 12 methods, error handling, session management, and type definitions
- [ ] Implement destination autocomplete with hybrid caching (DB + Redis + API), seed popular destinations, create autocomplete UI component
- [ ] Build hotel search form with validation, implement search API with caching and price overrides, create search results page with progressive loading
- [ ] Create hotel details page with image gallery, room options display, implement room detail APIs (price breakup, cancellation policy), build room selection cart
- [ ] Build pre-booking validation, create checkout page with guest form, implement booking API, setup SMTP email confirmation, add post-booking account creation
- [ ] Implement full authentication system (register, login, JWT with refresh tokens), create user dashboard with booking history, build booking details and cancellation pages
- [ ] Build admin panel: dashboard with metrics, booking management, price override system (global + hotel-specific), customer management, API monitoring
- [ ] Integrate Stripe: setup payment flow, handle webhooks, implement refund logic, create payment dashboard in admin panel
- [ ] Performance optimization (DB indexes, caching review, image optimization), add advanced search features (filters, map view), implement wishlist and hotel comparison
- [ ] Conduct comprehensive manual testing (functional, edge cases, cross-browser), create API documentation, write code documentation and guides
- [ ] Integrate Figma designs: extract design tokens, build component library, implement designs page-by-page, optimize assets
- [ ] Setup production environment, configure Docker for production, setup SSL and domain, implement monitoring and backups, deploy to in-home server