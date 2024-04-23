import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about-us", "/contact-us", "/pricing", "/features"],
      disallow: [],
    },
    sitemap: "https://www.cravvelo.com/sitemap.xml",
  };
}
