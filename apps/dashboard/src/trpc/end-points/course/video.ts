import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { privateProcedure } from "@/src/trpc/trpc";
import axios from "axios";

async function getVideoInfo(
  libraryId: string,
  videoId: string,
  apiKey: string
): Promise<{ exists: boolean; length?: number; status?: string }> {
  try {
    const response = await axios.get(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        headers: {
          AccessKey: apiKey,
          accept: "application/json",
        },
      }
    );

    return {
      exists: true,
      length: response.data?.length || 0,
      status: response.data?.status || "unknown",
    };
  } catch (error) {
    // If video doesn't exist, return false
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { exists: false };
    }
    console.error("Error checking video info:", error);
    return { exists: false };
  }
}

// Helper function to wait for video processing (optional)
async function waitForVideoProcessing(
  libraryId: string,
  videoId: string,
  apiKey: string,
  maxAttempts: number = 10
): Promise<number> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const info = await getVideoInfo(libraryId, videoId, apiKey);

    if (info.exists && info.length && info.length > 0) {
      return info.length;
    }

    // Wait 2 seconds before next attempt
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return 0; // Return 0 if we couldn't get the length
}

export const videoMutations = {
  // Simplified create module - assumes video is already uploaded directly
  createModuleWithVideo: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string().min(1, "العنوان مطلوب"),
        content: z.string(),
        duration: z.number().min(0),
        fileType: z.enum(["VIDEO", "DOCUMENT", "QUIZ"]),
        videoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const libraryId = process.env.NEXT_PUBLIC_VIDEO_LIBRARY!;
        const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY!;

        console.log("these are the credantials -> : ");
        console.log(libraryId);
        console.log(apiKey);

        if (!libraryId || !apiKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Missing Bunny CDN configuration",
          });
        }

        let videoLength = input.duration;

        // Optional: Try to get video length from Bunny CDN
        // This might not work immediately after upload as video needs processing
        try {
          const cdnLength = await waitForVideoProcessing(
            libraryId,
            input.videoId,
            apiKey,
            3
          );
          if (cdnLength > 0) {
            videoLength = cdnLength;
          }
        } catch (error) {
          console.warn(
            "Could not get video length from CDN, using client duration:",
            error
          );
          // Use the duration calculated on client side
        }

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

        // Create new module object
        const newModule = {
          id: moduleId,
          content: input.content,
          length: videoLength,
          duration: videoLength,
          fileType: input.fileType,
          fileUrl: input.videoId, // This is the video ID used for direct upload
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
                length: (currentCourse.length || 0) + videoLength,
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
          videoLength,
        };
      } catch (error) {
        console.error("Error creating module:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create module",
        });
      }
    }),

  // Optional: Check video status after upload
  checkVideoStatus: privateProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const libraryId = process.env["NEXT_PUBLIC_VIDEO_LIBRARY"];
        const apiKey = process.env["NEXT_PUBLIC_BUNNY_API_KEY"];

        if (!libraryId || !apiKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Missing Bunny CDN configuration",
          });
        }

        const info = await getVideoInfo(libraryId, input.videoId, apiKey);

        return {
          exists: info.exists,
          length: info.length || 0,
          status: info.status || "unknown",
          isReady: info.exists && (info.length || 0) > 0,
        };
      } catch (error) {
        console.error("Error checking video status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check video status",
        });
      }
    }),

  // Delete video mutation (cleanup)
  deleteVideo: privateProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const libraryId = process.env["NEXT_PUBLIC_VIDEO_LIBRARY"];
        const apiKey = process.env["NEXT_PUBLIC_BUNNY_API_KEY"];

        if (!libraryId || !apiKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Missing Bunny CDN configuration",
          });
        }

        await axios.delete(
          `https://video.bunnycdn.com/library/${libraryId}/videos/${input.videoId}`,
          {
            headers: {
              AccessKey: apiKey,
            },
          }
        );

        return { success: true };
      } catch (error) {
        console.error("Error deleting video:", error);

        // Don't throw error if video doesn't exist
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return {
            success: true,
            message: "Video already deleted or does not exist",
          };
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete video",
        });
      }
    }),

  updateModuleVideo: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        moduleId: z.string(),
        newVideoId: z.string(),
        title: z.string().min(1, "العنوان مطلوب").optional(),
        content: z.string().optional(),
        duration: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const libraryId = process.env.NEXT_PUBLIC_VIDEO_LIBRARY!;
        const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY!;

        if (!libraryId || !apiKey) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Missing Bunny CDN configuration",
          });
        }

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
        const oldVideoId = existingModule.fileUrl;

        // Get new video length from Bunny CDN
        let newVideoLength = input.duration || existingModule.duration || 0;

        try {
          const cdnLength = await waitForVideoProcessing(
            libraryId,
            input.newVideoId,
            apiKey,
            3
          );
          if (cdnLength > 0) {
            newVideoLength = cdnLength;
          }
        } catch (error) {
          console.warn(
            "Could not get new video length from CDN, using provided duration:",
            error
          );
        }

        // Calculate length difference for course statistics
        const lengthDifference =
          newVideoLength - (existingModule.duration || 0);

        // Start transaction
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Update the module with new video data
          const updatedModule = {
            ...existingModule,
            ...(input.title && { title: input.title }),
            ...(input.content && { content: input.content }),
            fileUrl: input.newVideoId, // New video ID
            length: newVideoLength,
            duration: newVideoLength,
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

          // Update course statistics if length changed
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

        // After successful database update, delete the old video from Bunny CDN
        // We do this after the transaction to avoid orphaned videos if DB update fails
        if (oldVideoId && oldVideoId !== input.newVideoId) {
          try {
            await axios.delete(
              `https://video.bunnycdn.com/library/${libraryId}/videos/${oldVideoId}`,
              {
                headers: {
                  AccessKey: apiKey,
                },
              }
            );
            console.log(`Successfully deleted old video: ${oldVideoId}`);
          } catch (deleteError) {
            // Log the error but don't fail the entire operation
            // The video might already be deleted or not exist
            console.warn(
              `Failed to delete old video ${oldVideoId}:`,
              deleteError
            );

            if (
              axios.isAxiosError(deleteError) &&
              deleteError.response?.status !== 404
            ) {
              // If it's not a 404 (video not found), log as warning
              // but continue with the operation
              console.error("Unexpected error deleting video:", deleteError);
            }
          }
        }

        return {
          success: true,
          moduleId: input.moduleId,
          chapterId: result.chapter.id,
          courseId: chapter.courseId,
          oldVideoId,
          newVideoId: input.newVideoId,
          newVideoLength,
          lengthDifference,
        };
      } catch (error) {
        console.error("Error updating module video:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update module video",
        });
      }
    }),
};
