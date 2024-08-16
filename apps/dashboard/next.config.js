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

  metadataBase:
    process.env.NODE_ENV === "production"
      ? "https://beta.cravvelo.com"
      : "http://localhost:3001",
};
