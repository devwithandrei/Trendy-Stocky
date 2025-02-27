/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
      {
        protocol: 'https',
        hostname: 'trendy.pt',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'funsubstance.com',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'img.buzzfeed.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'cdn.clerk.app',
      },
      {
        protocol: 'https',
        hostname: 'clerk.app',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable HTTP in development
  async rewrites() {
    return [
      {
        source: '/api/:storeId/:path*',
        destination: 'http://localhost:3000/api/:storeId/:path*',
        basePath: false,
      }
    ];
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  publicRuntimeConfig: {
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_API_KEY: process.env.CLERK_API_KEY,
  },
};

module.exports = nextConfig;
