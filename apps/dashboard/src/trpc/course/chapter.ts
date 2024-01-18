import { z } from "zod";
import { privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const chapter = {
  createChapter: privateProcedure
    .input(
      z.object({
        title: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.chapter
        .create({
          data: {
            title: input.title,
            courseID: input.courseId,
          },
        })
        .catch((err) => {
          console.log(err);
          throw new TRPCError({ code: "NOT_FOUND" });
        });

      return { success: true, courseId: course.id };
    }),

  getChapters: privateProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const chapters = await ctx.prisma.chapter.findMany({
        where: {
          courseID: input.courseId,
        },
      });

      return chapters;
    }),
};
