"use server";

import { prisma } from "database/src";
import {
  deleteFileFromS3Bucket,
  getKeyFromUrl,
  getS3ObjectSize,
} from "../trpc/aws/s3";
import { revalidatePath } from "next/cache";

export const deleteCourseAction = async ({
  courseId,
  imageurl,
}: {
  courseId: string;
  imageurl: string | null;
}) => {
  try {
    if (imageurl) {
      const key = getKeyFromUrl(imageurl);
      const size = await getS3ObjectSize(key);
      await deleteFileFromS3Bucket({ fileName: key });
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { accountId: true },
      });
      if (course && size > 0) {
        const acc = await prisma.account.findUnique({
          where: { id: course.accountId },
          select: { storageUsedBytes: true },
        });
        if (acc) {
          const next = Math.max(0, acc.storageUsedBytes - size);
          await prisma.account.update({
            where: { id: course.accountId },
            data: { storageUsedBytes: next },
          });
        }
      }
    }
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/courses");
  } catch (err) {
    console.error(err);
  }
};
