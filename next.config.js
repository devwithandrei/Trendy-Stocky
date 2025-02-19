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
};

module.exports = nextConfig;
