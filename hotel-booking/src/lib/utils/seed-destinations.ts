import { dbService } from '@/lib/db/prisma';
import { tassProApi } from '@/lib/api/tasspro-client';

// Popular countries to seed destinations for
const POPULAR_COUNTRIES = [
  'AE', // United Arab Emirates
  'US', // United States
  'GB', // United Kingdom
  'FR', // France
  'DE', // Germany
  'IT', // Italy
  'ES', // Spain
  'NL', // Netherlands
  'TH', // Thailand
  'SG', // Singapore
  'MY', // Malaysia
  'IN', // India
  'JP', // Japan
  'KR', // South Korea
  'AU', // Australia
  'CA', // Canada
  'BR', // Brazil
  'TR', // Turkey
  'EG', // Egypt
  'SA', // Saudi Arabia
];

async function seedDestinations() {
  console.log('🌱 Starting destination seeding process...');
  
  let totalSeeded = 0;
  
  for (const countryCode of POPULAR_COUNTRIES) {
    try {
      console.log(`📡 Fetching destinations for ${countryCode}...`);
      
      const apiResponse = await tassProApi.countryInfo({ countryCode });
      
      if (!apiResponse.isSuccess || !apiResponse.data) {
        console.warn(`⚠️  Failed to fetch destinations for ${countryCode}`);
        continue;
      }

      const destinations = apiResponse.data.map(dest => ({
        destinationId: dest.key,
        cityName: dest.value,
        countryName: getCountryName(countryCode),
        countryCode: countryCode,
      }));

      console.log(`💾 Saving ${destinations.length} destinations for ${countryCode}...`);
      
      for (const dest of destinations) {
        await dbService.upsertDestination(dest);
      }
      
      totalSeeded += destinations.length;
      console.log(`✅ Successfully seeded ${destinations.length} destinations for ${countryCode}`);
      
      // Add delay between API calls to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error seeding destinations for ${countryCode}:`, error);
    }
  }
  
  console.log(`🎉 Destination seeding completed! Total destinations seeded: ${totalSeeded}`);
}

// Helper function to get country name from country code
function getCountryName(countryCode: string): string {
  const countryNames: { [key: string]: string } = {
    'AE': 'United Arab Emirates',
    'US': 'United States',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
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
    'CA': 'Canada',
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'JP': 'Japan',
    'KR': 'South Korea',
    'CN': 'China',
    'IN': 'India',
    'TH': 'Thailand',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'ID': 'Indonesia',
    'PH': 'Philippines',
    'VN': 'Vietnam',
    'RU': 'Russian Federation',
    'BR': 'Brazil',
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

  return countryNames[countryCode] || countryCode;
}

// Run the seeding if this file is executed directly
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
