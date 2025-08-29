/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['a.storyblok.com']
  },
  env: {
    STORYBLOK_ACCESS_TOKEN: process.env.STORYBLOK_ACCESS_TOKEN,
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Compression
  compress: true,
};

module.exports = nextConfig;