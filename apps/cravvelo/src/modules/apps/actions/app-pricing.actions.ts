"use server";

import { withAuth, withSuperAdminAuth } from "@/_internals/with-auth";
import { z } from "zod";

const setAppPricingSchema = z.object({
  appId: z.string().min(1, "App ID is required"),
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
export const setAppPricing = withAuth({
  input: setAppPricingSchema,
  handler: async ({ input, db, admin }) => {
    const {
      appId,
      name,
      description,
      price,
      currency,
      recurringDays,
      freeTrialDays,
      isDefault,
    } = input;

    console.log("function called");

    // Use Promise.all to check app and account existence in parallel
    const [app, account] = await Promise.all([
      db.app.findUnique({
        where: { id: appId },
        select: { id: true, name: true },
      }),
      db.account.findUnique({
        where: { userId: admin.id },
        select: { id: true, userId: true, isActive: true },
      }),
    ]);

    if (!app) {
      throw new Error("App not found");
    }

    if (!account) {
      throw new Error("Account not found");
    }

    if (!account.isActive) {
      throw new Error("Account is not active");
    }

    // Verify that the account belongs to the current admin (security check)
    if (account.userId !== admin.id) {
      throw new Error("Unauthorized: Account does not belong to current admin");
    }

    console.log("validations passed");

    // Use transaction to handle all database operations atomically
    const result = await db.$transaction(async (tx) => {
      // If this is going to be the default plan, unset other default plans for this app
      if (isDefault) {
        await tx.appPricingPlan.updateMany({
          where: { appId },
          data: { isDefault: false },
        });
      }

      console.log("default plans updated");

      // Create the pricing plan
      const pricingPlan = await tx.pricing.create({
        data: {
          accountId: account.id,
          name,
          description:
            freeTrialDays && freeTrialDays > 0
              ? description
                ? `${description} (Includes ${freeTrialDays}-day free trial)`
                : `${freeTrialDays}-day free trial included`
              : description,
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
      const appPricingPlan = await tx.appPricingPlan.create({
        data: {
          appId,
          pricingPlanId: pricingPlan.id,
          isDefault,
        },
      });

      console.log("pricing plan and app relationship created");

      return { pricingPlan, appPricingPlan };
    });

    return {
      ...result,
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
        PricingPlan: {
          select: {
            id: true,
            name: true,
            price: true,
            accountId: true,
          },
        },
      },
    });

    if (!appPricingPlan) {
      throw new Error("App pricing plan not found");
    }

    // Use transaction to handle all updates atomically
    const result = await db.$transaction(async (tx) => {
      // If making this the default plan, unset other default plans for this app
      if (isDefault === true) {
        await tx.appPricingPlan.updateMany({
          where: {
            appId,
            id: { not: appPricingPlan.id },
          },
          data: { isDefault: false },
        });
      }

      // Use Promise.all to update both pricing plan and app relationship in parallel
      const updatePromises = [];

      // Update the pricing plan if there's update data
      if (Object.keys(updateData).length > 0) {
        updatePromises.push(
          tx.pricing.update({
            where: { id: pricingPlanId },
            data: updateData,
          })
        );
      }

      // Update the app pricing plan relationship if needed
      if (isDefault !== undefined) {
        updatePromises.push(
          tx.appPricingPlan.update({
            where: { id: appPricingPlan.id },
            data: { isDefault },
          })
        );
      }

      const [updatedPricingPlan] = await Promise.all(updatePromises);

      return { updatedPricingPlan };
    });

    return {
      pricingPlan: result.updatedPricingPlan,
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

    // Use Promise.all to check active purchases and other usage in parallel
    const [
      activePurchases,
      otherAppUsage,
      coursePricingUsage,
      productPricingUsage,
    ] = await Promise.all([
      db.itemPurchase.count({
        where: {
          pricingPlanId,
          status: "ACTIVE",
        },
      }),
      db.appPricingPlan.count({
        where: {
          pricingPlanId,
          id: { not: appPricingPlan.id }, // Exclude current relationship
        },
      }),
      db.coursePricingPlan.count({
        where: { pricingPlanId },
      }),
      db.productPricingPlan.count({
        where: { pricingPlanId },
      }),
    ]);

    if (activePurchases > 0) {
      throw new Error(
        "Cannot remove pricing plan with active subscriptions. Please handle existing subscriptions first."
      );
    }

    const totalOtherUsage =
      otherAppUsage + coursePricingUsage + productPricingUsage;

    // Use transaction to handle removal atomically
    await db.$transaction(async (tx) => {
      // Remove the app pricing plan relationship
      await tx.appPricingPlan.delete({
        where: { id: appPricingPlan.id },
      });

      // Delete pricing plan if it's not used anywhere else
      if (totalOtherUsage === 0) {
        await tx.pricing.delete({
          where: { id: pricingPlanId },
        });
      }
    });

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
        PricingPlan: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            recurringDays: true,
            isActive: true,
            createdAt: true,
            accountId: true,
          },
        },
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

    const plans = appPricingPlans.map((item) => ({
      id: item.id,
      pricingPlanId: item.PricingPlan.id,
      appId: item.appId,
      accountId: item.PricingPlan.accountId,
      name: item.PricingPlan.name,
      description: item.PricingPlan.description,
      price: item.PricingPlan.price,
      currency: item.PricingPlan.currency,
      recurringDays: item.PricingPlan.recurringDays,
      isDefault: item.isDefault,
      isActive: item.PricingPlan.isActive,
      createdAt: item.PricingPlan.createdAt,
      app: item.App,
    }));

    return {
      data: plans,
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

    // Use transaction to handle default setting atomically
    await db.$transaction(async (tx) => {
      // Use Promise.all to unset all defaults and set new default in parallel
      await Promise.all([
        tx.appPricingPlan.updateMany({
          where: {
            appId,
            id: { not: appPricingPlan.id },
          },
          data: { isDefault: false },
        }),
        tx.appPricingPlan.update({
          where: { id: appPricingPlan.id },
          data: { isDefault: true },
        }),
      ]);
    });

    return {
      message: "Default app pricing plan set successfully",
    };
  },
  action: "SET_DEFAULT_APP_PRICING",
});

// Helper function to get admin's account ID
export const getAdminAccountId = withAuth({
  input: z.object({}),
  handler: async ({ db, admin }) => {
    const account = await db.account.findFirst({
      where: {
        userId: admin.id,
        isActive: true,
      },
      select: {
        id: true,
        company: true,
        isActive: true,
        isSuspended: true,
      },
    });

    if (!account) {
      throw new Error("No active account found for current admin");
    }

    if (account.isSuspended) {
      throw new Error("Account is suspended");
    }

    return {
      accountId: account.id,
      company: account.company,
      message: "Account ID retrieved successfully",
    };
  },
  action: "GET_ADMIN_ACCOUNT",
});
