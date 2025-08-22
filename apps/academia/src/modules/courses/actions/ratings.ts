"use server";

import { withTenant } from "@/_internals/with-tenant";
import z from "zod";
import { getTimeAgo } from "../uttils";

export const getCourseRatings = withTenant({
  input: z.object({
    courseId: z.string(),

    isApproved: z.boolean().optional().default(true),
    limit: z.number().min(1).max(100).optional().default(50),
    offset: z.number().min(0).optional().default(0),
    sortBy: z
      .enum(["newest", "oldest", "highest_rating", "lowest_rating"])
      .optional()
      .default("newest"),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      // Build the where clause
      const whereClause = {
        courseId: input.courseId,
        accountId,
        ...(input.isApproved !== undefined && { isApproved: input.isApproved }),
        isPublic: true, // Only show public comments
      };

      // Build the orderBy clause based on sortBy
      let orderBy = {};
      switch (input.sortBy) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "highest_rating":
          orderBy = { rating: "desc" };
          break;
        case "lowest_rating":
          orderBy = { rating: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }

      // Get ratings with student information
      const ratings = await db.comment.findMany({
        where: whereClause,
        select: {
          id: true,
          content: true,
          rating: true,

          createdAt: true,
          updatedAt: true,
          status: true,
          isApproved: true,
          // Include student details from the Student relation
          Student: {
            select: {
              id: true,
              full_name: true,
              photo_url: true,
              bio: true,
            },
          },
        },
        orderBy: orderBy as any,
        take: input.limit,
        skip: input.offset,
      });

      // Get total count for pagination
      const totalCount = await db.comment.count({
        where: whereClause,
      });

      // Calculate rating statistics
      const ratingStats = await db.comment.aggregate({
        where: {
          courseId: input.courseId,
          accountId,
          isApproved: true,
          isPublic: true,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
        _max: {
          rating: true,
        },
        _min: {
          rating: true,
        },
      });

      // Get rating distribution (count for each rating 1-5)
      const ratingDistribution = await db.comment.groupBy({
        by: ["rating"],
        where: {
          courseId: input.courseId,
          accountId,
          isApproved: true,
          isPublic: true,
        },
        _count: {
          rating: true,
        },
        orderBy: {
          rating: "desc",
        },
      });

      // Transform the data to include helpful information
      const transformedRatings = ratings.map((rating) => ({
        id: rating.id,
        content: rating.content,
        rating: rating.rating,

        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
        status: rating.status,
        isApproved: rating.isApproved,
        // Calculate time ago helper
        timeAgo: getTimeAgo(rating.createdAt),
        // Format rating as stars
        starRating:
          "★".repeat(Math.floor(rating.rating)) +
          "☆".repeat(5 - Math.floor(rating.rating)),
      }));

      return {
        data: {
          ratings: transformedRatings,
          pagination: {
            total: totalCount,
            limit: input.limit,
            offset: input.offset,
            //@ts-expect-error error
            hasMore: input?.offset + input?.limit < totalCount,
            //@ts-expect-error error
            totalPages: Math.ceil(totalCount / input?.limit),
            //@ts-expect-error error
            currentPage: Math.floor(input?.offset / input?.limit) + 1,
          },
          statistics: {
            averageRating: ratingStats._avg.rating || 0,
            totalRatings: ratingStats._count.rating || 0,
            highestRating: ratingStats._max.rating || 0,
            lowestRating: ratingStats._min.rating || 0,
            distribution: ratingDistribution.map((item) => ({
              rating: item.rating,
              count: item._count.rating,
              percentage:
                totalCount > 0 ? (item._count.rating / totalCount) * 100 : 0,
            })),
          },
        },
        success: true,
        message: "تم استرداد تقييمات الدورة بنجاح",
      };
    } catch (error) {
      console.log(`خطأ في استرداد تقييمات الدورة: `, error);

      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : "حدث خطأ غير معروف",
      };
    }
  },
});

export const getCourseRatingSummary = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const summary = await db.comment.aggregate({
        where: {
          courseId: input.courseId,
          accountId,
          isApproved: true,
          isPublic: true,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      const ratingDistribution = await db.comment.groupBy({
        by: ["rating"],
        where: {
          courseId: input.courseId,
          accountId,
          isApproved: true,
          isPublic: true,
        },
        _count: {
          rating: true,
        },
        orderBy: {
          rating: "desc",
        },
      });

      return {
        data: {
          averageRating: summary._avg.rating || 0,
          totalRatings: summary._count.rating || 0,
          distribution: ratingDistribution.map((item) => ({
            rating: item.rating,
            count: item._count.rating,
            percentage:
              summary._count.rating > 0
                ? (item._count.rating / summary._count.rating) * 100
                : 0,
          })),
        },
        success: true,
        message: "تم استرداد ملخص التقييمات بنجاح",
      };
    } catch (error) {
      console.log(`خطأ في استرداد ملخص التقييمات: `, error);

      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : "حدث خطأ غير معروف",
      };
    }
  },
});
