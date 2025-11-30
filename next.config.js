/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [256, 384, 640, 750, 828, 1080],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=(self)",
              "autoplay=()",
              "camera=()",
              "display-capture=()",
              "encrypted-media=()",
              "fullscreen=(self)",
              "geolocation=()",
              "gyroscope=(self)",
              "magnetometer=(self)",
              "microphone=()",
              "midi=()",
              "payment=()",
              "usb=()",
              "unload=(self)",
            ].join(", "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
