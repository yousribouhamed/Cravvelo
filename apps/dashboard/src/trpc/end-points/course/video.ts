import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { privateProcedure } from "@/src/trpc/trpc";
import axios from "axios";
import {
  assertBandwidthAvailable,
  assertStorageAvailable,
  decrementStorageUsage,
  incrementStorageUsage,
  upsertVideoAsset,
} from "@/src/server/services/video-usage";

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

const BUNNY_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function parseModules(modulesRaw: unknown): any[] {
  if (!modulesRaw) return [];
  if (Array.isArray(modulesRaw)) return modulesRaw;
  if (typeof modulesRaw === "string") {
    try {
      const parsed = JSON.parse(modulesRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function deleteVideoFromBunny(videoId: string) {
  const libraryId = process.env["NEXT_PUBLIC_VIDEO_LIBRARY"];
  const apiKey = process.env["NEXT_PUBLIC_BUNNY_API_KEY"];

  if (!libraryId || !apiKey) {
    return;
  }

  try {
    await axios.delete(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        headers: {
          AccessKey: apiKey,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return;
    }
    console.warn(`Failed to delete Bunny video ${videoId}:`, error);
  }
}

function getVideoAssetDelegate(prismaLike: unknown) {
  const delegate = (prismaLike as { videoAsset?: unknown })?.videoAsset;
  if (
    delegate &&
    typeof (delegate as { findUnique?: unknown }).findUnique === "function"
  ) {
    return delegate as {
      findUnique: (...args: any[]) => Promise<any>;
      deleteMany: (...args: any[]) => Promise<any>;
    };
  }
  return null;
}

export const videoMutations = {
  checkVideoUploadAllowed: privateProcedure
    .input(z.object({ fileSize: z.number().min(0) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.account?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Account not found",
        });
      }
      await assertStorageAvailable(ctx.prisma, ctx.account.id, input.fileSize);
      return { allowed: true };
    }),

  // Simplified create module - assumes video is already uploaded directly
  createModuleWithVideo: privateProcedure
    .input(
      z.object({
        chapterID: z.string(),
        title: z.string().min(1, "العنوان مطلوب"),
        content: z.string(),
        duration: z.number().min(0),
        fileType: z.enum(["VIDEO", "DOCUMENT", "QUIZ"]),
        videoId: z.string().regex(BUNNY_VIDEO_ID_REGEX, "Invalid video id"),
        fileSizeInBytes: z.number().min(0).optional(),
        idempotencyKey: z.string().min(8).max(128).optional(),
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

        if (!ctx.account?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account not found",
          });
        }

        if (input.fileSizeInBytes && input.fileSizeInBytes > 0) {
          await assertStorageAvailable(
            ctx.prisma,
            ctx.account.id,
            input.fileSizeInBytes
          );
        }

        // Find the chapter and verify ownership
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

        if (chapter.Course.accountId !== ctx.account.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this chapter",
          });
        }

        // Parse existing modules
        const modules = parseModules(chapter.modules);

        if (input.idempotencyKey) {
          const existingModule = modules.find(
            (module) => module?.idempotencyKey === input.idempotencyKey
          );
          if (existingModule) {
            return {
              success: true,
              idempotent: true,
              moduleId: existingModule.id,
              chapterId: chapter.id,
              courseId: chapter.courseId,
              videoLength: existingModule.duration || existingModule.length || 0,
            };
          }
        }

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
          fileUrl: input.videoId,
          size: input.fileSizeInBytes || 0,
          orderNumber: modules.length + 1,
          position: modules.length,
          title: input.title,
          isPublished: true,
          isFree: false,
          type: input.fileType,
          idempotencyKey: input.idempotencyKey,
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

          if (typeof input.fileSizeInBytes === "number" && input.fileSizeInBytes > 0) {
            await incrementStorageUsage(tx, ctx.account.id, input.fileSizeInBytes);
          }

          await upsertVideoAsset(tx, {
            accountId: ctx.account.id,
            courseId: chapter.courseId,
            chapterId: chapter.id,
            moduleId,
            videoId: input.videoId,
            sizeBytes: input.fileSizeInBytes || 0,
            source: "COURSE_MODULE",
            status: "ACTIVE",
          });

          return { chapter: updatedChapter, moduleId };
        });

        return {
          success: true,
          idempotent: false,
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

  checkVideoPlaybackAllowed: privateProcedure
    .input(
      z.object({
        videoId: z.string().regex(BUNNY_VIDEO_ID_REGEX, "Invalid video id"),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.account?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Account not found",
        });
      }

      const videoAssetDelegate = getVideoAssetDelegate(ctx.prisma);
      const asset = videoAssetDelegate
        ? await videoAssetDelegate.findUnique({
            where: { videoId: input.videoId },
            select: { accountId: true },
          })
        : null;

      if (asset && asset.accountId !== ctx.account.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this video",
        });
      }

      await assertBandwidthAvailable(ctx.prisma, ctx.account.id);
      return { allowed: true };
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
        if (!ctx.account?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account not found",
          });
        }

        const videoAssetDelegate = getVideoAssetDelegate(ctx.prisma);
        const asset = videoAssetDelegate
          ? await videoAssetDelegate.findUnique({
              where: { videoId: input.videoId },
              select: { accountId: true, sizeBytes: true },
            })
          : null;

        if (asset && asset.accountId !== ctx.account.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this video",
          });
        }

        await deleteVideoFromBunny(input.videoId);

        await ctx.prisma.$transaction(async (tx) => {
          if (asset) {
            await decrementStorageUsage(tx, ctx.account.id, asset.sizeBytes);
          }
          const txVideoAssetDelegate = getVideoAssetDelegate(tx);
          if (txVideoAssetDelegate) {
            await txVideoAssetDelegate.deleteMany({
              where: { videoId: input.videoId, accountId: ctx.account.id },
            });
          }
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting video:", error);

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
        newVideoId: z.string().regex(BUNNY_VIDEO_ID_REGEX, "Invalid video id"),
        title: z.string().min(1, "العنوان مطلوب").optional(),
        content: z.string().optional(),
        duration: z.number().min(0).optional(),
        newVideoSizeInBytes: z.number().min(0).optional(),
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

        if (!ctx.account?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account not found",
          });
        }

        // Find the chapter and verify ownership
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

        if (chapter.Course.accountId !== ctx.account.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this chapter",
          });
        }

        // Parse existing modules
        const modules = parseModules(chapter.modules);

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
        const oldVideoId = typeof existingModule.fileUrl === "string" ? existingModule.fileUrl : "";

        const videoAssetDelegate = getVideoAssetDelegate(ctx.prisma);
        const oldAsset =
          oldVideoId && videoAssetDelegate
            ? await videoAssetDelegate.findUnique({
                where: { videoId: oldVideoId },
                select: { sizeBytes: true },
              })
            : null;
        const oldSizeBytes = oldAsset?.sizeBytes || Number(existingModule.size || 0);
        const newSizeBytes =
          typeof input.newVideoSizeInBytes === "number"
            ? input.newVideoSizeInBytes
            : oldSizeBytes;

        const storageDelta = newSizeBytes - oldSizeBytes;
        if (storageDelta > 0) {
          await assertStorageAvailable(ctx.prisma, ctx.account.id, storageDelta);
        }

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
            fileUrl: input.newVideoId,
            length: newVideoLength,
            duration: newVideoLength,
            size: newSizeBytes,
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

          if (storageDelta > 0) {
            await incrementStorageUsage(tx, ctx.account.id, storageDelta);
          } else if (storageDelta < 0) {
            await decrementStorageUsage(tx, ctx.account.id, Math.abs(storageDelta));
          }

          await upsertVideoAsset(tx, {
            accountId: ctx.account.id,
            courseId: chapter.courseId,
            chapterId: chapter.id,
            moduleId: input.moduleId,
            videoId: input.newVideoId,
            sizeBytes: newSizeBytes,
            source: "COURSE_MODULE",
            status: "ACTIVE",
          });

          if (oldVideoId && oldVideoId !== input.newVideoId) {
            const txVideoAssetDelegate = getVideoAssetDelegate(tx);
            if (txVideoAssetDelegate) {
              await txVideoAssetDelegate.deleteMany({
                where: {
                  accountId: ctx.account.id,
                  videoId: oldVideoId,
                },
              });
            }
          }

          return { chapter: updatedChapter, updatedModule };
        });

        // After successful database update, delete the old video from Bunny CDN
        // We do this after the transaction to avoid orphaned videos if DB update fails
        if (oldVideoId && oldVideoId !== input.newVideoId) {
          await deleteVideoFromBunny(oldVideoId);
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
          storageDelta,
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
