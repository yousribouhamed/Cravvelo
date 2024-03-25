"use server";

/**
 * Module for querying courses based on URL path.
 * Retrieves a course from the database based on its URL path.
 * @requires prisma Prisma client for database operations.
 */

import { prisma } from "database/src";

/**
 * Function to retrieve a course based on its URL path.
 * @param url The URL path of the course to be retrieved.
 * @returns A Promise that resolves to the retrieved course or null if not found.
 */
export const getCourseByUrlPath = async ({ url }: { url: string }) => {
  const course = await prisma.course.findFirst({
    where: {
      id: url, // Querying the course by its URL path (assuming 'id' represents the URL path)
    },
  });

  return course; // Returning the retrieved course or null if not found
};

export const completeCourse = async ({
  courseId,
  currentEpisode,
}: {
  courseId: string;
  currentEpisode: number;
}) => {
  // get the student & old student bug
  // update the student bug currentEpisode index
  // save the update to the database
};

/**
 * Function to update the progress on the course
 * @param url The URL path of the course to be retrieved.
 * @returns A Promise that resolves to the retrieved course or null if not found.
 */
export const updateStudentProgress = async ({ url }: { url: string }) => {
  // get the student
  // update the current student bag
  // revalidate the path
};
