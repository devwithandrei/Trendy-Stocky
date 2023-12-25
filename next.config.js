/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'tailwindui.com',
      },
      {
        hostname: 'res.cloudinary.com',
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
        hostname: 'funsubstance.com', // Add 'funsubstance.com' here
      },
      {
        hostname: 'https://th.bing.com', // Add 'funsubstance.com' here
      },
      {
        hostname: 'https://img.buzzfeed.com', // Add 'funsubstance.com' here
      },
      // Add more hostname configurations as needed
    ],
  },
};

module.exports = nextConfig;




