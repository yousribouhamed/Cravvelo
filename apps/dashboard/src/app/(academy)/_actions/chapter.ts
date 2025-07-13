"use server";

/**
 * Module for retrieving chapters associated with a specific course.
 * @requires prisma Prisma client for database operations.
 */

import { prisma } from "database/src";

/**
 * Function to retrieve chapters associated with a specific course.
 * @param courseID The ID of the course for which chapters are to be retrieved.
 * @returns A Promise that resolves to an array of chapters.
 */
export const get_course_chapters = async ({
  courseID,
}: {
  courseID: string;
}) => {
  const chapters = await prisma.chapter.findMany({
    where: {
      courseId: courseID, // Filtering chapters based on the provided course ID
    },
  });

  return chapters; // Returning the array of chapters
};
