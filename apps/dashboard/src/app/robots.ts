import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "*",
      disallow: [],
    },
    sitemap: "https://app.cravvelo.com/sitemap.xml",
  };
}
