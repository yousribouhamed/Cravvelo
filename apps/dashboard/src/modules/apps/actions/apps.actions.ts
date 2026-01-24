"use server";

import { withAuth } from "@/src/_internals/with-auth";
import z from "zod";
import { AppType } from "../types";

export const getAllApps = withAuth({
  handler: async ({ db }) => {
    try {
      const apps = await db.app.findMany();

      return {
        data: apps as AppType[],
        message: "we got the apps",
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        message: "we got the apps",
        success: false,
      };
    }
  },
});

export const getAppById = withAuth({
  input: z.object({
    appId: z.string(),
  }),
  handler: async ({ db, input }) => {
    try {
      const app = await db.app.findMany({
        where: {
          id: input.appId,
        },
        include: {
          AppPricingPlans: true,
        },
      });

      return {
        data: app,
        message: "we got the apps",
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        message: "we got the apps",
        success: false,
      };
    }
  },
});

export const installApp = withAuth({
  input: z.object({
    appId: z.string(),
    pricingPlanId: z.string().optional(), // user may select a plan
  }),
  handler: async ({ db, input, account }) => {
    if (!account) {
      throw new Error("Only accounts can install apps.");
    }

    return await db.$transaction(async (tx) => {
      // 0. Check if app is already installed for this account
      const existingInstall = await tx.appInstall.findFirst({
        where: {
          appId: input.appId,
          accountId: account.id,
          status: "ACTIVE",
        },
      });

      if (existingInstall) {
        throw new Error("هذا التطبيق مثبت بالفعل على حسابك");
      }

      // 1. Fetch the app & its pricing plans
      const app = await tx.app.findUnique({
        where: { id: input.appId },
        include: {
          AppPricingPlans: {
            include: {
              PricingPlan: true,
            },
          },
        },
      });

      if (!app) {
        throw new Error("App not found");
      }

      // 2. Determine pricing plan
      let pricingPlan;

      if (input.pricingPlanId) {
        pricingPlan = await tx.appPricingPlan.findUnique({
          where: { id: input.pricingPlanId },
          include: { PricingPlan: true },
        });
      } else {
        pricingPlan = app.AppPricingPlans.find((p) => p.isDefault);
      }

      if (!pricingPlan || !pricingPlan.PricingPlan) {
        throw new Error("Pricing plan not found");
      }

      const selectedPlan = pricingPlan.PricingPlan;

      // 3. Create Payment (pending)
      const payment = await tx.payment.create({
        data: {
          type: "SUBSCRIPTION",
          status: "PENDING",
          accountId: account.id,
          amount: selectedPlan.price ?? 0,
          currency: selectedPlan.currency,
        },
      });

      // 4. Create Invoice linked to Payment & Account
      const invoice = await tx.invoice.create({
        data: {
          paymentId: payment.id,
          accountId: account.id,
          status: "PENDING",
          amount: selectedPlan.price ?? 0,
        },
      });

      // 5. Create AppInstall with snapshot of pricing plan
      const appInstall = await tx.appInstall.create({
        data: {
          appId: app.id,
          accountId: account.id,
          paymentId: payment.id,
          currency: selectedPlan.currency,
          planName: selectedPlan.name,
          subscriptionAmount: selectedPlan.price,
          trialDays: selectedPlan.trialDays,
          recurringDays: selectedPlan.accessDurationDays,
          isRecurring: true,
        },
      });

      return {
        success: true,
        message: "App installed successfully (pending payment)",
        data: { payment, invoice, appInstall },
      };
    });
  },
});

export const uninstallApp = withAuth({
  input: z.object({
    appId: z.string(),
  }),
  handler: async ({ db, input, account }) => {
    if (!account) {
      throw new Error("Only accounts can uninstall apps.");
    }

    try {
      // Find the active installation for this app and account
      const appInstall = await db.appInstall.findFirst({
        where: {
          appId: input.appId,
          accountId: account.id,
          status: "ACTIVE",
        },
      });

      if (!appInstall) {
        throw new Error("App installation not found or already uninstalled");
      }

      // Update the installation status to CANCELLED and set uninstalledAt
      const updatedInstall = await db.appInstall.update({
        where: {
          id: appInstall.id,
        },
        data: {
          status: "CANCELLED",
          uninstalledAt: new Date(),
        },
      });

      return {
        success: true,
        message: "App uninstalled successfully",
        data: updatedInstall,
      };
    } catch (error) {
      console.error("Error uninstalling app:", error);
      throw error;
    }
  },
});

export const checkAppInstalled = withAuth({
  input: z.object({
    appId: z.string(),
  }),
  handler: async ({ db, input, account }) => {
    if (!account) {
      return {
        success: false,
        message: "Only accounts can check app installation status",
        data: false,
      };
    }

    try {
      const appInstall = await db.appInstall.findFirst({
        where: {
          appId: input.appId,
          accountId: account.id,
          status: "ACTIVE",
        },
        include: {
          App: true,
        },
      });

      return {
        success: true,
        message: "App installation status checked",
        data: !!appInstall,
        installation: appInstall || null,
      };
    } catch (error) {
      console.error("Error checking app installation:", error);
      return {
        success: false,
        message: "An error occurred while checking app installation",
        data: false,
      };
    }
  },
});

export const getInstalledApps = withAuth({
  handler: async ({ db, account }) => {
    // Only accounts can fetch installed apps
    if (!account) {
      return {
        success: false,
        message: "Only accounts can view installed apps",
        data: [],
      };
    }

    try {
      const installedApps = await db.appInstall.findMany({
        where: {
          accountId: account.id, // Fetch apps installed by this account
          status: "ACTIVE", // Only show active installations
        },
        include: {
          App: true, // Include app details (name, icon, etc.)
        },
      });

      return {
        success: true,
        message: "Installed apps fetched successfully",
        data: installedApps,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: "An error occurred while fetching installed apps",
        data: [],
      };
    }
  },
});
