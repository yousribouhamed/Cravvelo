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

    console.log("this is the student when we create the comment");
    console.log("student");

    if (!student || !student.accountId) {
      throw new Error("there is no student");
    }

    const comment = await prisma.comment.create({
      data: {
        rating,
        content,
        studentEmail: student.email,
        studentId: student.id,
        studentImage: student?.photo_url ?? "no image",
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

    const AllRaiting = comments
      .map((item) => item.rating)
      .reduce((current, prev) => current + prev);

    const newCourseRating = AllRaiting / comments.length;

    console.log("this is the course rating ");
    console.log(AllRaiting);
    console.log("this is the current rating ");
    console.log(rating);

    console.log("this is the lengght");
    console.log(comments.length);

    console.log("this is the calculated rating");

    console.log(newCourseRating);

    console.log("and this is the id of the course");
    console.log(course.id);

    await prisma.course
      .update({
        where: { id: course.id },
        data: {
          rating: newCourseRating,
        },
      })
      .catch((err) => console.error(err));

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
