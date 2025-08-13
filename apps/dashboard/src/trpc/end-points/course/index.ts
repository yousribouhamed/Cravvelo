import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { deleteFileFromS3Bucket, getKeyFromUrl } from "../../aws/s3";

export const course = {
  createCourse: privateProcedure
    .input(
      z.object({
        title: z.string(),
        accountId: z.string(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      try {
        console.log("this is the account id : ");
        console.log(ctx.account.id);
        const courses = await ctx.prisma.course.findMany({
          where: {
            accountId: ctx.account.id,
          },
        });

        const limits =
          ctx.account.plan === "BASIC" || ctx.account.plan === null
            ? 1
            : ctx.account.plan === "ADVANCED"
            ? 2
            : 9999;

        if (courses.length >= limits) {
          return { success: false, courseId: undefined, planExceeded: true };
        }

        const course = await ctx.prisma.course
          .create({
            data: {
              status: "DRAFT",
              title: input.title,
              accountId: ctx.account.id,
            },
          })
          .catch((err) => {
            console.log(err);
            throw new TRPCError({ code: "NOT_FOUND" });
          });

        return { success: true, courseId: course.id, planExceeded: false };
      } catch (error) {
        return { success: false, courseId: undefined, error };
      }
    }),

  getAllCourses: privateProcedure.query(async ({ input, ctx }) => {
    const courses = await ctx.prisma.course.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return courses;
  }),
  priceCourse: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
        price: z.number(),
        compairAtPrice: z.number(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.course
        .update({
          where: {
            id: input.courseId,
          },
          data: {
            price: input.price,
            compareAtPrice: input.compairAtPrice,
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

      return course;
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
        const course = await ctx.prisma.course.delete({
          where: {
            id: input.courseId,
          },
        });

        await deleteFileFromS3Bucket({
          fileName: getKeyFromUrl(course.thumbnailUrl),
        });

        return course;
      } catch (err) {
        console.error(err);
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
