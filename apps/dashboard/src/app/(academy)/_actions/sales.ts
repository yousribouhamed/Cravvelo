"use server";

import { Course } from "database";
import { prisma } from "database/src";

export const create_course_sale = async ({
  accountId,
  course,
  studentId,
}: {
  course: Course;
  studentId: string;
  accountId: string;
}) => {
  try {
    const sale = await prisma.sale.create({
      data: {
        amount: 1,
        itemId: course.id,
        price: Number(course.price),
        itemType: "COURSE",
        status: "CREATED",
        accountId,
        studentId,
      },
    });

    return sale;
  } catch (err) {
    console.log(err);
  }
};
