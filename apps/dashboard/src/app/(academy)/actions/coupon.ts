"use server";

import { prisma } from "database/src";
import { getStudent } from "./auth";
import { StudentBag } from "@/src/types";

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

  const newStudentBag = {
    courses: [...studentbag.courses, course],
  } as StudentBag;

  await prisma.student.update({
    where: {
      id: student.id,
    },
    data: {
      bag: JSON.stringify(newStudentBag),
    },
  });

  // update the coupon
};
