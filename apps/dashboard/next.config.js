/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["uploadthing.com", "vod.api.video"],
  },
};
