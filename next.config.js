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
        hostname: 'th.bing.com', // Add 'th.bing.com' here
      },
      {
        hostname: 'img.buzzfeed.com', // Add 'img.buzzfeed.com' here
      },
      // Add more hostname configurations as needed
    ],
  },
};

module.exports = nextConfig;
