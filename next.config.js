/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Compression
  compress: true,
  webpack: (config) => {
    // Workaround for intermittent Windows ENOENT rename errors in webpack persistent cache
    if (config.cache && config.cache.type === "filesystem") {
      config.cache.buildDependencies = {
        ...(config.cache.buildDependencies || {}),
        config: [__filename],
      };
      // Disable filesystem cache to prevent rename issues
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
