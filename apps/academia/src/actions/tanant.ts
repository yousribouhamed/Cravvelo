"use server";

import { prisma } from "database/src";
import { cache } from "react";

// Cache the database queries for better performance
export const getTenantWebsite = cache(async (tenant: string) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        OR: [{ subdomain: tenant }, { customDomain: tenant }],
      },
      include: {
        Account: {
          select: {
            id: true,
            user_name: true,
            user_bio: true,
            avatarUrl: true,
            verified: true,
            plan: true,
            firstName: true,
            lastName: true,
            profession: true,
            company: true,
            preferredLanguage: true,
            profileVisibility: true,
          },
        },
      },
    });

    return website;
  } catch (error) {
    console.error("Error fetching tenant website:", error);
    return null;
  }
});

export const getTenantCourses = cache(
  async (tenant: string, limit?: number) => {
    try {
      const website = await getTenantWebsite(tenant);
      if (!website) return [];

      const courses = await prisma.course.findMany({
        where: {
          accountId: website.accountId,
          status: "PUBLISHED", // Assuming you only want published courses
          suspended: false,
        },
        select: {
          id: true,
          title: true,
          courseUrl: true,
          thumbnailUrl: true,
          courseDescription: true,
          seoTitle: true,
          seoDescription: true,
          price: true,
          compareAtPrice: true,
          studentsNbr: true,
          rating: true,
          length: true,
          nbrChapters: true,
          level: true,
          sound: true,
          certificate: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      return courses;
    } catch (error) {
      console.error("Error fetching tenant courses:", error);
      return [];
    }
  }
);

export const getTenantProducts = cache(
  async (tenant: string, limit?: number) => {
    try {
      const website = await getTenantWebsite(tenant);
      if (!website) return [];

      const products = await prisma.product.findMany({
        where: {
          accountId: website.accountId,
          status: "PUBLISHED", // Assuming you only want published products
          isVisible: true,
        },
        select: {
          id: true,
          title: true,
          price: true,
          compareAtPrice: true,
          numberOfDownloads: true,
          subDescription: true,
          SeoTitle: true,
          SeoDescription: true,
          thumbnailUrl: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      return products;
    } catch (error) {
      console.error("Error fetching tenant products:", error);
      return [];
    }
  }
);

export const getTenantStats = cache(async (tenant: string) => {
  try {
    const website = await getTenantWebsite(tenant);
    if (!website) return null;

    const [
      totalCourses,
      totalProducts,
      totalStudents,
      totalSales,
      recentComments,
    ] = await Promise.all([
      prisma.course.count({
        where: {
          accountId: website.accountId,
          status: "PUBLISHED",
          suspended: false,
        },
      }),
      prisma.product.count({
        where: {
          accountId: website.accountId,
          status: "PUBLISHED",
          isVisible: true,
        },
      }),
      prisma.student.count({
        where: {
          accountId: website.accountId,
        },
      }),
      prisma.sale.count({
        where: {
          accountId: website.accountId,
          status: "COMPLETED",
        },
      }),
      prisma.comment.findMany({
        where: {
          accountId: website.accountId,
          status: "APPROVED", // Assuming approved comments
        },
        select: {
          id: true,
          content: true,
          rating: true,

          createdAt: true,
          Course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    return {
      totalCourses,
      totalProducts,
      totalStudents,
      totalSales,
      recentComments,
    };
  } catch (error) {
    console.error("Error fetching tenant stats:", error);
    return null;
  }
});

export const getTenantCourse = cache(
  async (tenant: string, courseId: string) => {
    try {
      const website = await getTenantWebsite(tenant);
      if (!website) return null;

      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          accountId: website.accountId,
          status: "PUBLISHED",
          suspended: false,
        },
        include: {
          Chapter: {
            where: {
              isVisible: true,
            },
            orderBy: {
              orderNumber: "asc",
            },
          },
          Comment: {
            where: {
              status: "APPROVED",
            },
            select: {
              id: true,
              content: true,
              rating: true,

              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      });

      return course;
    } catch (error) {
      console.error("Error fetching tenant course:", error);
      return null;
    }
  }
);

export const getTenantProduct = cache(
  async (tenant: string, productId: string) => {
    try {
      const website = await getTenantWebsite(tenant);
      if (!website) return null;

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          accountId: website.accountId,
          status: "PUBLISHED",
          isVisible: true,
        },
      });

      return product;
    } catch (error) {
      console.error("Error fetching tenant product:", error);
      return null;
    }
  }
);

export const getTenantCertificates = cache(
  async (tenant: string, studentId?: string) => {
    try {
      const website = await getTenantWebsite(tenant);
      if (!website) return [];

      const certificates = await prisma.certificate.findMany({
        where: {
          accountId: website.accountId,
          ...(studentId && { studentId }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          courseName: true,
          studentName: true,
          fileUrl: true,
          createdAt: true,
          Student: {
            select: {
              id: true,
              full_name: true,
              email: true,
              photo_url: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return certificates;
    } catch (error) {
      console.error("Error fetching tenant certificates:", error);
      return [];
    }
  }
);

// Helper function to check if tenant exists and is active
export const validateTenant = cache(async (tenant: string) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        OR: [{ subdomain: tenant }, { customDomain: tenant }],
        suspended: false,
      },
      select: {
        id: true,
        accountId: true,
        name: true,
        suspended: true,
        Account: {
          select: {
            id: true,
            verified: true,
          },
        },
      },
    });

    const website2 = await prisma.website.findFirst({
      where: {
        subdomain: tenant,
      },
      select: {
        id: true,
        accountId: true,
        name: true,
        suspended: true,
        Account: {
          select: {
            id: true,
            verified: true,
          },
        },
      },
    });

    console.log(website2);
    console.log(website);

    return {
      isValid: !!website && !website.suspended,
      website,
    };
  } catch (error) {
    console.error("Error validating tenant:", error);
    return {
      isValid: false,
      website: null,
    };
  }
});

// Get active coupons for the tenant
export const getTenantActiveCoupons = cache(async (tenant: string) => {
  try {
    const website = await getTenantWebsite(tenant);
    if (!website) return [];

    const coupons = await prisma.coupon.findMany({
      where: {
        accountId: website.accountId,
        isActive: true,
        isArchive: false,
        expirationDate: {
          gte: new Date(),
        },
        OR: [
          { usageLimit: null },
          {
            usageLimit: {
              gt: prisma.coupon.fields.usageCount,
            },
          },
        ],
      },
      select: {
        id: true,
        code: true,
        description: true,
        discountType: true,
        discountAmount: true,
        expirationDate: true,
        usageLimit: true,
        usageCount: true,
      },
    });

    return coupons;
  } catch (error) {
    console.error("Error fetching tenant coupons:", error);
    return [];
  }
});

// Type definitions for better TypeScript support
export type TenantWebsite = Awaited<ReturnType<typeof getTenantWebsite>>;
export type TenantCourse = Awaited<ReturnType<typeof getTenantCourse>>;
export type TenantProduct = Awaited<ReturnType<typeof getTenantProduct>>;
export type TenantStats = Awaited<ReturnType<typeof getTenantStats>>;
