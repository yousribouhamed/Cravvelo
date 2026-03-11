"use server";

import { withAuth } from "@/src/_internals/with-auth";
import { z } from "zod";

/** Call after a successful upload to count file size toward account storage. */
export const recordStorageUsed = withAuth({
  input: z.object({ fileSizeInBytes: z.number().min(0) }),
  handler: async ({ account, input, db }) => {
    await db.account.update({
      where: { id: account.id },
      data: {
        storageUsedBytes: { increment: input.fileSizeInBytes },
      },
    });
    return { success: true };
  },
});

/** Call after deleting a file from S3 to free account storage. */
export const decrementStorageUsed = withAuth({
  input: z.object({
    fileSizeInBytes: z.number().min(0),
  }),
  handler: async ({ account, input, db }) => {
    const acc = await db.account.findUnique({
      where: { id: account.id },
      select: { storageUsedBytes: true },
    });
    if (!acc) return { success: true };
    const next = Math.max(0, acc.storageUsedBytes - input.fileSizeInBytes);
    await db.account.update({
      where: { id: account.id },
      data: { storageUsedBytes: next },
    });
    return { success: true };
  },
});
