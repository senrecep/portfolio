/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🚀 GZIP COMPRESSION - Enabled by default but explicitly set
  compress: true,

  // 🎯 Production optimizations
  compiler: {
    // Remove console.log statements in production for smaller bundles
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 🖼️ Image optimizations for better compression
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
