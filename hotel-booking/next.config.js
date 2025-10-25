/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for now to avoid double rendering issues during development
  reactStrictMode: false,
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.giinfotech.ae',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Environment variables that should be available on the client side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
