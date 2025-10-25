import prisma from '@/lib/db/prisma';
import { TassProApiClient } from '@/lib/api/tasspro-client';

const tassproClient = new TassProApiClient();

// Major countries to seed (from plan)
const countriesToSeed = [
  'AE', 'US', 'GB', 'FR', 'DE', 'ES', 'IT', 'RU', 'CN', 'JP', 
  'IN', 'BR', 'AU', 'CA', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 
  'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'GR', 'PT', 'IE',
  'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'HR', 'NZ',
  'KR', 'TH', 'SG', 'MY', 'ID', 'PH', 'VN', 'AR', 'CL', 'CO',
  'PE', 'MX', 'ZA', 'EG', 'MA', 'TN', 'TR', 'IL', 'SA', 'KW',
  'QA', 'BH', 'OM', 'JO', 'LB'
];

// Country name mapping
const countryNames: { [key: string]: string } = {
  'AE': 'United Arab Emirates',
  'US': 'United States',
  'GB': 'United Kingdom',
  'FR': 'France',
  'DE': 'Germany',
  'IT': 'Italy',
  'ES': 'Spain',
  'RU': 'Russian Federation',
  'CN': 'China',
  'JP': 'Japan',
  'IN': 'India',
  'BR': 'Brazil',
  'AU': 'Australia',
  'CA': 'Canada',
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
  'NZ': 'New Zealand',
  'KR': 'South Korea',
  'TH': 'Thailand',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
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

async function seedDestinations() {
  console.log('🌍 Starting destination seeding...');
  console.log(`📊 Seeding ${countriesToSeed.length} countries`);
  
  let totalDestinations = 0;
  let successfulCountries = 0;
  let failedCountries = 0;

  for (const countryCode of countriesToSeed) {
    try {
      console.log(`\n🔍 Fetching destinations for ${countryCode} (${countryNames[countryCode] || countryCode})...`);
      
      const response = await tassproClient.countryInfo({ countryCode });
      
      if (response.isSuccess && response.data && Array.isArray(response.data)) {
        const destinations = response.data.map(item => ({
          destinationId: item.key,
          cityName: item.value,
          countryName: countryNames[countryCode] || countryCode,
          countryCode: countryCode,
        }));

        // Batch insert destinations
        for (const dest of destinations) {
          await prisma.destination.upsert({
            where: { destinationId: dest.destinationId },
            update: {
              cityName: dest.cityName,
              countryName: dest.countryName,
              countryCode: dest.countryCode,
              lastUsed: new Date(),
            },
            create: {
              destinationId: dest.destinationId,
              cityName: dest.cityName,
              countryName: dest.countryName,
              countryCode: dest.countryCode,
              searchCount: 0,
              lastUsed: new Date(),
            },
          });
        }

        totalDestinations += destinations.length;
        successfulCountries++;
        console.log(`✅ Seeded ${destinations.length} destinations for ${countryCode}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } else {
        console.warn(`⚠️  Failed to fetch destinations for ${countryCode}: ${response.exceptionMessage || 'Unknown error'}`);
        failedCountries++;
      }
      
    } catch (error) {
      console.error(`❌ Error seeding destinations for ${countryCode}:`, error);
      failedCountries++;
    }
  }

  console.log('\n🎉 Destination seeding complete!');
  console.log(`📈 Summary:`);
  console.log(`   ✅ Successful countries: ${successfulCountries}`);
  console.log(`   ❌ Failed countries: ${failedCountries}`);
  console.log(`   🏙️  Total destinations: ${totalDestinations}`);
  
  // Show some sample destinations
  const sampleDestinations = await prisma.destination.findMany({
    take: 10,
    orderBy: { lastUsed: 'desc' }
  });
  
  console.log('\n📋 Sample destinations:');
  sampleDestinations.forEach(dest => {
    console.log(`   ${dest.cityName}, ${dest.countryName} (${dest.destinationId})`);
  });
}

async function seedHotels() {
  console.log('\n🏨 Starting hotel seeding...');
  
  // Get some popular destinations
  const popularDestinations = await prisma.destination.findMany({
    where: {
      countryCode: { in: ['AE', 'US', 'GB', 'FR', 'DE'] }
    },
    take: 5
  });

  let totalHotels = 0;

  for (const destination of popularDestinations) {
    try {
      console.log(`\n🔍 Fetching hotels for ${destination.cityName}, ${destination.countryName}...`);
      
      const response = await tassproClient.hotelsInfoByDestinationId({ 
        destinationId: destination.destinationId 
      });
      
      if (response.isSuccess && response.data && Array.isArray(response.data)) {
        for (const hotel of response.data) {
          await prisma.hotel.upsert({
            where: { systemId: hotel.systemId },
            update: {
              name: hotel.name,
              destinationId: hotel.destinationId,
              addressLine1: hotel.address1,
              city: hotel.city,
              countryCode: destination.countryCode,
              countryName: destination.countryName,
              latitude: hotel.geoCode?.lat,
              longitude: hotel.geoCode?.lon,
              starRating: hotel.rating,
              imageUrl: hotel.imageUrl,
              lastUsed: new Date(),
            },
            create: {
              systemId: hotel.systemId,
              name: hotel.name,
              destinationId: hotel.destinationId,
              addressLine1: hotel.address1,
              city: hotel.city,
              countryCode: destination.countryCode,
              countryName: destination.countryName,
              latitude: hotel.geoCode?.lat,
              longitude: hotel.geoCode?.lon,
              starRating: hotel.rating,
              imageUrl: hotel.imageUrl,
              lastUsed: new Date(),
            },
          });
        }

        totalHotels += response.data.length;
        console.log(`✅ Seeded ${response.data.length} hotels for ${destination.cityName}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } else {
        console.warn(`⚠️  Failed to fetch hotels for ${destination.cityName}: ${response.exceptionMessage || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error(`❌ Error seeding hotels for ${destination.cityName}:`, error);
    }
  }

  console.log(`\n🏨 Hotel seeding complete! Total hotels: ${totalHotels}`);
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive data seeding...');
    
    // Seed destinations first
    await seedDestinations();
    
    // Then seed hotels for popular destinations
    await seedHotels();
    
    console.log('\n🎉 All seeding complete!');
    
    // Show final statistics
    const destinationCount = await prisma.destination.count();
    const hotelCount = await prisma.hotel.count();
    
    console.log('\n📊 Final Statistics:');
    console.log(`   🏙️  Destinations: ${destinationCount}`);
    console.log(`   🏨 Hotels: ${hotelCount}`);
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
main();
