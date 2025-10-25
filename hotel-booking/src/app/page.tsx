import { config } from '@/config';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {config.app.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {config.app.description}
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Welcome to Hotel Booking System
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Next.js 14 with TypeScript</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">PostgreSQL with Prisma ORM</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Redis for caching</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">TassPro API integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Tailwind CSS styling</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Next Steps
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>1. Install Docker and run: <code className="bg-blue-100 px-2 py-1 rounded">./setup.sh</code></p>
                <p>2. Or manually setup PostgreSQL and Redis</p>
                <p>3. Run database migrations: <code className="bg-blue-100 px-2 py-1 rounded">npm run db:migrate</code></p>
                <p>4. Start development: <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code></p>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Phase 1: Project Foundation ✅</p>
              <p>Phase 2: Destination Search (Next)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}