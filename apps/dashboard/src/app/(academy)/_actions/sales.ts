"use server";

import { pusherServer } from "@/src/lib/pusher";
import { Course, Product } from "database";
import { prisma } from "database/src";
import { applayReferral } from "./auth";

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
      applayReferral(),
    ]);

    pusherServer.trigger(accountId, "incomming-notifications", notification);

    return sale;
  } catch (err) {
    console.log(err);
  }
};

export const create_product_sale = async ({
  accountId,
  product,
  studentId,
}: {
  product: Product;
  studentId: string;
  accountId: string;
}) => {
  try {
    const newStudentNumber = Number(product.numberOfDownloads) + 1;

    const [sale, updatedCourse, notification] = await Promise.all([
      prisma.sale.create({
        data: {
          amount: 1,
          itemId: product.id,
          price: Number(product.price),
          itemType: "PRODUCT",
          status: "CREATED",
          accountId,
          studentId,
        },
      }),
      prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          numberOfDownloads: newStudentNumber,
        },
      }),
      prisma.notification.create({
        data: {
          accountId,
          content: ` ${product.price} تم بيع المنتج ب `,
        },
      }),
      applayReferral(),
    ]);

    pusherServer.trigger(accountId, "incomming-notifications", notification);

    return sale;
  } catch (err) {
    console.log(err);
  }
};
