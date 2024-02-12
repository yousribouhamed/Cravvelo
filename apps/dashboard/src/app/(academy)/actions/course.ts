"use server";

import { prisma } from "database/src";

export const getCourseByUrlPath = async ({ url }: { url: string }) => {
  const course = await prisma.course.findFirst({
    where: {
      id: url,
    },
  });

  return course;
};
