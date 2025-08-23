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
              isDefault: "desc", // Show default pricing plans first
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

      console.log(websites);

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
          accountId, // Add accountId for security
        },
        include: {
          CoursePricingPlans: {
            include: {
              PricingPlan: true,
            },
            orderBy: {
              isDefault: "desc", // Show default pricing plans first
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
            take: 10, // Limit comments for performance
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

// Helper function to get courses with their default pricing only
export const getCoursesWithDefaultPricing = withTenant({
  handler: async ({ db, accountId }) => {
    try {
      const courses = await db.course.findMany({
        where: {
          accountId,
          status: "PUBLISHED", // Only get published courses
        },
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
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: courses as CourseWithDefaultPricing[],
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
