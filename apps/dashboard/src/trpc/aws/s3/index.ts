import { privateProcedure, publicProcedure } from "../../trpc";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";

const s3 = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: "AKIA6ODU3XOCBKCMI4AV",
    secretAccessKey: "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",
  },
});

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
];

const maxFileSize = 1048576 * 10; // 1 MB

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
