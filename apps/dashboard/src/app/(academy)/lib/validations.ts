import * as z from "zod";

export const UploadFileSchema = z.object({
  fileType: z.string(),
  fileSize: z.number(),
  checksum: z.string(),
});
