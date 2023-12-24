/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use regular expression objects for remotePatterns
    remotePatterns: [
      {
        hostname: 'tailwindui.com', // Hostname for tailwindui.com
        // Add more properties or conditions if needed
        // For example: path: /^\/images\//,
        // This defines a path regex for images within the specified domain
      },
      {
        hostname: 'res.cloudinary.com', // Hostname for res.cloudinary.com
      },
      {
        hostname: 'th.bing.com', // Hostname for th.bing.com
      },
      {
        hostname: 'https://i.pinimg.com', // Hostname for th.bing.com
      },
      {
        hostname: 'https://media.giphy.com', // Hostname for th.bing.com
      }

      // Add more regular expression objects as needed for other domains or paths
    ]
  }
};

module.exports = nextConfig;