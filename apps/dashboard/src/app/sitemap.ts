export default async function sitemap() {
  return [
    {
      url: "https://app.cravvelo.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
