"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import z from "zod";
import { PurchaseStatus } from "@prisma/client";

export const checkCourseOwnership = withTenant({
  input: z.object({
    courseId: z.string(),
  }),
  handler: async ({ db, input }) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return {
          data: false,
          success: true,
          message: "User not authenticated",
        };
      }

      // Check if student has an active ItemPurchase for this course
      const itemPurchase = await db.itemPurchase.findFirst({
        where: {
          studentId: user.userId,
          itemType: "COURSE",
          itemId: input.courseId,
          status: PurchaseStatus.ACTIVE,
          OR: [
            { accessEndDate: null }, // Unlimited access
            { accessEndDate: { gte: new Date() } }, // Access not expired
          ],
        },
      });

      if (itemPurchase) {
        return {
          data: true,
          success: true,
          message: "Course is owned",
        };
      }

      // Fallback path: allow access for already completed course payments even if ItemPurchase is missing.
      const completedPayment = await db.payment.findFirst({
        where: {
          studentId: user.userId,
          status: "COMPLETED",
          Sale: {
            is: {
              itemType: "COURSE",
              itemId: input.courseId,
              status: "COMPLETED",
            },
          },
        },
        include: {
          Sale: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!completedPayment || !completedPayment.Sale) {
        return {
          data: false,
          success: true,
          message: "Course is not owned",
        };
      }

      // Self-heal: create missing ItemPurchase from completed payment (idempotent).
      const course = await db.course.findUnique({
        where: { id: input.courseId },
        include: {
          CoursePricingPlans: { include: { PricingPlan: true } },
        },
      });

      const pricingPlan =
        course?.CoursePricingPlans?.find((p: any) => p.isDefault) ??
        course?.CoursePricingPlans?.[0];
      const plan = pricingPlan?.PricingPlan ?? null;

      if (plan?.id) {
        const accessStartDate = new Date();
        let accessEndDate: Date | null = null;

        if (plan.pricingType === "RECURRING" && plan.recurringDays) {
          accessEndDate = new Date(accessStartDate);
          accessEndDate.setDate(accessEndDate.getDate() + plan.recurringDays);
        } else if (
          plan.pricingType === "ONE_TIME" &&
          plan.accessDuration === "LIMITED" &&
          plan.accessDurationDays
        ) {
          accessEndDate = new Date(accessStartDate);
          accessEndDate.setDate(accessEndDate.getDate() + plan.accessDurationDays);
        }

        await db.itemPurchase.create({
          data: {
            studentId: user.userId,
            accountId: completedPayment.Sale.accountId,
            pricingPlanId: plan.id,
            itemType: "COURSE",
            itemId: input.courseId,
            purchaseAmount: completedPayment.amount,
            currency: completedPayment.currency || "DZD",
            status: PurchaseStatus.ACTIVE,
            accessStartDate,
            accessEndDate,
            nextBillingDate:
              plan.pricingType === "RECURRING" && plan.recurringDays
                ? (() => {
                    const next = new Date(accessStartDate);
                    next.setDate(next.getDate() + plan.recurringDays);
                    return next;
                  })()
                : null,
          },
        });
      }

      return {
        data: true,
        success: true,
        message: "Course is owned (payment fallback)",
      };
    } catch (error) {
      console.error("Error checking course ownership:", error);
      return {
        data: false,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while checking ownership",
      };
    }
  },
});
