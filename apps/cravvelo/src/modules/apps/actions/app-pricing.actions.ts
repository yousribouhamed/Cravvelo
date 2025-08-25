"use server";

import { withSuperAdminAuth } from "@/_internals/with-auth";
import { z } from "zod";

const setAppPricingSchema = z.object({
  appId: z.string().min(1, "App ID is required"),
  accountId: z.string().min(1, "Account ID is required"),
  name: z
    .string()
    .min(1, "Pricing plan name is required")
    .max(100, "Name too long"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().default("DZD"),
  recurringDays: z
    .number()
    .min(1, "Recurring days must be at least 1")
    .default(30),
  freeTrialDays: z
    .number()
    .min(0, "Free trial days must be 0 or greater")
    .default(0),
  isDefault: z.boolean().default(true),
});

const updateAppPricingSchema = z.object({
  appId: z.string().min(1, "App ID is required"),
  pricingPlanId: z.string().min(1, "Pricing plan ID is required"),
  name: z
    .string()
    .min(1, "Pricing plan name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater").optional(),
  recurringDays: z
    .number()
    .min(1, "Recurring days must be at least 1")
    .optional(),
  freeTrialDays: z
    .number()
    .min(0, "Free trial days must be 0 or greater")
    .optional(),
  isDefault: z.boolean().optional(),
});

const removeAppPricingSchema = z.object({
  appId: z.string().min(1, "App ID is required"),
  pricingPlanId: z.string().min(1, "Pricing plan ID is required"),
});

// Set pricing for an app (creates new pricing plan and links it to the app)
export const setAppPricing = withSuperAdminAuth({
  input: setAppPricingSchema,
  handler: async ({ input, db }) => {
    const {
      appId,
      accountId,
      name,
      description,
      price,
      currency,
      recurringDays,
      freeTrialDays,
      isDefault,
    } = input;

    // Check if app exists
    const app = await db.app.findUnique({
      where: { id: appId },
    });

    if (!app) {
      throw new Error("App not found");
    }

    // Check if account exists
    const account = await db.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // If this is going to be the default plan, unset other default plans for this app
    if (isDefault) {
      await db.appPricingPlan.updateMany({
        where: { appId },
        data: { isDefault: false },
      });
    }

    // Create the pricing plan
    const pricingPlan = await db.pricing.create({
      data: {
        accountId,
        name,
        description,
        pricingType: "RECURRING", // Apps are always subscription-based
        price,
        currency,
        accessDuration: "UNLIMITED", // Apps typically have unlimited access during subscription
        recurringDays,
        isActive: true,
        isDefault: false, // This is for the pricing table, not the app relationship
      },
    });

    // Create the app-pricing relationship
    const appPricingPlan = await db.appPricingPlan.create({
      data: {
        appId,
        pricingPlanId: pricingPlan.id,
        isDefault,
      },
    });

    // If free trial is specified, we could store it in metadata or create a separate free plan
    //@ts-expect-error this is an error
    if (freeTrialDays > 0) {
      await db.pricing.update({
        where: { id: pricingPlan.id },
        data: {
          description: description
            ? `${description} (Includes ${freeTrialDays}-day free trial)`
            : `${freeTrialDays}-day free trial included`,
        },
      });
    }

    return {
      pricingPlan,
      appPricingPlan,
      message: "App pricing set successfully",
    };
  },
  action: "SET_APP_PRICING",
});

// Update existing app pricing
export const updateAppPricing = withSuperAdminAuth({
  input: updateAppPricingSchema,
  handler: async ({ input, db }) => {
    const { appId, pricingPlanId, isDefault, ...updateData } = input;

    // Check if the app pricing plan exists
    const appPricingPlan = await db.appPricingPlan.findUnique({
      where: {
        appId_pricingPlanId: {
          appId,
          pricingPlanId,
        },
      },
      include: {
        PricingPlan: true,
      },
    });

    if (!appPricingPlan) {
      throw new Error("App pricing plan not found");
    }

    // If making this the default plan, unset other default plans for this app
    if (isDefault === true) {
      await db.appPricingPlan.updateMany({
        where: {
          appId,
          id: { not: appPricingPlan.id },
        },
        data: { isDefault: false },
      });
    }

    // Update the pricing plan
    const updatedPricingPlan = await db.pricing.update({
      where: { id: pricingPlanId },
      data: updateData,
    });

    // Update the app pricing plan relationship if needed
    if (isDefault !== undefined) {
      await db.appPricingPlan.update({
        where: { id: appPricingPlan.id },
        data: { isDefault },
      });
    }

    return {
      pricingPlan: updatedPricingPlan,
      message: "App pricing updated successfully",
    };
  },
  action: "UPDATE_APP_PRICING",
});

// Remove pricing plan from an app
export const removeAppPricing = withSuperAdminAuth({
  input: removeAppPricingSchema,
  handler: async ({ input, db }) => {
    const { appId, pricingPlanId } = input;

    // Check if the app pricing plan exists
    const appPricingPlan = await db.appPricingPlan.findUnique({
      where: {
        appId_pricingPlanId: {
          appId,
          pricingPlanId,
        },
      },
    });

    if (!appPricingPlan) {
      throw new Error("App pricing plan not found");
    }

    // Check if there are any active purchases for this pricing plan
    const activePurchases = await db.itemPurchase.count({
      where: {
        pricingPlanId,
        status: "ACTIVE",
      },
    });

    if (activePurchases > 0) {
      throw new Error(
        "Cannot remove pricing plan with active subscriptions. Please handle existing subscriptions first."
      );
    }

    // Remove the app pricing plan relationship
    await db.appPricingPlan.delete({
      where: { id: appPricingPlan.id },
    });

    // Optionally, you might want to keep the pricing plan for historical records
    // Or delete it if it's not used anywhere else
    const otherAppUsage = await db.appPricingPlan.count({
      where: { pricingPlanId },
    });

    const otherUsage = await Promise.all([
      db.coursePricingPlan.count({ where: { pricingPlanId } }),
      db.productPricingPlan.count({ where: { pricingPlanId } }),
    ]);

    const totalOtherUsage =
      otherAppUsage + otherUsage.reduce((sum, count) => sum + count, 0);

    if (totalOtherUsage === 0) {
      await db.pricing.delete({
        where: { id: pricingPlanId },
      });
    }

    return {
      message: "App pricing removed successfully",
    };
  },
  action: "REMOVE_APP_PRICING",
});

// Get all pricing plans for an app
export const getAppPricing = withSuperAdminAuth({
  input: z.object({
    appId: z.string().min(1, "App ID is required"),
  }),
  handler: async ({ input, db }) => {
    const { appId } = input;

    const appPricingPlans = await db.appPricingPlan.findMany({
      where: { appId },
      include: {
        PricingPlan: true,
        App: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    return {
      appPricingPlans,
      message: "App pricing plans retrieved successfully",
    };
  },
  action: "VIEW_APP_PRICING",
});

// Set default pricing plan for an app
export const setDefaultAppPricing = withSuperAdminAuth({
  input: z.object({
    appId: z.string().min(1, "App ID is required"),
    pricingPlanId: z.string().min(1, "Pricing plan ID is required"),
  }),
  handler: async ({ input, db }) => {
    const { appId, pricingPlanId } = input;

    // Check if the app pricing plan exists
    const appPricingPlan = await db.appPricingPlan.findUnique({
      where: {
        appId_pricingPlanId: {
          appId,
          pricingPlanId,
        },
      },
    });

    if (!appPricingPlan) {
      throw new Error("App pricing plan not found");
    }

    // Unset all default plans for this app
    await db.appPricingPlan.updateMany({
      where: { appId },
      data: { isDefault: false },
    });

    // Set the new default
    await db.appPricingPlan.update({
      where: { id: appPricingPlan.id },
      data: { isDefault: true },
    });

    return {
      message: "Default app pricing plan set successfully",
    };
  },
  action: "SET_DEFAULT_APP_PRICING",
});
