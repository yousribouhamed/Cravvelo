import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: [
      "uploadthing.com",
      "vod.api.video",
      "utfs.io",
      "cravvel-bucket.s3.eu-west-1.amazonaws.com",
      "images.unsplash.com",
    ],
  },
};

export default withNextIntl(config);
