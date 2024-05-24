"use server";

import { pusherServer } from "@/src/lib/pusher";
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
    const newStudentNumber = Number(course.studenstNbr) + 1;

    const [sale, updatedCourse, notification] = await Promise.all([
      prisma.sale.create({
        data: {
          amount: 1,
          itemId: course.id,
          price: Number(course.price),
          itemType: "COURSE",
          status: "CREATED",
          accountId,
          studentId,
        },
      }),
      prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          studenstNbr: newStudentNumber.toString(),
        },
      }),
      prisma.notification.create({
        data: {
          accountId,
          content: ` ${course.price} تم بيع دورة ب `,
        },
      }),
    ]);

    pusherServer.trigger(accountId, "incomming-notifications", notification);

    return sale;
  } catch (err) {
    console.log(err);
  }
};
