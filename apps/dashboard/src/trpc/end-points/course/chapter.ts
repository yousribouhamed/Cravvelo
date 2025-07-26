import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { Module } from "@/src/types";
import { prisma } from "database/src";
import { getVideoLength } from "@/src/lib/utils";

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
            courseId: input.courseId,
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
          courseId: input.courseId,
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

      // Use Promise.all for better performance
      try {
        await Promise.all(
          bulkUpdateData.map(async (item) => {
            await ctx.prisma.chapter.update({
              where: {
                id: item.id,
              },
              data: {
                orderNumber: item.position,
              },
            });
          })
        );
      } catch (err) {
        console.error(
          "this error is coming from trpc router called update chapters"
        );
        console.error(err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  updateModulesOrders: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        modules: z.array(z.any()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Generate IDs for modules that don't have them and ensure proper structure
        const modulesWithIds = input.modules.map((module, index) => ({
          ...module,
          id: module.id || `module_${Date.now()}_${index}`,
          position: index,
          isPublished: module.isPublished ?? true,
          createdAt: module.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        await prisma.chapter.update({
          where: {
            id: input.chapterID,
          },
          data: {
            modules: JSON.stringify(modulesWithIds),
          },
        });

        return { success: true };
      } catch (err) {
        console.error("Error updating modules order:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  // NEW: Toggle module visibility
  toggleModuleVisibility: privateProcedure
    .input(
      z.object({
        moduleId: z.string(),
        isPublished: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Find the chapter containing this module
        const chapters = await ctx.prisma.chapter.findMany({
          where: {
            modules: {
              not: null,
            },
          },
        });

        let targetChapter = null;
        let modules = [];

        for (const chapter of chapters) {
          if (chapter.modules) {
            const chapterModules = JSON.parse(
              chapter.modules as string
            ) as Module[];
            const moduleExists = chapterModules.some(
              (m) => m.id === input.moduleId
            );
            if (moduleExists) {
              targetChapter = chapter;
              modules = chapterModules;
              break;
            }
          }
        }

        if (!targetChapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Module not found",
          });
        }

        // Update the specific module's visibility
        const updatedModules = modules.map((module) => {
          if (module.id === input.moduleId) {
            return {
              ...module,
              isPublished: input.isPublished,
              updatedAt: new Date().toISOString(),
            };
          }
          return module;
        });

        await ctx.prisma.chapter.update({
          where: {
            id: targetChapter.id,
          },
          data: {
            modules: JSON.stringify(updatedModules),
          },
        });

        return { success: true };
      } catch (err) {
        console.error("Error toggling module visibility:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
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
      console.log("the function started...");
      try {
        const targetChapter = await ctx.prisma.chapter.findFirst({
          where: {
            id: input.chapterID,
          },
        });

        if (!targetChapter || !targetChapter.modules) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter or modules not found",
          });
        }

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

        const newChapter = await ctx.prisma.chapter.update({
          where: {
            id: input.chapterID,
          },
          data: {
            modules: JSON.stringify(newMaterial),
          },
        });

        console.log("Material deleted successfully");
        return { success: true };
      } catch (err) {
        console.error("Error deleting material:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
};
