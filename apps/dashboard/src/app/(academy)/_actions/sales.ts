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

    const notification = await prisma.notification.create({
      data: {
        accountId,
        content: `لديك بيع جديد`,
      },
    });

    pusherServer.trigger(accountId, "incomming-notifications", notification);

    return sale;
  } catch (err) {
    console.log(err);
  }
};
