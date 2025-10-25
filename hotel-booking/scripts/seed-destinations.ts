import { PrismaClient } from '@prisma/client';
import { tassProApi } from '../src/lib/api/tasspro-client';
import { config } from '../src/config';

const prisma = new PrismaClient();

async function seedDestinations() {
  console.log('🌱 Starting destination seeding...');

  try {
    // Get destinations for major countries
    const countries = ['AE', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL'];
    const popularCities = [
      'Dubai', 'Abu Dhabi', 'New York', 'London', 'Paris', 'Rome', 'Barcelona', 'Amsterdam',
      'Toronto', 'Sydney', 'Melbourne', 'Berlin', 'Munich', 'Madrid', 'Milan', 'Vancouver',
      'Los Angeles', 'Chicago', 'Boston', 'Manchester', 'Birmingham', 'Lyon', 'Marseille',
      'Florence', 'Venice', 'Seville', 'Valencia', 'Rotterdam', 'The Hague', 'Montreal',
      'Calgary', 'Perth', 'Brisbane', 'Hamburg', 'Cologne', 'Frankfurt', 'Toulouse',
      'Nice', 'Naples', 'Bologna', 'Bilbao', 'Malaga', 'Utrecht', 'Eindhoven'
    ];

    let totalAdded = 0;

    // Seed popular cities
    for (const city of popularCities) {
      try {
        console.log(`🔍 Fetching destinations for: ${city}`);
        const destinations = await tassProApi.destinationInfo(city);
        
        for (const dest of destinations) {
          const existing = await prisma.destination.findUnique({
            where: { destinationId: dest.destinationId },
          });

          if (!existing) {
            await prisma.destination.create({
              data: {
                destinationId: dest.destinationId,
                cityName: dest.cityName,
                countryName: dest.countryName,
                countryCode: dest.countryCode,
                searchCount: 0,
                lastUsed: new Date(),
              },
            });
            totalAdded++;
            console.log(`✅ Added: ${dest.cityName}, ${dest.countryName}`);
          } else {
            console.log(`⏭️  Skipped (exists): ${dest.cityName}, ${dest.countryName}`);
          }
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error fetching destinations for ${city}:`, error);
      }
    }

    // Seed by country codes
    for (const countryCode of countries) {
      try {
        console.log(`🌍 Fetching cities for country: ${countryCode}`);
        const cities = await tassProApi.countryInfo(countryCode);
        
        for (const city of cities) {
          // Extract destination ID from the key (format: "160-0")
          const destinationId = city.key;
          const cityName = city.value;

          const existing = await prisma.destination.findUnique({
            where: { destinationId },
          });

          if (!existing) {
            await prisma.destination.create({
              data: {
                destinationId,
                cityName,
                countryName: getCountryName(countryCode),
                countryCode,
                searchCount: 0,
                lastUsed: new Date(),
              },
            });
            totalAdded++;
            console.log(`✅ Added: ${cityName}, ${getCountryName(countryCode)}`);
          }
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error fetching cities for ${countryCode}:`, error);
      }
    }

    console.log(`🎉 Destination seeding completed! Added ${totalAdded} new destinations.`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function getCountryName(countryCode: string): string {
  const country = config.countries.find(c => c.code === countryCode);
  return country ? country.name : countryCode;
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDestinations()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDestinations };
