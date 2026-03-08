"use server";

import { withTenant } from "@/_internals/with-tenant";
import z from "zod";
import {
  CourseWithPricing,
  CourseWithDefaultPricing,
  CoursePricingPlan,
} from "../types";

export const getAllCourses = withTenant({
  handler: async ({ db, accountId }) => {
    try {
      const courses = await db.course.findMany({
        where: {
          accountId,
        },
        include: {
          CoursePricingPlans: {
            include: {
              PricingPlan: true,
            },
            orderBy: {
              isDefault: "desc", 
            },
          },
          _count: {
            select: {
              Sale: true,
              Comment: true,
            },
          },
        },
      });

      const websites = await db.website.findMany();


      console.log(courses)

     

      return {
        data: courses as CourseWithPricing[],
        success: true,
        message: "we got all the courses",
      };
    } catch (error) {
      console.log(`courses get error : `, error);

      return {
        data: null,
        success: false,
        message: error as string,
      };
    }
  },
});

export const getCourseById = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const course = await db.course.findFirst({
        where: {
          id: input.courseId,
          accountId, 
        },
        include: {
          CoursePricingPlans: {
            include: {
              PricingPlan: true,
            },
            orderBy: {
              isDefault: "desc", 
            },
          },
          Chapter: {
            orderBy: {
              orderNumber: "asc",
            },
          },
          Comment: {
            where: {
              isApproved: true,
              isPublic: true,
            },
            include: {
              Student: {
                select: {
                  full_name: true,
                  photo_url: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10, 
          },
          _count: {
            select: {
              Sale: true,
              Comment: {
                where: {
                  isApproved: true,
                },
              },
            },
          },
        },
      });

      if (!course) {
        return {
          data: null,
          success: false,
          message: "Course not found",
        };
      }

      return {
        data: course as unknown as CourseWithPricing,
        success: true,
        message: "success",
      };
    } catch (error) {
      console.log(`course get error : `, error);

      return {
        data: null,
        success: false,
        message: error as string,
      };
    }
  },
});

// Additional helper function to get only active pricing plans for a course
export const getCoursePricingPlans = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const pricingPlans = await db.coursePricingPlan.findMany({
        where: {
          courseId: input.courseId,
          Course: {
            accountId, // Ensure the course belongs to the account
          },
          PricingPlan: {
            isActive: true,
          },
        },
        include: {
          PricingPlan: true,
        },
        orderBy: [
          { isDefault: "desc" },
          { PricingPlan: { price: "asc" } }, // Order by price ascending
        ],
      });

      return {
        data: pricingPlans as CoursePricingPlan[],
        success: true,
        message: "Pricing plans retrieved successfully",
      };
    } catch (error) {
      console.log(`pricing plans get error : `, error);

      return {
        data: null,
        success: false,
        message: error as string,
      };
    }
  },
});

const courseListInputSchema = z
  .object({
    search: z.string().optional(),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
    sort: z
      .enum(["newest", "price_asc", "price_desc", "rating", "students"])
      .optional(),
  })
  .optional();

// Helper function to get courses with their default pricing only
export const getCoursesWithDefaultPricing = withTenant({
  input: courseListInputSchema,
  handler: async ({ db, accountId, input }) => {
    try {
      const where: {
        accountId: string;
        status: string;
        title?: { contains: string; mode: "insensitive" };
        level?: string;
      } = {
        accountId,
        status: "PUBLISHED",
      };
      if (input?.search?.trim()) {
        where.title = {
          contains: input.search.trim(),
          mode: "insensitive",
        };
      }
      if (input?.level) {
        where.level = input.level;
      }

      const sort = input?.sort ?? "newest";
      const orderBy =
        sort === "newest"
          ? { createdAt: "desc" as const }
          : sort === "rating"
            ? { rating: "desc" as const }
            : sort === "students"
              ? { Sale: { _count: "desc" as const } }
              : { createdAt: "desc" as const };

      const courses = await db.course.findMany({
        where,
        include: {
          CoursePricingPlans: {
            where: {
              isDefault: true,
            },
            include: {
              PricingPlan: {
                select: {
                  id: true,
                  name: true,
                  pricingType: true,
                  price: true,
                  compareAtPrice: true,
                  currency: true,
                  accessDuration: true,
                  accessDurationDays: true,
                  recurringDays: true,
                },
              },
            },
          },
          _count: {
            select: {
              Sale: true,
            },
          },
        },
        orderBy,
      });

      let result = courses as CourseWithDefaultPricing[];
      if (sort === "price_asc" || sort === "price_desc") {
        const dir = sort === "price_asc" ? 1 : -1;
        result = [...result].sort((a, b) => {
          const priceA =
            a.CoursePricingPlans?.[0]?.PricingPlan?.price ?? Infinity;
          const priceB =
            b.CoursePricingPlans?.[0]?.PricingPlan?.price ?? Infinity;
          return (priceA - priceB) * dir;
        });
      }

      return {
        data: result,
        success: true,
        message: "Courses with default pricing retrieved successfully",
      };
    } catch (error) {
      console.log(`courses with default pricing get error : `, error);

      return {
        data: null,
        success: false,
        message: error as string,
      };
    }
  },
});
