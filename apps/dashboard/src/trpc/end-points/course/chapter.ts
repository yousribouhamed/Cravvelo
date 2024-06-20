import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { Module } from "@/src/types";
import type { Chapter } from "database";
import axios from "axios";
import { prisma } from "database/src";

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

  updateModulesOrders: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        modules: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await prisma.chapter.update({
          where: {
            id: input.chapterID,
          },
          data: {
            modules: JSON.stringify(input.modules),
          },
        });
      } catch (err) {
        console.error(err);
      }
    }),

  createModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string(),
        content: z.any(),
        length: z.number(),
        fileUrl: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data } = await axios.get(
        `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos/${input.fileUrl}`,
        {
          headers: {
            "Content-Type": "application/octet-stream",
            AccessKey: process.env["NEXT_PUBLIC_BUNNY_API_KEY"],
          },
        }
      );
      console.log("this is the file url");
      console.log(input.fileUrl);

      console.log("this is the data we get from bunny");
      console.log(data);

      console.log("this is the input we are passing");
      console.log({
        chapterID: input.chapterID,
        title: input.title,
        content: input.content,
        length: input.length,
      });

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
          length: data?.length,
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

      const courseOldData = await ctx.prisma.course.findFirst({
        where: {
          id: chapter.courseID,
        },
      });

      await ctx.prisma.course.update({
        where: {
          id: chapter.courseID,
        },
        data: {
          length: data?.length + courseOldData.length,
          nbrChapters: 1 + courseOldData.nbrChapters,
        },
      });

      return { success: true, courseId: course.id };
    }),

  updateMaterial: privateProcedure
    .input(
      z.object({
        oldFileUrl: z.string(),
        chapterID: z.string(),
        title: z.string(),
        content: z.any(),
        fileUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { data } = await axios.get(
          `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos/${input.fileUrl}`,
          {
            headers: {
              "Content-Type": "application/octet-stream",
              AccessKey: process.env["NEXT_PUBLIC_BUNNY_API_KEY"],
            },
          }
        );

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
          (item) => item.fileUrl === input.oldFileUrl
        );

        // create new material

        const newMaterial = {
          content: input.content,
          fileUrl: input.fileUrl,
          orderNumber: targetMaterial.orderNumber,
          fileType: targetMaterial.fileType,
          title: input.title,
          length: data?.length,
        } as Module;

        const newMaterials = oldMaterials.filter(
          (item) => item.fileUrl !== targetMaterial.fileUrl
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
        oldFileUrl: z.string(),
        chapterID: z.string(),
        fileUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("the funtion started...");
      try {
        const targetChapter = await ctx.prisma.chapter.findFirst({
          where: {
            id: input.chapterID,
          },
        });

        console.log("this is the target chapter");
        console.log(targetChapter);

        const oldMaterials = JSON.parse(
          targetChapter.modules as string
        ) as Module[];

        const newMaterial = oldMaterials.filter(
          (item) => item.fileUrl !== input.oldFileUrl
        );

        console.log(
          "this is the new material where the value should be deleted"
        );
        console.log(newMaterial);

        try {
          const newChapter = await ctx.prisma.chapter.update({
            where: {
              id: input.chapterID,
            },
            data: {
              modules: JSON.stringify(newMaterial),
            },
          });
        } catch (err) {
          console.error(err);
        }

        console.log(newMaterial);
      } catch (err) {
        console.error(err);
      }
    }),
};
