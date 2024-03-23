/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
