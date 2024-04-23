import { MetadataRoute } from "next";
import { prisma } from "database/src";

export default async function sitemap() {
  // fetch all the subdomain in the platforms
  const websites = await prisma.website.findMany({
    select: {
      subdomain: true,
    },
  });

  const siteMapArray = websites.map((item) => {
    return {
      url: item,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    };
  });

  return [
    {
      url: "https://app.cravvelo.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },

    ...siteMapArray,
  ];
}
