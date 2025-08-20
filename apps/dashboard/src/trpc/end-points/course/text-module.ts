import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { privateProcedure } from "@/src/trpc/trpc";

export const textModule = {
  createTextModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string().min(1, "العنوان مطلوب"),
        content: z.string(),
        duration: z.number().min(0).optional().default(5),
        fileType: z.enum(["DOCUMENT"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Find the chapter
        const chapter = await ctx.prisma.chapter.findUnique({
          where: { id: input.chapterID },
          include: {
            Course: true,
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        // Parse existing modules
        const modules = chapter.modules
          ? (JSON.parse(chapter.modules as string) as any[])
          : [];

        // Generate unique ID for the new module
        const moduleId = `module_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Estimate reading time based on content length if not provided
        let estimatedDuration = input.duration;
        if (!input.duration || input.duration === 0) {
          // Rough estimate: 200 words per minute reading speed
          // Remove HTML tags and count words
          const plainText = input.content.replace(/<[^>]*>/g, " ");
          const wordCount = plainText.trim().split(/\s+/).length;
          estimatedDuration = Math.max(1, Math.ceil(wordCount / 200));
        }

        // Create new module object
        const newModule = {
          id: moduleId,
          content: input.content,
          length: estimatedDuration,
          duration: estimatedDuration,
          fileType: input.fileType,
          fileUrl: "", // No file URL for text content
          orderNumber: modules.length + 1,
          position: modules.length,
          title: input.title,
          isPublished: true,
          isFree: false,
          type: input.fileType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedModules = [...modules, newModule];

        // Start transaction
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Update chapter with new module
          const updatedChapter = await tx.chapter.update({
            where: { id: input.chapterID },
            data: {
              modules: JSON.stringify(updatedModules),
              updatedAt: new Date(),
            },
          });

          // Update course statistics
          const currentCourse = await tx.course.findUnique({
            where: { id: chapter.courseId },
          });

          if (currentCourse) {
            await tx.course.update({
              where: { id: chapter.courseId },
              data: {
                length: (currentCourse.length || 0) + estimatedDuration,
                nbrChapters: (currentCourse.nbrChapters || 0) + 1,
                updatedAt: new Date(),
              },
            });
          }

          return { chapter: updatedChapter, moduleId };
        });

        return {
          success: true,
          moduleId: result.moduleId,
          chapterId: result.chapter.id,
          courseId: chapter.courseId,
          duration: estimatedDuration,
        };
      } catch (error) {
        console.error("Error creating text module:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create text module",
        });
      }
    }),

  // Update an existing document/text module
  updateTextModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        moduleId: z.string(),
        title: z.string().min(1, "العنوان مطلوب").optional(),
        content: z.string().optional(),
        duration: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Find the chapter
        const chapter = await ctx.prisma.chapter.findUnique({
          where: { id: input.chapterID },
          include: {
            Course: true,
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        // Parse existing modules
        const modules = chapter.modules
          ? (JSON.parse(chapter.modules as string) as any[])
          : [];

        // Find the module to update
        const moduleIndex = modules.findIndex(
          (module) => module.id === input.moduleId
        );

        if (moduleIndex === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Module not found",
          });
        }

        const existingModule = modules[moduleIndex];

        // Calculate new duration if content changed
        let newDuration = input.duration || existingModule.duration || 5;

        if (input.content && (!input.duration || input.duration === 0)) {
          // Recalculate reading time based on new content
          const plainText = input.content.replace(/<[^>]*>/g, " ");
          const wordCount = plainText.trim().split(/\s+/).length;
          newDuration = Math.max(1, Math.ceil(wordCount / 200));
        }

        // Calculate length difference for course statistics
        const lengthDifference = newDuration - (existingModule.duration || 0);

        // Start transaction
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Update the module with new data
          const updatedModule = {
            ...existingModule,
            ...(input.title && { title: input.title }),
            ...(input.content && { content: input.content }),
            length: newDuration,
            duration: newDuration,
            updatedAt: new Date().toISOString(),
          };

          // Replace the module in the array
          const updatedModules = [...modules];
          updatedModules[moduleIndex] = updatedModule;

          // Update chapter with modified modules
          const updatedChapter = await tx.chapter.update({
            where: { id: input.chapterID },
            data: {
              modules: JSON.stringify(updatedModules),
              updatedAt: new Date(),
            },
          });

          // Update course statistics if duration changed
          if (lengthDifference !== 0) {
            const currentCourse = await tx.course.findUnique({
              where: { id: chapter.courseId },
            });

            if (currentCourse) {
              await tx.course.update({
                where: { id: chapter.courseId },
                data: {
                  length: Math.max(
                    0,
                    (currentCourse.length || 0) + lengthDifference
                  ),
                  updatedAt: new Date(),
                },
              });
            }
          }

          return { chapter: updatedChapter, updatedModule };
        });

        return {
          success: true,
          moduleId: input.moduleId,
          chapterId: result.chapter.id,
          courseId: chapter.courseId,
          newDuration,
          lengthDifference,
        };
      } catch (error) {
        console.error("Error updating text module:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update text module",
        });
      }
    }),

  // Delete a text module
  deleteTextModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        moduleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Find the chapter
        const chapter = await ctx.prisma.chapter.findUnique({
          where: { id: input.chapterID },
          include: {
            Course: true,
          },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        // Parse existing modules
        const modules = chapter.modules
          ? (JSON.parse(chapter.modules as string) as any[])
          : [];

        // Find the module to delete
        const moduleIndex = modules.findIndex(
          (module) => module.id === input.moduleId
        );

        if (moduleIndex === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Module not found",
          });
        }

        const moduleToDelete = modules[moduleIndex];
        const moduleDuration = moduleToDelete.duration || 0;

        // Remove the module from the array and reorder
        const updatedModules = modules
          .filter((_, index) => index !== moduleIndex)
          .map((module, index) => ({
            ...module,
            orderNumber: index + 1,
            position: index,
          }));

        // Start transaction
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Update chapter with modified modules
          const updatedChapter = await tx.chapter.update({
            where: { id: input.chapterID },
            data: {
              modules: JSON.stringify(updatedModules),
              updatedAt: new Date(),
            },
          });

          // Update course statistics
          const currentCourse = await tx.course.findUnique({
            where: { id: chapter.courseId },
          });

          if (currentCourse) {
            await tx.course.update({
              where: { id: chapter.courseId },
              data: {
                length: Math.max(
                  0,
                  (currentCourse.length || 0) - moduleDuration
                ),
                nbrChapters: Math.max(0, (currentCourse.nbrChapters || 0) - 1),
                updatedAt: new Date(),
              },
            });
          }

          return { chapter: updatedChapter };
        });

        return {
          success: true,
          chapterId: result.chapter.id,
          courseId: chapter.courseId,
          deletedModuleId: input.moduleId,
          durationRemoved: moduleDuration,
        };
      } catch (error) {
        console.error("Error deleting text module:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete text module",
        });
      }
    }),

  // Get a specific text module
  getTextModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        moduleId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const chapter = await ctx.prisma.chapter.findUnique({
          where: { id: input.chapterID },
        });

        if (!chapter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Chapter not found",
          });
        }

        const modules = chapter.modules
          ? (JSON.parse(chapter.modules as string) as any[])
          : [];

        const module = modules.find((m) => m.id === input.moduleId);

        if (!module) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Module not found",
          });
        }

        return {
          success: true,
          module,
        };
      } catch (error) {
        console.error("Error getting text module:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get text module",
        });
      }
    }),
};
