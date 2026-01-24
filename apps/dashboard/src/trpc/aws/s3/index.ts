import { privateProcedure } from "../../trpc";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { s3 } from "@/src/lib/s3";

const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

const maxFileSize = 1048576 * 10 * 100; // 1 MB * 30

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const s3_bucket = {
  getSignedUrl: privateProcedure
    .input(
      z.object({
        fileType: z.string(),
        fileSize: z.number(),
        checksum: z.string(),
      })
    )

    .mutation(async ({ ctx, input }) => {
      try {
        const bucketName = process.env.S3_BUCKET_NAME;
        if (!allowedFileTypes.includes(input.fileType)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File type not allowed",
          });
        }

        if (input.fileSize > maxFileSize) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File size too large",
          });
        }

        if (!bucketName) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "messing bucke name",
          });
        }

        const fileName = generateFileName();

        // Convert hex checksum to Base64 (AWS S3 requires Base64 format)
        const checksumBase64 = Buffer.from(input.checksum, 'hex').toString('base64');

        const publicObjectCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          ContentLength: input.fileSize,
          ContentType: input.fileType,
          ChecksumSHA256: checksumBase64,
          Metadata: {
            userId: "abdullah api key",
          },
        });

        // Calculate expiration time based on file size
        // Small files (< 1MB): 5 minutes, Medium (1-10MB): 10 minutes, Large (> 10MB): 15 minutes
        const fileSizeMB = input.fileSize / (1024 * 1024);
        const expiresIn = fileSizeMB < 1 ? 300 : fileSizeMB < 10 ? 600 : 900;

        const signedUrl = await getSignedUrl(s3, publicObjectCommand, {
          expiresIn,
        });

        return { success: { url: signedUrl } };
      } catch (err) {
        console.error("S3 signed URL generation error:", err);
        
        // Provide more specific error messages
        if (err instanceof TRPCError) {
          throw err;
        }
        
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate signed URL: ${errorMessage}`,
        });
      }
    }),
};

export const deleteFileFromS3Bucket = async ({
  fileName,
}: {
  fileName: string;
}) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Missing bucket name. Please configure S3_BUCKET_NAME environment variable.",
    });
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    throw new Error("Error deleting image from S3");
  }
};

export function getKeyFromUrl(url) {
  // Extract the key from the URL
  const urlPattern =
    /https:\/\/cravvel-bucket\.s3\.[^/]+\.amazonaws\.com\/(.+)/;
  const match = url.match(urlPattern);

  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error("Invalid URL format");
  }
}
