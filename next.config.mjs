/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode helps catch bugs early
  reactStrictMode: true,
  // Remote image patterns for Cloudinary URLs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'dfdhclyt7.cloudinary.com',
      },
    ],
  },
  // Enable gzip compression for static assets
  compress: true,
  // Output a standalone build for easy deployment
  output: 'standalone',
};

export default nextConfig;
