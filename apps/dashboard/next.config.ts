import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: [
      "utfs.io",
      "cravvel-bucket.s3.eu-west-1.amazonaws.com",
      "images.unsplash.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["handlebars"],
  // Turbopack config - explicit path alias resolution
  // Matches tsconfig: "@/*": ["./*"] so @/src/... resolves to ./src/...
  turbopack: {
    resolveAlias: {
      '@/*': './*',
    },
  },
  // Webpack config for production builds and when --webpack flag is used
  webpack: (config, { isServer }) => {
    // Only apply fallbacks for client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Ignore handlebars and canvas on client-side completely
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: isServer ? "handlebars" : false,
      canvas: false,
    };

    return config;
  },
  output: 'standalone',
};

export default withNextIntl(config);
