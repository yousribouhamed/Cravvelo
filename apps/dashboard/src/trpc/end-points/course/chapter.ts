import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { Module } from "@/src/types";
import type { Chapter } from "database";

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
        orderBy: [
          {
            orderNumber: "asc",
          },
        ],
      });

      return chapters;
    }),
  deleteChapter: privateProcedure
    .input(
      z.object({
        chapterId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deletedChapter = await ctx.prisma.chapter.delete({
        where: {
          id: input.chapterId,
        },
      });

      return deletedChapter;
    }),

  updateChapterTitle: privateProcedure
    .input(
      z.object({
        chapterId: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deletedChapter = await ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          title: input.title,
        },
      });

      return deletedChapter;
    }),

  toggleChapterVisibility: privateProcedure
    .input(
      z.object({
        chapterId: z.string(),
        visibility: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.chapter.update({
        where: {
          id: input.chapterId,
        },
        data: {
          isVisible: input.visibility,
        },
      });
    }),
  updateChapters: privateProcedure

    .input(
      z.object({
        courseID: z.string(),
        bulkUpdateData: z
          .object({
            id: z.string(),
            position: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bulkUpdateData = input.bulkUpdateData;

      // replace this with promise all later
      try {
        bulkUpdateData.map(async (item) => {
          await ctx.prisma.chapter.update({
            where: {
              id: item.id,
            },
            data: {
              orderNumber: item.position,
            },
          });
        });
      } catch (err) {
        console.error(
          "this error is comming from trpc router called update chapters"
        );
        console.error(err);
      }
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

  updateMaterial: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string(),
        content: z.any(),
        fileUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const targetChapter = await ctx.prisma.chapter.findFirst({
          where: {
            id: input.chapterID,
          },
        });

        const oldMaterials = JSON.parse(
          targetChapter.modules as string
        ) as Module[];

        // find the target
        const targetMaterial = oldMaterials.find(
          (item) => item.fileUrl === input.fileUrl
        );

        // create new material

        const newMaterial = {
          content: input.content,
          fileUrl: input.fileUrl,
          orderNumber: targetMaterial.orderNumber,
          fileType: targetMaterial.fileType,
          title: input.title,
        } as Module;

        const newMaterials = oldMaterials.filter(
          (item) => item.fileUrl === input.fileUrl
        );

        const newChapter = await ctx.prisma.chapter.update({
          where: {
            id: input.chapterID,
          },
          data: {
            modules: JSON.stringify([...newMaterials, newMaterial]),
          },
        });

        return newChapter;
      } catch (err) {
        console.error(err);
      }
    }),

  deleteMaterial: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        fileUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const targetChapter = await ctx.prisma.chapter.findFirst({
          where: {
            id: input.chapterID,
          },
        });

        const oldMaterials = JSON.parse(
          targetChapter.modules as string
        ) as Module[];

        const newMaterial = oldMaterials.filter(
          (item) => item.fileUrl === input.fileUrl
        );

        const newChapter = await ctx.prisma.chapter.update({
          where: {
            id: input.chapterID,
          },
          data: {
            modules: JSON.stringify(newMaterial),
          },
        });

        return newChapter;
      } catch (err) {
        console.error(err);
      }
    }),
};
