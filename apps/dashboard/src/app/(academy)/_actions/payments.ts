"use server";

import { prisma } from "database/src";
import { buyWithCoupon } from "./coupon";
import { payWithChargily } from "./chargily";
import { getStudent } from "./auth";
import { redirect } from "next/navigation";

export const applayCoupon = async ({
  couponCode,
  price,
}: {
  couponCode: string;
  price: number;
}) => {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode,
      },
    });

    if (!coupon.isActive || coupon.isArchive) {
      throw new Error("coupon is unvailable");
    }

    if (coupon.discountType === "FIXED_AMOUNT") {
      return price - Number(coupon.discountAmount);
    }
    if (coupon.discountType === "PERCENTAGE") {
      const value = reducePercentage(price, coupon.discountAmount);
      return value;
    }
  } catch (err) {
    console.error(err);
    throw new Error("coupon is unvailable");
  }
};

function reducePercentage(number: number, percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }

  const reductionAmount = (percentage / 100) * number;
  const result = number - reductionAmount;
  return result;
}

export const makePayment = async ({
  couponCode,
  productsId,
  courcesId,
  subdomain,
}: {
  couponCode: string | null;
  productsId: string[];
  courcesId: string[];
  subdomain: string;
}) => {
  try {
    // fetch all the products ,
    const products = await Promise.all(
      productsId.map((item) =>
        prisma.product.findFirst({
          where: {
            id: item,
          },
        })
      )
    );
    // fetch all the courses
    const courses = await Promise.all(
      courcesId.map((item) =>
        prisma.course.findFirst({
          where: {
            id: item,
          },
        })
      )
    );

    // applay the coupon if the code exists

    const total =
      products
        .map((item) => Number(item.price))
        .reduce((current, next) => current + next) +
      courses
        .map((item) => Number(item.price))
        .reduce((current, next) => current + next);

    if (total === 0) {
      return;
    }

    if (!couponCode) {
      const student = await getStudent();
      await payWithChargily({
        amount: total,
        metadata: {
          productId: courses[0].id,
          studentId: student.id,
        },
        product_name: courses[0].title,
        subdomain,
        success_url: "https://jadir.vercel.app",
      });

      return;
    }

    const newPrice = await applayCoupon({ couponCode, price: total });

    if (newPrice === 0) {
      await buyWithCoupon({
        code: couponCode,
        courseId: courses[0].id,
      });
      redirect("/student-library");
    }
  } catch (err) {
    console.error("there is an error while trying to make a payment");
    console.error(err);
  }
};
