"use server";

import { prisma } from "database/src";

export const get_course_chapters = async ({
  courseID,
}: {
  courseID: string;
}) => {
  const chapters = await prisma.chapter.findMany({
    where: {
      courseID,
    },
  });

  return chapters;
};
