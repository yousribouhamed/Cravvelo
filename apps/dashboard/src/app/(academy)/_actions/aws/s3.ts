"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { s3 } from "@/src/lib/s3";
import { UploadFileSchema } from "../../lib/validations";

const allowedFileTypes = ["image/jpeg", "image/png"];

const maxFileSize = 1048576 * 10; // 1 MB
/**
 * This function generates a unique file name using crypto.randomBytes.
 * @param {number} bytes - The number of bytes for the generated file name.
 * @returns {string} - The generated file name.
 */
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

/**
 * Defines the parameters required for performing an action with the file.
 */
type ActionParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

/**
 * Retrieves a signed URL from AWS S3 for uploading files securely.
 * @param {ActionParams} data - The parameters required for the action, including fileType, fileSize, and checksum.
 * @returns {Promise<{success: {url: string}}>} - A promise resolving to the signed URL upon success.
 */
export async function getOurSignedUrl(
  data: ActionParams
): Promise<{ success: { url: string } }> {
  // Validates the input data against predefined schema.
  const validData = UploadFileSchema.parse(data);

  try {
    // Check if the file type is allowed.
    if (!allowedFileTypes.includes(validData.fileType)) {
      throw new Error("File type not allowed");
    }

    // Check if the file size exceeds the maximum allowed size.
    if (validData.fileSize > maxFileSize) {
      throw new Error("File size too large");
    }

    // Generate a unique file name.
    const fileName = generateFileName();

    // Define the parameters for uploading the file to AWS S3.
    const publicObjectCommand = new PutObjectCommand({
      Bucket:
        process.env.NODE_ENV === "development"
          ? "cravvel-bucket"
          : "cravvel-bucket",
      Key: fileName,
      ContentLength: validData.fileSize,
      ContentType: validData.fileType,
      ChecksumSHA256: validData.checksum,
      Metadata: {
        userId: "abdullah api key",
      },
    });

    // Generate a signed URL with limited expiration time for secure file upload.
    const signedUrl = await getSignedUrl(s3, publicObjectCommand, {
      expiresIn: 60,
    });

    // Return the signed URL upon successful generation.
    return { success: { url: signedUrl } };
  } catch (err) {
    // Log any errors that occur during the process.
    console.error(err);
  }
}
