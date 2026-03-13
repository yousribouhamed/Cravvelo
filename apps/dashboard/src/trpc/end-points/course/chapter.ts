import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { Module } from "@/src/types";
import { prisma } from "database/src";
import axios from "axios";
import { decrementStorageUsage } from "@/src/server/services/video-usage";

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
        oldFileUrl: z.string().optional(),
        chapterID: z.string(),
        fileUrl: z.string().optional(),
        moduleId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.account?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account not found",
          });
        }

        const targetChapter = await ctx.prisma.chapter.findFirst({
          where: {
            id: input.chapterID,
          },
          include: {
            Course: {
              select: {
                accountId: true,
              },
            },
          },
        });

        if (!targetChapter || !targetChapter.modules) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter or modules not found",
          });
        }

        if (targetChapter.Course.accountId !== ctx.account.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this chapter",
          });
        }

        const oldMaterials = JSON.parse(
          targetChapter.modules as string
        ) as Module[];

        const materialToDelete = oldMaterials.find((item) => {
          if (input.moduleId) {
            return item.id === input.moduleId;
          }
          if (input.oldFileUrl) {
            return item.fileUrl === input.oldFileUrl;
          }
          if (input.fileUrl) {
            return item.fileUrl === input.fileUrl;
          }
          return false;
        });

        if (!materialToDelete) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Material not found",
          });
        }

        const newMaterial = oldMaterials.filter(
          (item) => item.id !== materialToDelete.id
        );

        await ctx.prisma.$transaction(async (tx) => {
          await tx.chapter.update({
            where: {
              id: input.chapterID,
            },
            data: {
              modules: JSON.stringify(newMaterial),
            },
          });

          if (
            materialToDelete.type === "VIDEO" ||
            materialToDelete.fileType === "VIDEO"
          ) {
            const videoAssetDelegate = (
              tx as unknown as { videoAsset?: { findUnique?: (...args: any[]) => Promise<any>; deleteMany?: (...args: any[]) => Promise<any> } }
            ).videoAsset;
            const asset =
              videoAssetDelegate &&
              typeof videoAssetDelegate.findUnique === "function"
                ? await videoAssetDelegate.findUnique({
                    where: { videoId: materialToDelete.fileUrl },
                    select: { sizeBytes: true },
                  })
                : null;

            if (asset) {
              await decrementStorageUsage(tx, ctx.account.id, asset.sizeBytes);
            }

            if (
              videoAssetDelegate &&
              typeof videoAssetDelegate.deleteMany === "function"
            ) {
              await videoAssetDelegate.deleteMany({
                where: {
                  accountId: ctx.account.id,
                  videoId: materialToDelete.fileUrl,
                },
              });
            }
          }
        });

        if (
          materialToDelete.fileUrl &&
          (materialToDelete.type === "VIDEO" ||
            materialToDelete.fileType === "VIDEO")
        ) {
          const libraryId = process.env["NEXT_PUBLIC_VIDEO_LIBRARY"];
          const apiKey = process.env["NEXT_PUBLIC_BUNNY_API_KEY"];
          if (libraryId && apiKey) {
            try {
              await axios.delete(
                `https://video.bunnycdn.com/library/${libraryId}/videos/${materialToDelete.fileUrl}`,
                {
                  headers: { AccessKey: apiKey },
                }
              );
            } catch (error) {
              if (
                !axios.isAxiosError(error) ||
                error.response?.status !== 404
              ) {
                console.warn("Failed to delete Bunny video during material delete", error);
              }
            }
          }
        }

        return { success: true };
      } catch (err) {
        console.error("Error deleting material:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
};
