import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import {
  deleteFileFromS3Bucket,
  getKeyFromUrl,
  getS3ObjectSize,
} from "../../aws/s3";

export const course = {
  createCourse: privateProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      try {
        const createdCourse = await ctx.prisma.course.create({
          data: {
            status: "DRAFT",
            title: input.title,
            accountId: ctx.account.id,
          },
        });

        return {
          success: true,
          courseId: createdCourse.id,
          planExceeded: false,
        };
      } catch (err) {
        console.error("createCourse failed:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            err instanceof Error
              ? err.message
              : "Failed to create course. Please try again.",
        });
      }
    }),

  getAllCourses: privateProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.array(z.string()).optional(),
        level: z.array(z.string()).optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      const whereClause: any = {
        accountId: ctx.account.id,
      };

      // Add search filter
      if (input?.search && input.search.trim().length > 0) {
        whereClause.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { seoTitle: { contains: input.search, mode: "insensitive" } },
        ];
      }

      // Add status filter
      if (input?.status && input.status.length > 0) {
        // Normalize PUBLISHED to PUBLISED (handle typo in database)
        const normalizedStatus = input.status.map(s => s === "PUBLISHED" ? "PUBLISED" : s);
        whereClause.status = { in: normalizedStatus };
      }

      // Add level filter
      if (input?.level && input.level.length > 0) {
        whereClause.level = { in: input.level };
      }

      const courses = await ctx.prisma.course.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });

      return courses;
    }),
  priceCourse: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
        pricingType: z.enum(["FREE", "ONE_TIME", "RECURRING"]),
        price: z.number().optional(),
        compareAtPrice: z.number().optional(),
        accessDuration: z.enum(["LIMITED", "UNLIMITED"]).optional(),
        accessDurationDays: z.number().optional(),
        recurringDays: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // 1. Check if the course already has a pricing plan
          const existingCoursePricing = await tx.coursePricingPlan.findFirst({
            where: {
              courseId: input.courseId,
            },
            include: {
              PricingPlan: true,
            },
          });

          let pricingPlan;

          if (existingCoursePricing) {
            // Update existing pricing plan
            pricingPlan = await tx.pricing.update({
              where: {
                id: existingCoursePricing.pricingPlanId,
              },
              data: {
                name: `${
                  input.pricingType === "FREE"
                    ? "Free Access"
                    : input.pricingType === "ONE_TIME"
                    ? "One-time Purchase"
                    : "Recurring Subscription"
                }`,
                pricingType: input.pricingType,
                price: input.pricingType === "FREE" ? 0 : input.price,
                accessDuration:
                  input.pricingType === "ONE_TIME"
                    ? input.accessDuration
                    : null,
                accessDurationDays:
                  input.pricingType === "ONE_TIME" &&
                  input.accessDuration === "LIMITED"
                    ? input.accessDurationDays
                    : null,
                // Changed from recurringInterval
                recurringDays:
                  input.pricingType === "RECURRING"
                    ? input.recurringDays
                    : null,
              },
            });
          } else {
            // Create new pricing plan
            pricingPlan = await tx.pricing.create({
              data: {
                accountId: ctx.account.id,
                name: `${
                  input.pricingType === "FREE"
                    ? "Free Access"
                    : input.pricingType === "ONE_TIME"
                    ? "One-time Purchase"
                    : "Recurring Subscription"
                }`,
                description: `Pricing plan for course access`,
                pricingType: input.pricingType,
                price: input.pricingType === "FREE" ? 0 : input.price,
                accessDuration:
                  input.pricingType === "ONE_TIME"
                    ? input.accessDuration
                    : null,
                accessDurationDays:
                  input.pricingType === "ONE_TIME" &&
                  input.accessDuration === "LIMITED"
                    ? input.accessDurationDays
                    : null,
                // Changed from recurringInterval
                recurringDays:
                  input.pricingType === "RECURRING"
                    ? input.recurringDays
                    : null,
                isActive: true,
                isDefault: true,
              },
            });

            // Create the junction table entry linking course to pricing plan
            await tx.coursePricingPlan.create({
              data: {
                courseId: input.courseId,
                pricingPlanId: pricingPlan.id,
                isDefault: true,
              },
            });
          }

          const updatedCourse = await tx.course.update({
            where: {
              id: input.courseId,
            },
            data: {
              price: input.pricingType === "FREE" ? 0 : input.price,
              compareAtPrice:
                input.pricingType === "FREE" ? 0 : input.compareAtPrice,
            },
          });

          return {
            course: updatedCourse,
            pricingPlan: pricingPlan,
            isUpdate: !!existingCoursePricing,
          };
        });

        return result;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err?.message
            ? err?.message
            : "Error occurred while updating course pricing",
        });
      }
    }),
  updateCourseSettings: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
        courseResume: z.string(),
        courseDescription: z.any(),
        courseUrl: z.string(),
        seoDescription: z.string(),
        seoTitle: z.string(),
        thumnailUrl: z.string(),
        title: z.string(),
        youtubeUrl: z.string().optional(),
        level: z.string(),
        preview_video: z.string().optional(),
        courseWhatYouWillLearn: z.string().optional(),
        courseRequirements: z.string().optional(),
        sound: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.course
        .update({
          where: {
            id: input.courseId,
          },
          data: {
            courseDescription: JSON.stringify(input.courseDescription),
            courseResume: input?.courseResume,
            courseUrl: input?.courseUrl,
            seoDescription: input?.seoDescription,
            seoTitle: input?.seoTitle,
            thumbnailUrl: input?.thumnailUrl,
            title: input?.title,
            youtubeUrl: input?.youtubeUrl ?? null,
            level: input?.level,
            preview_video: input?.preview_video ?? null,
            courseWhatYouWillLearn: input?.courseWhatYouWillLearn ?? null,
            courseRequirements: input?.courseRequirements ?? null,
            sound: input.sound ?? null,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err?.message
              ? err?.message
              : "the error in on update course settings",
          });
        });

      return { success: true, courseId: course.id };
    }),

  launchCourse: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.course
        .update({
          where: {
            id: input.courseId,
          },
          data: {
            status: input.status,
            
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err?.message
              ? err?.message
              : "the error in on update course settings",
          });
        });

      return { success: true, courseId: course.id };
    }),

  deleteCourse: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const course = await ctx.prisma.course.findUnique({
          where: {
            id: input.courseId,
          },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }

        // Delete thumbnail from S3 if it exists
        if (course.thumbnailUrl) {
          try {
            const key = getKeyFromUrl(course.thumbnailUrl);
            const size = await getS3ObjectSize(key);
            await deleteFileFromS3Bucket({ fileName: key });
            if (size > 0) {
              const acc = await ctx.prisma.account.findUnique({
                where: { id: ctx.account.id },
                select: { storageUsedBytes: true },
              });
              if (acc) {
                const next = Math.max(0, acc.storageUsedBytes - size);
                await ctx.prisma.account.update({
                  where: { id: ctx.account.id },
                  data: { storageUsedBytes: next },
                });
              }
            }
          } catch (s3Error) {
            console.error("Error deleting thumbnail from S3:", s3Error);
            // Continue with course deletion even if S3 deletion fails
          }
        }

        // Delete the course
        await ctx.prisma.course.delete({
          where: {
            id: input.courseId,
          },
        });

        return { success: true };
      } catch (err) {
        console.error("Error deleting course:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Failed to delete course",
        });
      }
    }),

  updateCourseStudentEngagment: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
        allowComment: z.boolean(),
        certificate: z.boolean(),
        forceWatchAllCourse: z.boolean(),
        allowRating: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const course = await ctx.prisma.course.update({
          where: {
            id: input.courseId,
          },
          data: {
            allowComment: input.allowComment,
            certificate: input.certificate,
            allowRating: input.allowRating,
            forceWatchAllCourse: input.forceWatchAllCourse,
          },
        });

        return course;
      } catch (err) {
        console.error(err);
      }
    }),
};
