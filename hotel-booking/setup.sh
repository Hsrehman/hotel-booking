#!/bin/bash

# Hotel Booking System Setup Script
# This script sets up the development environment

echo "🏨 Hotel Booking System Setup"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is installed"

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL connection..."
until docker exec hotel-booking-postgres pg_isready -U postgres; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

# Check if Redis is ready
echo "🔍 Checking Redis connection..."
until docker exec hotel-booking-redis redis-cli ping; do
    echo "Waiting for Redis..."
    sleep 2
done

echo "✅ All services are ready!"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed initial data (if seed script exists)
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env.local and update with your values"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "Services running:"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo "- Next.js: localhost:3000 (after npm run dev)"
