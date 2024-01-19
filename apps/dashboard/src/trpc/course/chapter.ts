import { z } from "zod";
import { privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Module } from "@/src/types";

export const chapter = {
  createChapter: privateProcedure
    .input(
      z.object({
        title: z.string(),
        courseId: z.string(),
        orderNumber: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const course = await ctx.prisma.chapter
        .create({
          data: {
            title: input.title,
            courseID: input.courseId,
            orderNumber: input.orderNumber,
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

  createModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string(),
        content: z.any(),

        fileUrl: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // first we need to get all the modules
      const chapter = await ctx.prisma.chapter.findFirst({
        where: { id: input.chapterID },
      });
      const modules = chapter?.modules
        ? (JSON.parse(chapter?.modules as string) as Module[])
        : ([] as Module[]);

      // second we need to update the array

      const newModules = [
        ...modules,
        {
          content: input.content,

          fileType: input.fileType,
          fileUrl: input.fileUrl,
          orderNumber: modules.length + 1,
          title: input.title,
        },
      ];

      // then store it back in the database
      const course = await ctx.prisma.chapter
        .update({
          data: {
            modules: JSON.stringify(newModules),
          },
          where: {
            id: input.chapterID,
          },
        })
        .catch((err) => {
          console.error(err);
          throw new TRPCError({ code: "NOT_FOUND" });
        });

      return { success: true, courseId: course.id };
    }),
};
