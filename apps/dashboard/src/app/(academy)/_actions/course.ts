"use server";

/**
 * Module for querying courses based on URL path.
 * Retrieves a course from the database based on its URL path.
 * @requires prisma Prisma client for database operations.
 */

import { prisma } from "database/src";
import { getStudent } from "./auth";
import { StudentBag } from "@/src/types";

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

/**
 * Function to retrieve a course based on its URL path.
 * @param url The URL path of the course to be retrieved.
 * @returns A Promise that resolves to the retrieved course or null if not found.
 */
export const getProductByUrlPath = async ({ url }: { url: string }) => {
  const course = await prisma.product.findFirst({
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
export const updateStudentProgress = async ({
  courseId,
}: {
  courseId: string;
}) => {
  // get the student
  const student = await getStudent();

  // const course = await prisma.course.findFirst({
  //   where: {
  //     id: courseId,
  //   },
  // });

  const oldBag = JSON.parse(student.bag as string) as StudentBag;

  const target = oldBag.courses.find((item) => item.course.id === courseId);

  const newCourses = oldBag.courses.filter(
    (item) => item.course.id !== courseId
  );

  const updatedItem = {
    ...target,
    currentEpisode: target.currentEpisode + 1,
  };

  const newBag = { ...oldBag, courses: [...newCourses, updatedItem] };

  // add the updated item

  await prisma.student.update({
    where: {
      id: student.id,
    },
    data: {
      bag: JSON.stringify(newBag),
    },
  });
};
