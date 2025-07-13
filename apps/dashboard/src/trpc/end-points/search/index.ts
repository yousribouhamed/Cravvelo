import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { Course, Product } from "database";

interface ProductGroup {
  pages: { name: string; path: string }[];
  products: Product[];
  courses: Course[];
}

export const search = {
  getUserQuery: privateProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().min(1).max(50).optional().default(10),
        includeInactive: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { query, limit, includeInactive } = input;
        
        // Validate account exists
        if (!ctx.account?.id) {
          throw new Error("Account not found");
        }

        // Normalize search query
        const normalizedQuery = query.trim().toLowerCase();
        
        // Build search conditions
        const searchConditions = {
          accountId: ctx.account.id,
          ...(includeInactive ? {} : { 
            OR: [
              { status: { not: "INACTIVE" } },
              { status: null }
            ]
          }),
        };

        // Search products with optimized query
        const products = await ctx.prisma.product.findMany({
          where: {
            ...searchConditions,
            OR: [
              {
                title: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
              {
                subDescription: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
              {
                SeoDescription: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
              {
                SeoTitle: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
            ],
          },
          select: {
            id: true,
            title: true,
            subDescription: true,
            SeoDescription: true,
            SeoTitle: true,
            price: true,
            compareAtPrice: true,
            thumbnailUrl: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          take: limit,
          orderBy: [
            {
              updatedAt: "desc",
            },
          ],
        });

        // Search courses with optimized query
        const courses = await ctx.prisma.course.findMany({
          where: {
            ...searchConditions,
            OR: [
              {
                title: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
              {
                courseResume: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
              {
                seoTitle: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
              {
                seoDescription: {
                  contains: normalizedQuery,
                  mode: "insensitive",
                },
              },
            ],
          },
          select: {
            id: true,
            title: true,
            courseResume: true,
            seoTitle: true,
            seoDescription: true,
            price: true,
            compareAtPrice: true,
            thumbnailUrl: true,
            status: true,
            rating: true,
            studentsNbr: true,
            level: true,
            sound: true,
            createdAt: true,
            updatedAt: true,
          },
          take: limit,
          orderBy: [
            {
              rating: "desc",
            },
            {
              updatedAt: "desc",
            },
          ],
        });

        // Score and sort results by relevance
        const scoredProducts = products.map((product) => {
          let score = 0;
          const titleMatch = product.title.toLowerCase().includes(normalizedQuery);
          const descriptionMatch = product.subDescription?.toLowerCase().includes(normalizedQuery);
          const seoMatch = product.SeoDescription?.toLowerCase().includes(normalizedQuery);
          
          if (titleMatch) score += 10;
          if (descriptionMatch) score += 5;
          if (seoMatch) score += 3;
          
          return { ...product, score };
        }).sort((a, b) => b.score - a.score);

        const scoredCourses = courses.map((course) => {
          let score = 0;
          const titleMatch = course.title.toLowerCase().includes(normalizedQuery);
          const resumeMatch = course.courseResume?.toLowerCase().includes(normalizedQuery);
          const seoMatch = course.seoDescription?.toLowerCase().includes(normalizedQuery);
          
          if (titleMatch) score += 10;
          if (resumeMatch) score += 5;
          if (seoMatch) score += 3;
          
          // Boost popular courses
          if (course.rating > 4) score += 2;
          if (course.studentsNbr && course.studentsNbr > 100) score += 1;
          
          return { ...course, score };
        }).sort((a, b) => b.score - a.score);

        // Define searchable pages
        const searchablePages = [
          {
            name: "وسائل الدفع",
            path: "/settings/payments-methods",
            keywords: ["دفع", "payment", "مدفوعات", "بطاقة", "محفظة"],
          },
          {
            name: "تخصيص الأكاديمية",
            path: "/settings/website-settings/appearance",
            keywords: ["تخصيص", "appearance", "ألوان", "شعار", "تصميم"],
          },
          {
            name: "المبيعات",
            path: "/orders",
            keywords: ["مبيعات", "orders", "طلبات", "مشتريات"],
          },
          {
            name: "سياسة الأكاديمية",
            path: "/settings/website-settings/legal",
            keywords: ["سياسة", "legal", "قوانين", "شروط"],
          },
          {
            name: "الطلاب",
            path: "/students",
            keywords: ["طلاب", "students", "متعلمين"],
          },
          {
            name: "الشهادات",
            path: "/certificates",
            keywords: ["شهادات", "certificates", "إنجازات"],
          },
          {
            name: "الكوبونات",
            path: "/coupons",
            keywords: ["كوبونات", "coupons", "خصومات", "تخفيضات"],
          },
          {
            name: "الإحصائيات",
            path: "/analytics",
            keywords: ["إحصائيات", "analytics", "تقارير", "بيانات"],
          },
        ];

        // Filter pages based on search query
        const matchingPages = searchablePages.filter((page) => {
          const nameMatch = page.name.toLowerCase().includes(normalizedQuery);
          const keywordMatch = page.keywords.some((keyword) =>
            keyword.toLowerCase().includes(normalizedQuery)
          );
          return nameMatch || keywordMatch;
        });

        const data: ProductGroup = {
          pages: matchingPages,
          //@ts-expect-error this is a type error
          products: scoredProducts.slice(0, limit),
             //@ts-expect-error this is a type error
          courses: scoredCourses.slice(0, limit),
        };

        return data;
      } catch (error) {
        console.error("Search error:", error);
        throw new Error("Failed to perform search");
      }
    }),
};

// Additional helper functions for search optimization
export const searchHelpers = {
  // Function to highlight search terms in results
  highlightSearchTerms: (text: string, query: string): string => {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  },

  // Function to get search suggestions
  getSearchSuggestions: async (prisma: any, accountId: string, query: string) => {
    const suggestions = await prisma.$queryRaw`
      SELECT DISTINCT 
        title as suggestion,
        'product' as type
      FROM "Product" 
      WHERE "accountId" = ${accountId} 
        AND LOWER(title) LIKE ${`%${query.toLowerCase()}%`}
      
      UNION ALL
      
      SELECT DISTINCT 
        title as suggestion,
        'course' as type
      FROM "Course" 
      WHERE "accountId" = ${accountId} 
        AND LOWER(title) LIKE ${`%${query.toLowerCase()}%`}
      
      LIMIT 5
    `;
    
    return suggestions;
  },

  // Function to track search analytics
  trackSearchQuery: async (prisma: any, accountId: string, query: string, resultsCount: number) => {
    try {
      await prisma.searchAnalytics.create({
        data: {
          accountId,
          query,
          resultsCount,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to track search query:", error);
    }
  },
};