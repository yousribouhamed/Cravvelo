import { privateProcedure, publicProcedure } from "../../trpc";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { s3 } from "@/src/lib/s3";

const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

const maxFileSize = 1048576 * 10 * 30; // 1 MB * 30

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const s3_bucket = {
  getSignedUrl: publicProcedure
    .input(
      z.object({
        fileType: z.string(),
        fileSize: z.number(),
        checksum: z.string(),
      })
    )

    .mutation(async ({ ctx, input }) => {
      try {
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

        const fileName = generateFileName();

        const publicObjectCommand = new PutObjectCommand({
          Bucket:
            process.env.NODE_ENV === "development"
              ? "cravvel-bucket"
              : "cravvel-bucket",
          Key: fileName,
          ContentLength: input.fileSize,
          ContentType: input.fileType,
          ChecksumSHA256: input.checksum,
          Metadata: {
            userId: "abdullah api key",
          },
        });

        const signedUrl = await getSignedUrl(s3, publicObjectCommand, {
          expiresIn: 60,
        });

        return { success: { url: signedUrl } };
      } catch (err) {
        console.error(err);
      }
    }),
};

export const deleteFileFromS3Bucket = async ({
  fileName,
}: {
  fileName: string;
}) => {
  const params = {
    Bucket: "cravvel-bucket",
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
