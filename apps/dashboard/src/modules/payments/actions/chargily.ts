"use server";

import { withAuth } from "@/src/_internals/with-auth";
import z from "zod";
import { chargilyConfigSchema } from "../schema";

export const connectChargily = withAuth({
  input: chargilyConfigSchema,
  handler: async ({ input, account, db }) => {
    try {
      const config = {
        publicKey: input.publicKey,
        secretKey: input.secretKey,
      };

      // Check if Chargily is already connected
      const existingChargily = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "CHARGILY",
        },
      });

      if (existingChargily) {
        return {
          data: null,
          success: false,
          message: "Chargily is already connected",
        };
      }

      // Create new Chargily connection
      const newConnection = await db.paymentMethodConfig.create({
        data: {
          provider: "CHARGILY",
          accountId: account.id,
          config: JSON.stringify(config),
          isActive: true,
        },
      });

      return {
        data: newConnection,
        success: true,
        message: "Chargily payment method connected successfully",
      };
    } catch (error) {
      console.error("Error connecting Chargily:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to connect Chargily payment method",
      };
    }
  },
});

export const updateChargily = withAuth({
  input: chargilyConfigSchema,
  handler: async ({ input, account, db }) => {
    try {
      const config = {
        publicKey: input.publicKey,
        secretKey: input.secretKey,
      };

      // Find existing Chargily connection
      const existingChargily = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "CHARGILY",
        },
      });

      if (!existingChargily) {
        return {
          data: null,
          success: false,
          message: "Chargily is not connected. Please connect it first",
        };
      }

      // Update existing connection
      const updatedConnection = await db.paymentMethodConfig.update({
        where: {
          id: existingChargily.id,
        },
        data: {
          config: JSON.stringify(config),
          isActive: true,
        },
      });

      return {
        data: updatedConnection,
        success: true,
        message: "Chargily payment method updated successfully",
      };
    } catch (error) {
      console.error("Error updating Chargily:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update Chargily payment method",
      };
    }
  },
});

export const getChargilyConnection = withAuth({
  handler: async ({ account, db }) => {
    try {
      const chargilyConnection = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "CHARGILY",
        },
        select: {
          id: true,
          provider: true,
          config: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
        },
      });

      if (!chargilyConnection) {
        return {
          data: null,
          success: false,
          message: "Chargily payment method is not connected",
        };
      }

      const config = JSON.parse(
        chargilyConnection?.config as unknown as string
      );
      const sanitizedConfig = {
        publicKey: config.publicKey,
        // Don't return secret key for security
        secretKey: config.secretKey,
      };

      return {
        data: {
          ...chargilyConnection,
          config: sanitizedConfig,
        },
        success: true,
        message: "Chargily connection retrieved successfully",
      };
    } catch (error) {
      console.error("Error retrieving Chargily connection:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve Chargily connection",
      };
    }
  },
});

export const activateConnectionChargily = withAuth({
  input: z.object({}),
  handler: async ({ account, db }) => {
    try {
      const existingChargily = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "CHARGILY",
        },
      });

      if (!existingChargily) {
        return {
          data: null,
          success: false,
          message: "Chargily is not connected",
        };
      }

      await db.paymentMethodConfig.update({
        where: {
          id: existingChargily.id,
        },
        data: {
          isActive: true,
        },
      });

      return {
        data: { id: existingChargily.id },
        success: true,
        message: "Chargily payment method disconnected successfully",
      };
    } catch (error) {
      console.error("Error disconnecting Chargily:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to disconnect Chargily payment method",
      };
    }
  },
});

export const disconnectChargily = withAuth({
  input: z.object({}),
  handler: async ({ account, db }) => {
    try {
      const existingChargily = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "CHARGILY",
        },
      });

      if (!existingChargily) {
        return {
          data: null,
          success: false,
          message: "Chargily is not connected",
        };
      }

      await db.paymentMethodConfig.update({
        where: {
          id: existingChargily.id,
        },
        data: {
          isActive: false,
        },
      });

      return {
        data: { id: existingChargily.id },
        success: true,
        message: "Chargily payment method disconnected successfully",
      };
    } catch (error) {
      console.error("Error disconnecting Chargily:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to disconnect Chargily payment method",
      };
    }
  },
});
