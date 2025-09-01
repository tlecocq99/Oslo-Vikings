/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
  },
  env: {
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Compression
  compress: true,
};

module.exports = nextConfig;