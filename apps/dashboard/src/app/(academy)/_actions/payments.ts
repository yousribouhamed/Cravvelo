"use server";

import { prisma } from "database/src";
import { buyWithCoupon } from "./coupon";
import { payWithChargily } from "./chargily";
import { getStudent } from "./auth";

/**
 * Apply a coupon to the price based on its type and amount.
 * @param couponCode - The code of the coupon to apply.
 * @param price - The original price before applying the coupon.
 * @returns The discounted price after applying the coupon.
 * @throws Error if the coupon is unavailable or invalid.
 */
export const applyCoupon = async ({
  couponCode,
  price,
}: {
  couponCode: string;
  price: number;
}) => {
  try {
    // Retrieve the coupon from the database
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode,
      },
    });

    // Check if the coupon is active and not archived
    if (!coupon.isActive || coupon.isArchive) {
      throw new Error("Coupon is unavailable");
    }

    // Apply different types of discounts based on coupon type
    if (coupon.discountType === "FIXED_AMOUNT") {
      return price - Number(coupon.discountAmount);
    }
    if (coupon.discountType === "PERCENTAGE") {
      const discountedPrice = reducePercentage(price, coupon.discountAmount);
      return discountedPrice;
    }
  } catch (err) {
    console.error(err);
    throw new Error("Coupon is unavailable");
  }
};

/**
 * Reduce a given number by a certain percentage.
 * @param number - The original number.
 * @param percentage - The percentage to reduce.
 * @returns The result after reducing the number by the given percentage.
 * @throws Error if the percentage is invalid.
 */
function reducePercentage(number: number, percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }

  const reductionAmount = (percentage / 100) * number;
  const result = number - reductionAmount;

  return result;
}

/**
 * Make a payment for courses with or without a coupon.
 * @param couponCode - The coupon code to apply (nullable).
 * @param productsId - Array of product IDs.
 * @param courcesId - Array of course IDs.
 * @param subdomain - The subdomain for the payment process.
 * @returns The payment URL or redirection URL.
 */
export const makePayment = async ({
  couponCode,
  productsId,
  courcesId,
  subdomain,
}: {
  couponCode: string | null;
  productsId: string[];
  courcesId: string[];
  subdomain: string | null;
}) => {
  try {
    // Fetch all the courses
    const courses = await Promise.all(
      courcesId.map((item) =>
        prisma.course.findFirst({
          where: {
            id: item,
          },
        })
      )
    );

    // Retrieve student information
    const student = await getStudent();

    // Validate courses and student
    if (!courses || courses?.length === 0) {
      throw new Error("No courses selected");
    }
    if (!student) {
      throw new Error("No student found");
    }

    // Calculate the total price of courses
    const total = courses
      .map((item) => Number(item?.price))
      .reduce((current, next) => current + next);

    // Check for NaN or zero price
    if (!total || total === 0) {
      throw new Error("Invalid total price");
    }

    // Process payment based on coupon presence
    if (!couponCode) {
      const paymentUrl = await payWithChargily({
        amount: total,
        metadata: {
          productId: courses[0].id,
          studentId: student.id,
        },
        product_name: courses[0].title,
        subdomain,
        success_url: `https://${subdomain}/student-library`,
      });
      return paymentUrl;
    }

    // Apply coupon and process payment accordingly
    const newPrice = await applyCoupon({ couponCode, price: total });

    if (newPrice === 0) {
      await buyWithCoupon({
        code: couponCode,
        courseId: courses[0].id,
      });
      return "/student-library";
    }

    const paymentUrl = await payWithChargily({
      amount: newPrice,
      metadata: {
        productId: courses[0]?.id,
        studentId: student?.id,
      },
      product_name: courses[0]?.title,
      subdomain,
      success_url: `https://${subdomain}/student-library`,
    });

    return paymentUrl;
  } catch (err) {
    console.error("Error occurred while processing payment");
    console.error(err);
  }
};
