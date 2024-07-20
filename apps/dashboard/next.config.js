/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: [
      "utfs.io",
      "cravvel-bucket.s3.eu-west-1.amazonaws.com",
      "images.unsplash.com",
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
};

// [
//   // Exclude Puppeteer’s source maps
//   /node_modules\/puppeteer-core/,
//   /node_modules\/@sparticuz\/chromium/,
// ],
