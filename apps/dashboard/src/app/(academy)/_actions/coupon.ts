"use server";

import { prisma } from "database/src";
import { getStudent } from "./auth";
import { StudentBag } from "@/src/types";
import { redirect } from "next/navigation";
import { Course } from "database";

/**
 * The function lifts the ban off the user i.e. updates
 * the status to `ACTIVE`.
 * @param userId The id of the user.
 * @returns
 */

export const buyWithCoupon = async ({
  code,
  courseId,
}: {
  code: string;
  courseId: string;
}) => {
  // find the coupon

  const [student, coupon, course] = await Promise.all([
    getStudent(),
    prisma.coupon.findFirst({
      where: {
        code,
      },
    }),
    prisma.course.findFirst({
      where: {
        id: courseId,
      },
    }),
  ]);

  if (!coupon) {
    throw new Error("coupon code not valid");
  }

  if (!coupon.isActive) {
    throw new Error("coupon code not valid");
  }

  await prisma.coupon.update({
    where: {
      id: coupon.id,
    },
    data: {
      isActive: false,
    },
  });

  const studentbag = JSON.parse(student.bag as string) as StudentBag;

  // const newStudentBag = {
  //   courses: [...studentbag.courses, course],
  // } as StudentBag;

  await prisma.student.update({
    where: {
      id: student.id,
    },
    data: {
      bag: JSON.stringify(
        addCourseToStudentBag({
          bag: studentbag,
          course: course,
        })
      ),
    },
  });

  redirect("/student-library");

  // update the coupon
};

export const addCourseToStudentBag = ({
  bag,
  course,
}: {
  course: Course;
  bag: StudentBag;
}): StudentBag => {
  const theCourseExists = bag.courses.find((item) => item.id === course.id);
  if (theCourseExists) {
    return bag;
  }
  const newStudentBag = {
    courses: [...bag.courses, course],
  } as StudentBag;

  return newStudentBag;
};

export const consumeCoupon = () => {};
