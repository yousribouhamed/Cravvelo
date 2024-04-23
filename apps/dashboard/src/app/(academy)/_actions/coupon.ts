"use server";

import { prisma } from "database/src";
import { getStudent } from "./auth";
import { StudentBag } from "@/src/types";
import { Course } from "database";
import { create_course_sale } from "./sales";

/**
 * This function facilitates the process of purchasing a course using a coupon code.
 * It verifies the validity of the coupon code, applies the discount if applicable,
 * and updates the student's bag with the purchased course.
 * @param code The coupon code.
 * @param courseId The ID of the course to be purchased.
 */
export const buyWithCoupon = async ({
  code,
  courseId,
}: {
  code: string;
  courseId: string;
}) => {
  try {
    // Retrieve essential data concurrently: student, coupon, and course.
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

    // Verify if the coupon exists.
    if (!coupon) {
      throw new Error("Coupon code is not valid.");
    }

    // Verify if the coupon is active.
    if (!coupon.isActive) {
      throw new Error("Coupon code is not valid.");
    }

    // Apply discount for FIXED_AMOUNT type coupons.
    if (coupon.discountType === "FIXED_AMOUNT") {
      if (Number(coupon.discountAmount) < Number(course.price)) {
        throw new Error("Coupon code is not valid.");
      }

      // Update the student's bag with the purchased course.
      const studentbag = JSON.parse(student.bag as string) as StudentBag;
      const newBag = await addCourseToStudentBag({
        bag: studentbag,
        course: course,
      });
      await prisma.student.update({
        where: {
          id: student.id,
        },
        data: {
          bag: JSON.stringify(newBag),
        },
      });

      if (Number(coupon.usageLimit) >= Number(coupon.usageCount)) {
        await prisma.coupon.update({
          where: {
            id: coupon.id,
          },
          data: {
            isActive: false,
          },
        });
      } else {
        await prisma.coupon.update({
          where: {
            id: coupon.id,
          },
          data: {
            usageCount: Number(coupon.usageCount) + 1,
          },
        });
      }
    }

    // Apply discount for PERCENTAGE type coupons.
    if (coupon.discountType === "PERCENTAGE") {
      if (Number(coupon.discountAmount) !== 100) {
        throw new Error("Coupon code is not valid.");
      }

      // Update the student's bag with the purchased course.
      const studentbag = JSON.parse(student.bag as string) as StudentBag;
      const newBag = await addCourseToStudentBag({
        bag: studentbag,
        course: course,
      });
      await prisma.student.update({
        where: {
          id: student.id,
        },
        data: {
          bag: JSON.stringify(newBag),
        },
      });

      if (Number(coupon.usageLimit) >= Number(coupon.usageCount)) {
        await prisma.coupon.update({
          where: {
            id: coupon.id,
          },
          data: {
            isActive: false,
          },
        });
      } else {
        await prisma.coupon.update({
          where: {
            id: coupon.id,
          },
          data: {
            usageCount: Number(coupon.usageCount) + 1,
          },
        });
      }
    }
    await create_course_sale({
      accountId: coupon.accountId,
      course,
      studentId: student.id,
    });
  } catch (error) {
    // Handle any errors that occur during the purchase process.
    console.error("Error while processing the purchase:", error);

    throw error; // Re-throwing the error for higher-level handling, if necessary.
  }
};

/**
 * Adds a course to the student's bag if it doesn't already exist.
 * @param bag The current student's bag containing courses.
 * @param course The course to be added to the bag.
 * @returns The updated student's bag.
 */
export const addCourseToStudentBag = ({
  bag,
  course,
}: {
  bag: StudentBag;
  course: Course;
}): StudentBag => {
  // Check if the course already exists in the student's bag.
  const theCourseExists =
    bag?.courses && bag?.courses?.find((item) => item.course.id === course.id);

  // If the course already exists, return the current bag without modification.
  if (theCourseExists) {
    return bag;
  }

  // If the course doesn't exist, create a new student bag with the added course.

  const oldData = bag.courses && bag.courses.length > 0 ? [...bag.courses] : [];
  const newStudentBag = {
    courses: [
      ...oldData,
      {
        course,
        currentEpisode: 0,
      },
    ],
  } as StudentBag;

  console.log("here it is the current student bag");
  console.log(newStudentBag);

  return newStudentBag;
};
