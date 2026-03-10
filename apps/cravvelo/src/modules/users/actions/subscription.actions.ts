"use server";

import { withAuth } from "@/_internals/with-auth";
import { ROLES } from "@/_internals/auth-types";
import { z } from "zod";

const PLAN_CODES = ["BASIC", "STARTER", "GROWTH", "SCALE"] as const;
const BILLING_CYCLES = ["MONTHLY", "YEARLY"] as const;

const updateSubscriptionSchema = z.object({
  accountId: z.string().min(1),
  planCode: z.enum(PLAN_CODES),
  billingCycle: z.enum(BILLING_CYCLES),
});

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

function addPeriod(date: Date, cycle: "MONTHLY" | "YEARLY"): Date {
  const d = new Date(date);
  if (cycle === "MONTHLY") {
    d.setMonth(d.getMonth() + 1);
  } else {
    d.setFullYear(d.getFullYear() + 1);
  }
  return d;
}

export const updateUserSubscription = withAuth({
  input: updateSubscriptionSchema,
  auth: {
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  handler: async ({ input, db }) => {
    const { accountId, planCode, billingCycle } = input;

    const account = await db.account.findUnique({
      where: { id: accountId },
      select: { id: true },
    });

    if (!account) {
      return { success: false, error: "Account not found" };
    }

    const now = new Date();
    const currentPeriodEnd = addPeriod(now, billingCycle);

    await db.$transaction(async (tx) => {
      const active = await tx.accountSubscription.findFirst({
        where: { accountId, status: "ACTIVE" },
      });

      if (active) {
        await tx.accountSubscription.update({
          where: { id: active.id },
          data: { status: "CANCELLED" },
        });
      }

      await tx.accountSubscription.create({
        data: {
          accountId,
          planCode,
          billingCycle,
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd,
        },
      });
    });

    return { success: true };
  },
});
