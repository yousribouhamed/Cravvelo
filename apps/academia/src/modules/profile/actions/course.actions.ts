"use server";

import { withTenant } from "@/_internals/with-tenant";
import z from "zod";
import { Course } from "@/modules/courses/types";

export const getCourseWithChapters = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const course = await db.course.findFirst({
        where: {
          id: input.courseId,
          accountId, // Ensure the course belongs to the current account
        },
        include: {
          Chapter: {
            orderBy: {
              orderNumber: "asc", // Order chapters by their order number
            },
          },
        },
      });

      if (!course) {
        return {
          data: null,
          success: false,
          message: "Course not found or you don't have permission to access it",
        };
      }

      return {
        data: course as Course & { Chapter: any[] },
        success: true,
        message: "Course with chapters retrieved successfully",
      };
    } catch (error) {
      console.log(`course with chapters get error: `, error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  },
});

// Alternative version that gets course with chapters and additional related data
export const getCourseWithFullDetails = withTenant({
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
          Chapter: {
            orderBy: {
              orderNumber: "asc",
            },
          },
          Account: {
            select: {
              user_name: true,
              avatarUrl: true,
            },
          },
          Comment: {
            where: {
              isApproved: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5, // Get latest 5 approved comments
            include: {
              Student: {
                select: {
                  full_name: true,
                  photo_url: true,
                },
              },
            },
          },
          Sale: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!course) {
        return {
          data: null,
          success: false,
          message: "Course not found or you don't have permission to access it",
        };
      }

      return {
        data: course,
        success: true,
        message: "Course with full details retrieved successfully",
      };
    } catch (error) {
      console.log(`course with full details get error: `, error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  },
});

// Version for public access (for students viewing courses)
export const getPublicCourseWithChapters = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const course = await db.course.findFirst({
        where: {
          id: input.courseId,
          accountId,
          status: "PUBLISHED", // Only get published courses
          suspended: false,
        },
        select: {
          id: true,
          title: true,
          courseDescription: true,
          thumbnailUrl: true,
          price: true,
          compareAtPrice: true,
          rating: true,
          studentsNbr: true,
          length: true,
          nbrChapters: true,
          level: true,
          sound: true,
          certificate: true,
          courseRequirements: true,
          courseWhatYouWillLearn: true,
          preview_video: true,
          createdAt: true,
          Chapter: {
            where: {
              isVisible: true,
            },
            select: {
              id: true,
              title: true,
              orderNumber: true,
              duration: true,
            },
            orderBy: {
              orderNumber: "asc",
            },
          },
          Account: {
            select: {
              user_name: true,
              avatarUrl: true,
            },
          },
        },
      });

      if (!course) {
        return {
          data: null,
          success: false,
          message: "Course not found or not available",
        };
      }

      return {
        data: course,
        success: true,
        message: "Public course details retrieved successfully",
      };
    } catch (error) {
      console.log(`public course get error: `, error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  },
});
