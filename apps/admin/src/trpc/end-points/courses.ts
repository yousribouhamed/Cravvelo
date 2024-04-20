import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";

export const course = {
  getAllCourses: privateProcedure.query(async ({ input, ctx }) => {
    const courses = await ctx.prisma.course.findMany();
    return courses;
  }),

  suspandCourse: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = ctx.prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          suspended: true,
        },
      });

      return course;
    }),

  deleteCourse: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const courses = await ctx.prisma.course.delete({
        where: {
          id: input.id,
        },
      });
      return courses;
    }),
};
