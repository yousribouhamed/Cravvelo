import { z } from "zod";
import { privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";

export const course = {
  createCourse: privateProcedure
    .input(
      z.object({
        title: z.string(),
        academiaId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.course
        .create({
          data: {
            status: "DRAFT",
            title: input.title,
            academiaId: input.academiaId,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({ code: "NOT_FOUND" });
        });

      return { success: true, courseId: course.id };
    }),

  getAllCourses: privateProcedure.query(async ({ input, ctx }) => {
    const courses = await ctx.prisma.course.findMany();

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
            compairAtPrice: input.compairAtPrice,
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
        youtubeUrl: z.string(),
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
            courseResume: input.courseResume,
            courseUrl: input.courseUrl,
            seoDescription: input.seoDescription,
            seoTitle: input.seoTitle,
            thumnailUrl: input.thumnailUrl,
            title: input.title,
            youtubeUrl: input.youtubeUrl,
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
};
