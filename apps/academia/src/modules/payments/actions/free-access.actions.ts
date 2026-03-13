"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import { PurchaseStatus } from "@prisma/client";
import z from "zod";

type ItemType = "COURSE" | "PRODUCT";

function resolveAccessDates(plan: {
  pricingType: "FREE" | "ONE_TIME" | "RECURRING";
  recurringDays?: number | null;
  accessDuration?: "LIMITED" | "UNLIMITED" | null;
  accessDurationDays?: number | null;
}) {
  const accessStartDate = new Date();
  let accessEndDate: Date | null = null;
  let nextBillingDate: Date | null = null;

  if (plan.pricingType === "RECURRING" && plan.recurringDays) {
    accessEndDate = new Date(accessStartDate);
    accessEndDate.setDate(accessEndDate.getDate() + plan.recurringDays);
    nextBillingDate = new Date(accessStartDate);
    nextBillingDate.setDate(nextBillingDate.getDate() + plan.recurringDays);
  } else if (
    plan.pricingType === "ONE_TIME" &&
    plan.accessDuration === "LIMITED" &&
    plan.accessDurationDays
  ) {
    accessEndDate = new Date(accessStartDate);
    accessEndDate.setDate(accessEndDate.getDate() + plan.accessDurationDays);
  }

  return { accessStartDate, accessEndDate, nextBillingDate };
}

async function resolveItemAndPlan(
  tx: any,
  type: ItemType,
  itemId: string
): Promise<{
  itemId: string;
  itemTitle: string;
  plan: any;
}> {
  if (type === "COURSE") {
    const course = await tx.course.findUnique({
      where: { id: itemId },
      include: { CoursePricingPlans: { include: { PricingPlan: true } } },
    });
    if (!course) throw new Error("Course not found");

    const pricingPlan =
      course.CoursePricingPlans.find((p: { isDefault: boolean }) => p.isDefault) ??
      course.CoursePricingPlans[0];
    const plan = pricingPlan?.PricingPlan;
    if (!plan) throw new Error("No active pricing plan found");

    return { itemId: course.id, itemTitle: course.title, plan };
  }

  const product = await tx.product.findUnique({
    where: { id: itemId },
    include: { ProductPricingPlans: { include: { PricingPlan: true } } },
  });
  if (!product) throw new Error("Product not found");

  const pricingPlan =
    product.ProductPricingPlans.find((p: { isDefault: boolean }) => p.isDefault) ??
    product.ProductPricingPlans[0];
  const plan = pricingPlan?.PricingPlan;
  if (!plan) throw new Error("No active pricing plan found");

  return { itemId: product.id, itemTitle: product.title, plan };
}

export async function grantFreeItemAccessTx({
  tx,
  accountId,
  studentId,
  itemId,
  type,
  tenantCurrency,
}: {
  tx: any;
  accountId: string;
  studentId: string;
  itemId: string;
  type: ItemType;
  tenantCurrency: string;
}) {
  const now = new Date();
  const { itemTitle, plan } = await resolveItemAndPlan(tx, type, itemId);
  const normalizedPrice = Number(plan?.price ?? 0);
  const isFree = plan?.pricingType === "FREE" || normalizedPrice <= 0;

  if (!isFree) {
    throw new Error("This item is not free");
  }

  const existingPurchase = await tx.itemPurchase.findFirst({
    where: {
      studentId,
      itemType: type,
      itemId,
      status: PurchaseStatus.ACTIVE,
      OR: [{ accessEndDate: null }, { accessEndDate: { gte: now } }],
    },
  });

  if (existingPurchase) {
    return {
      success: true,
      alreadyOwned: true,
      itemTitle,
    };
  }

  const { accessStartDate, accessEndDate, nextBillingDate } = resolveAccessDates(plan);

  const sale = await tx.sale.create({
    data: {
      accountId,
      studentId,
      amount: 0,
      originalAmount: 0,
      status: "COMPLETED",
      itemType: type,
      itemId,
      price: 0,
      courseId: type === "COURSE" ? itemId : null,
      productId: type === "PRODUCT" ? itemId : null,
      customerNotes: "Auto-granted free access",
    },
  });

  await tx.payment.create({
    data: {
      type: type === "COURSE" ? "BUYCOURSE" : "BUYPRODUCT",
      amount: 0,
      status: "COMPLETED",
      currency: tenantCurrency,
      studentId,
      accountId,
      saleId: sale.id,
      description: `${type} free access: ${itemTitle}`,
      metadata: { reason: "FREE_ACCESS" },
    },
  });

  await tx.itemPurchase.create({
    data: {
      studentId,
      accountId,
      pricingPlanId: plan.id,
      itemType: type,
      itemId,
      purchaseAmount: 0,
      currency: tenantCurrency,
      status: PurchaseStatus.ACTIVE,
      accessStartDate,
      accessEndDate,
      nextBillingDate,
    },
  });

  if (type === "COURSE") {
    await tx.course.update({
      where: { id: itemId },
      data: { studentsNbr: { increment: 1 } },
    });
  }

  return {
    success: true,
    alreadyOwned: false,
    itemTitle,
  };
}

export const claimFreeItemAccess = withTenant({
  input: z.object({
    productId: z.string(),
    type: z.enum(["COURSE", "PRODUCT"]),
  }),
  handler: async ({ input, db, accountId, website }) => {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const tenantCurrency = website?.currency || "DZD";

    const result = await db.$transaction((tx) =>
      grantFreeItemAccessTx({
        tx,
        accountId,
        studentId: user.userId,
        itemId: input.productId,
        type: input.type,
        tenantCurrency,
      })
    );

    return {
      success: true,
      message: result.alreadyOwned
        ? "Access already granted"
        : "Free access granted successfully",
      alreadyOwned: result.alreadyOwned,
    };
  },
});
