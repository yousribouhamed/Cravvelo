"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { s3 } from "./index";
import { getKeyFromUrl } from "./utils";

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
const maxFileSize = 1048576 * 10; // 10 MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// Utility function to compute SHA256 checksum
async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function uploadImageToS3(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        error: "No file provided",
        success: false,
      };
    }

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      return {
        error: "File type not allowed. Please upload JPEG or PNG images only.",
        success: false,
      };
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return {
        error: `File size too large. Maximum size is ${
          maxFileSize / 1048576
        }MB`,
        success: false,
      };
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      return {
        error: "S3 configuration error",
        success: false,
      };
    }

    // Compute checksum
    const checksum = await computeSHA256(file);
    const fileName = generateFileName();

    // Create signed URL for upload
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentLength: file.size,
      ContentType: file.type,
      ChecksumSHA256: checksum,
      Metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 300, // 5 minutes
    });

    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResponse.ok) {
      return { success: false, error: "Failed to upload file to S3" };
    }

    const publicUrl = signedUrl.split("?")[0];

    return {
      success: true,
      url: publicUrl,
      fileName,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      error: "Upload failed. Please try again.",
      success: false,
    };
  }
}

export async function deleteImageFromS3(fileName: string) {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
      return {
        error: "S3 configuration error",
        success: false,
      };
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    await s3.send(deleteCommand);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      error: "Failed to delete file",
      success: false,
    };
  }
}

export async function getSignedDownloadUrlFromS3Url(
  url: string,
  expiresInSeconds: number = 60
) {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    return {
      success: false as const,
      error: "S3 configuration error",
      url: null as string | null,
    };
  }

  try {
    const key = getKeyFromUrl(url);
    const cmd = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, cmd, {
      expiresIn: expiresInSeconds,
    });

    return {
      success: true as const,
      error: null as string | null,
      url: signedUrl,
    };
  } catch (error) {
    console.error("Signed download URL error:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to generate download URL",
      url: null as string | null,
    };
  }
}
