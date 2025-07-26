import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { privateProcedure } from "@/src/trpc/trpc";
import axios from "axios";

// Helper function to get video duration from Bunny CDN
async function getVideoLength(
  libraryId: string,
  videoId: string,
  apiKey: string
): Promise<number> {
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
    return response.data?.length || 0;
  } catch (error) {
    console.error("Error getting video length:", error);
    return 0;
  }
}

// Helper function to create video object in Bunny CDN
async function createBunnyVideo(
  title: string,
  libraryId: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await axios.post(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      { title },
      {
        headers: {
          AccessKey: apiKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    return response.data?.guid;
  } catch (error) {
    console.error("Error creating Bunny video:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create video object",
    });
  }
}

export const videoMutations = {
  // Generate signed URL for video upload
  generateVideoUploadUrl: privateProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileSize: z.number(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create video object in Bunny CDN
        const videoId = await createBunnyVideo(
          input.fileName,
          process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]!,
          process.env["NEXT_PUBLIC_BUNNY_API_KEY"]!
        );

        // Generate upload URL
        const uploadUrl = `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos/${videoId}`;

        return {
          videoId,
          uploadUrl,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
        };
      } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
        });
      }
    }),

  // Enhanced create module mutation
  createModule: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string().min(1, "العنوان مطلوب"),
        content: z.string(),
        duration: z.number().min(0),
        fileUrl: z.string().min(1, "معرف الفيديو مطلوب"),
        fileType: z.enum(["VIDEO", "DOCUMENT", "QUIZ"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Get video length from Bunny CDN
        const videoLength = await getVideoLength(
          process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]!,
          input.fileUrl,
          process.env["NEXT_PUBLIC_BUNNY_API_KEY"]!
        );

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
          length: videoLength || input.duration,
          duration: videoLength || input.duration,
          fileType: input.fileType,
          fileUrl: input.fileUrl,
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
                length:
                  (currentCourse.length || 0) + (videoLength || input.duration),
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

  // Delete video mutation (cleanup)
  deleteVideo: privateProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Delete from Bunny CDN
        await axios.delete(
          `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos/${input.videoId}`,
          {
            headers: {
              AccessKey: process.env["NEXT_PUBLIC_BUNNY_API_KEY"]!,
            },
          }
        );

        return { success: true };
      } catch (error) {
        console.error("Error deleting video:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete video",
        });
      }
    }),
};
