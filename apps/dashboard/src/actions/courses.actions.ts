"use server";

import { prisma } from "database/src";
import { deleteFileFromS3Bucket, getKeyFromUrl } from "../trpc/aws/s3";
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
      await deleteFileFromS3Bucket({
        fileName: getKeyFromUrl(imageurl),
      });
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
