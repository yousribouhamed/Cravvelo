"use server";

import { withAuth } from "@/_internals/with-auth";

export const getAllWebsites = withAuth({
  handler: async ({ db }) => {
    try {
      const websites = await db.website.findMany({
        include: {
          Account: {
            select: {
              id: true,
              user_name: true,
              avatarUrl: true,
              verified: true,
            },
          },
          WebsiteAnalytics: {
            orderBy: {
              date: "desc",
            },
            take: 6, // Last 6 data points for chart
            select: {
              visits: true,
              pageViews: true,
              date: true,
            },
          },
          _count: {
            select: {
              WebsiteAnalytics: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      // Transform the data to match the expected format
      const transformedWebsites = websites.map((website) => ({
        id: website.id,
        name: website.name || "Unnamed Website",
        logo: website.favicon || website.logo || "🌐",
        description: website.description || "No description available",
        subdomain: website.subdomain,
        customDomain: website.customDomain,
        suspended: website.suspended,
        accountName: website.Account.user_name || "Unknown User",
        accountVerified: website.Account.verified,

        accountAvatar: website.Account.avatarUrl,
        // Calculate total visits from analytics
        totalVisits: website.WebsiteAnalytics.reduce(
          (sum, analytics) => sum + analytics.visits,
          0
        ),
        // Calculate rating based on activity (placeholder logic)
        rating: Math.min(
          5.0,
          Math.max(
            3.0,
            4.0 +
              (website.WebsiteAnalytics.length > 10 ? 1.0 : 0) -
              (website.suspended ? 2.0 : 0)
          )
        ),
        // Chart data from analytics
        chartData: website.WebsiteAnalytics.reverse().map((analytics) => ({
          value: analytics.visits,
          date: analytics.date,
        })),
        // Additional useful fields
        createdAt: website.createdAt,
        updatedAt: website.updatedAt,
        primaryColor: website.primaryColor,
        currency: website.currency,
        language: website.language,
      }));

      return {
        success: true,
        data: transformedWebsites,
        count: transformedWebsites.length,
      };
    } catch (error) {
      console.error("Error fetching websites:", error);
      return {
        success: false,
        error: "Failed to fetch websites",
        data: [],
        count: 0,
      };
    }
  },
});

// Additional action to get website analytics summary
export const getWebsiteAnalyticsSummary = withAuth({
  handler: async ({ db }) => {
    try {
      const summary = await db.website.aggregate({
        _count: {
          id: true,
        },
        where: {
          suspended: false,
        },
      });

      const suspendedCount = await db.website.count({
        where: {
          suspended: true,
        },
      });

      const totalAnalytics = await db.websiteAnalytics.aggregate({
        _sum: {
          visits: true,
          pageViews: true,
          uniqueVisitors: true,
        },
      });

      return {
        success: true,
        data: {
          totalWebsites: summary._count.id + suspendedCount,
          activeWebsites: summary._count.id,
          suspendedWebsites: suspendedCount,
          // ✅ Fixed: Ensure these values are never undefined
          totalVisits: totalAnalytics._sum.visits ?? 0,
          totalPageViews: totalAnalytics._sum.pageViews ?? 0,
          totalUniqueVisitors: totalAnalytics._sum.uniqueVisitors ?? 0,
        },
      };
    } catch (error) {
      console.error("Error fetching website analytics summary:", error);
      return {
        success: false,
        error: "Failed to fetch analytics summary",
        data: null,
      };
    }
  },
});
