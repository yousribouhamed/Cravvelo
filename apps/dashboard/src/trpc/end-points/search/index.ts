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

        // Validate and normalize search query
        const validation = searchHelpers.validateSearchInput(query);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        const normalizedQuery = query.trim().toLowerCase();

        // Build base search conditions
        const baseConditions = {
          accountId: ctx.account.id,
        };

        // Build status filter using helper function
        const statusFilter = searchHelpers.buildSearchFilters(includeInactive);

        // Search products with optimized query and better error handling
        const products = await ctx.prisma.product
          .findMany({
            where: {
              ...baseConditions,
              ...statusFilter,
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
          })
          .catch((error) => {
            console.error("Product search error:", error);
            return []; // Return empty array on error instead of throwing
          });

        // Search courses with optimized query and better error handling
        const courses = await ctx.prisma.course
          .findMany({
            where: {
              ...baseConditions,
              ...statusFilter,
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
          })
          .catch((error) => {
            console.error("Course search error:", error);
            return []; // Return empty array on error instead of throwing
          });

        // Enhanced scoring and sorting with null checks
        const scoredProducts = products
          .map((product) => {
            let score = 0;
            const title = product.title?.toLowerCase() ?? "";
            const subDescription = product.subDescription?.toLowerCase() ?? "";
            const seoDescription = product.SeoDescription?.toLowerCase() ?? "";
            const seoTitle = product.SeoTitle?.toLowerCase() ?? "";

            // Exact title match gets highest score
            if (title === normalizedQuery) score += 20;
            else if (title.includes(normalizedQuery)) score += 10;
            else if (title.startsWith(normalizedQuery)) score += 8;

            if (subDescription.includes(normalizedQuery)) score += 5;
            if (seoDescription.includes(normalizedQuery)) score += 3;
            if (seoTitle.includes(normalizedQuery)) score += 8;

            // Boost newer products slightly
            const daysSinceUpdate = product.updatedAt
              ? Math.floor(
                  (Date.now() - new Date(product.updatedAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : Infinity;
            if (daysSinceUpdate < 30) score += 1;

            return { ...product, score };
          })
          .sort((a, b) => b.score - a.score);

        const scoredCourses = courses
          .map((course) => {
            let score = 0;
            const title = course.title?.toLowerCase() ?? "";
            const courseResume = course.courseResume?.toLowerCase() ?? "";
            const seoDescription = course.seoDescription?.toLowerCase() ?? "";
            const seoTitle = course.seoTitle?.toLowerCase() ?? "";

            // Exact title match gets highest score
            if (title === normalizedQuery) score += 20;
            else if (title.includes(normalizedQuery)) score += 10;
            else if (title.startsWith(normalizedQuery)) score += 8;

            if (courseResume.includes(normalizedQuery)) score += 5;
            if (seoDescription.includes(normalizedQuery)) score += 3;
            if (seoTitle.includes(normalizedQuery)) score += 8;

            // Boost popular and well-rated courses
            if (course.rating && course.rating > 4.5) score += 3;
            else if (course.rating && course.rating > 4) score += 2;

            if (course.studentsNbr && course.studentsNbr > 1000) score += 2;
            else if (course.studentsNbr && course.studentsNbr > 100) score += 1;

            return { ...course, score };
          })
          .sort((a, b) => b.score - a.score);

        // Enhanced searchable pages with better Arabic support
        const searchablePages = [
          {
            name: "وسائل الدفع",
            path: "/settings/payments-methods",
            keywords: [
              "دفع",
              "payment",
              "مدفوعات",
              "بطاقة",
              "محفظة",
              "وسائل",
              "بنك",
              "ماستركارد",
              "فيزا",
            ],
          },
          {
            name: "تخصيص الأكاديمية",
            path: "/settings/website-settings/appearance",
            keywords: [
              "تخصيص",
              "appearance",
              "ألوان",
              "شعار",
              "تصميم",
              "أكاديمية",
              "مظهر",
              "واجهة",
            ],
          },
          {
            name: "المبيعات",
            path: "/orders",
            keywords: ["مبيعات", "orders", "طلبات", "مشتريات", "أوردر", "طلب"],
          },
          {
            name: "سياسة الأكاديمية",
            path: "/settings/website-settings/legal",
            keywords: [
              "سياسة",
              "legal",
              "قوانين",
              "شروط",
              "أكاديمية",
              "خصوصية",
              "استخدام",
            ],
          },
          {
            name: "الطلاب",
            path: "/students",
            keywords: ["طلاب", "students", "متعلمين", "دارسين", "مستخدمين"],
          },
          {
            name: "الشهادات",
            path: "/certificates",
            keywords: ["شهادات", "certificates", "إنجازات", "تخرج", "اعتماد"],
          },
          {
            name: "الكوبونات",
            path: "/coupons",
            keywords: [
              "كوبونات",
              "coupons",
              "خصومات",
              "تخفيضات",
              "عروض",
              "كوبون",
            ],
          },
          {
            name: "الإحصائيات",
            path: "/analytics",
            keywords: [
              "إحصائيات",
              "analytics",
              "تقارير",
              "بيانات",
              "تحليل",
              "احصائيات",
            ],
          },
        ];

        // Enhanced page matching with fuzzy search support
        const matchingPages = searchablePages.filter((page) => {
          const nameMatch = page.name.toLowerCase().includes(normalizedQuery);
          const pathMatch = page.path.toLowerCase().includes(normalizedQuery);
          const keywordMatch = page.keywords.some((keyword) => {
            const lowerKeyword = keyword.toLowerCase();
            return (
              lowerKeyword.includes(normalizedQuery) ||
              normalizedQuery.includes(lowerKeyword) ||
              // Fuzzy matching for close matches
              (normalizedQuery.length > 2 &&
                lowerKeyword.length > 2 &&
                searchHelpers.calculateSimilarity(
                  lowerKeyword,
                  normalizedQuery
                ) > 0.7)
            );
          });
          return nameMatch || pathMatch || keywordMatch;
        });

        // Track search analytics (optional)
        await searchHelpers.trackSearchQuery(
          ctx.prisma,
          ctx.account.id,
          normalizedQuery,
          scoredProducts.length + scoredCourses.length + matchingPages.length
        );

        const data: ProductGroup = {
          pages: matchingPages,
          products: scoredProducts.slice(0, limit) as Product[],
          courses: scoredCourses.slice(0, limit) as Course[],
        };

        return data;
      } catch (error) {
        console.error("Search error:", error);
        // Return more specific error messages
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("فشل في تنفيذ البحث. يرجى المحاولة مرة أخرى.");
      }
    }),
};

// Enhanced helper functions
export const searchHelpers = {
  // Function to highlight search terms in results
  highlightSearchTerms: (text: string, query: string): string => {
    if (!text || !query) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  },

  // Enhanced search suggestions with better performance
  getSearchSuggestions: async (
    prisma: any,
    accountId: string,
    query: string
  ) => {
    try {
      if (!query || query.length < 2) return [];

      const escapedQuery = query.toLowerCase().replace(/'/g, "''");

      const suggestions = await prisma.$queryRaw`
        SELECT DISTINCT 
          title as suggestion,
          'product' as type,
          'product' as category
        FROM "Product" 
        WHERE "accountId" = ${accountId} 
          AND LOWER(title) LIKE ${`%${escapedQuery}%`}
          AND (status != 'INACTIVE' OR status IS NULL)
        
        UNION ALL
        
        SELECT DISTINCT 
          title as suggestion,
          'course' as type,
          'course' as category
        FROM "Course" 
        WHERE "accountId" = ${accountId} 
          AND LOWER(title) LIKE ${`%${escapedQuery}%`}
          AND (status != 'INACTIVE' OR status IS NULL)
        
        ORDER BY suggestion ASC
        LIMIT 8
      `;

      return suggestions;
    } catch (error) {
      console.error("Failed to get search suggestions:", error);
      return [];
    }
  },

  // Enhanced search analytics tracking
  trackSearchQuery: async (
    prisma: any,
    accountId: string,
    query: string,
    resultsCount: number
  ) => {
    try {
      await prisma.searchAnalytics.create({
        data: {
          accountId,
          query: query.substring(0, 100),
          resultsCount,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Silently fail - don't break search functionality
      console.warn("Search analytics tracking failed:", error.message);
    }
  },

  // Enhanced input validation
  validateSearchInput: (query: string): { valid: boolean; error?: string } => {
    if (!query || typeof query !== "string") {
      return { valid: false, error: "يجب أن يكون البحث نص غير فارغ" };
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return { valid: false, error: "لا يمكن أن يكون البحث فارغاً" };
    }

    if (trimmedQuery.length > 100) {
      return { valid: false, error: "البحث طويل جداً (الحد الأقصى 100 حرف)" };
    }

    // Check for potential SQL injection patterns
    const sqlInjectionPattern = /('|(\\')|(;)|(--|#)|(\*)|(%)|(\+))/i;
    if (sqlInjectionPattern.test(trimmedQuery)) {
      return { valid: false, error: "البحث يحتوي على أحرف غير مسموحة" };
    }

    return { valid: true };
  },

  // Enhanced filter building
  buildSearchFilters: (includeInactive: boolean) => {
    return includeInactive
      ? {}
      : {
          OR: [
            { status: { not: "INACTIVE" } },
            { status: null },
            { status: "ACTIVE" },
            { status: "PUBLISHED" },
            { status: "DRAFT" }, // Include drafts in search
          ],
        };
  },

  // New: Calculate string similarity for fuzzy matching
  calculateSimilarity: (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const levenshteinDistance = searchHelpers.getLevenshteinDistance(
      longer,
      shorter
    );
    return (longer.length - levenshteinDistance) / longer.length;
  },

  // New: Levenshtein distance calculation for fuzzy search
  getLevenshteinDistance: (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  },
};
