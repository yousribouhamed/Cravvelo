"use server";

import { withTenant } from "@/_internals/with-tenant";
import z from "zod";
import { Course } from "../types";

export const getAllCourses = withTenant({
  handler: async ({ db, accountId }) => {
    try {
      const courses = await db.course.findMany({
        where: {
          accountId,
        },
      });

      console.log(courses);

      return {
        data: courses as Course[],
        success: true,
        message: "we got all the courses",
      };
    } catch (error) {
      console.log(`courses get error : `, error);

      return {
        data: null,
        success: false,
        message: error,
      };
    }
  },
});

export const getCourseById = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, accountId, input }) => {
    try {
      const course = await db.course.findFirst({
        where: {
          id: input.courseId,
        },
      });

      return {
        data: course as Course,
        success: true,
        message: "success",
      };
    } catch (error) {
      console.log(`courses get error : `, error);

      return {
        data: null,
        success: false,
        message: error,
      };
    }
  },
});
