/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dvssbllct/**',
      },
      {
        hostname: 'tailwindui.com',
      },
      {
        hostname: 'trendy.pt',
      },
      {
        hostname: 'i.pinimg.com',
      },
      {
        hostname: 'media.giphy.com',
      },
      {
        hostname: 'funsubstance.com',
      },
      {
        hostname: 'th.bing.com',
      },
      {
        hostname: 'img.buzzfeed.com',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
  // Enable HTTP in development
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? `http://localhost:44394/:path*`
          : `http://localhost:${process.env.HTTPS_PORT || '44394'}/:path*`,
        basePath: false,
      },
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
}

module.exports = nextConfig;
