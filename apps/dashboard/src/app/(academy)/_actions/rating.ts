"use server";

import { Course } from "database";
import { prisma } from "database/src";
import { getStudent } from "./auth";

export const create_rating = async ({
  course,
  content,
  rating,
}: {
  course: Course;
  content: string;
  rating: number;
}) => {
  try {
    const student = await getStudent();

    if (!student) {
      throw new Error("there is no student");
    }

    const comment = await prisma.comment.create({
      data: {
        rating,
        content,
        studentEmail: student.email,
        studentId: student.id,
        studentImage: student.photo_url,
        studentName: student.full_name,
        courseId: course.id,
        accountId: student.accountId,
      },
    });

    const comments = await prisma.comment.findMany({
      where: {
        courseId: course.id,
      },
    });

    const newCourseRating = (course.rating ?? 0 + rating) / comments.length;

    await prisma.course.update({
      where: { id: course.id },
      data: {
        rating: newCourseRating,
      },
    });

    return comment;
  } catch (err) {
    console.error(err);
  }
};

export const get_course_rating = async ({ courseId }: { courseId: string }) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        courseId,
      },
    });
    return comments;
  } catch (err) {
    console.error(err);
  }
};
