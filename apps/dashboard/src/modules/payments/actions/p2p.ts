"use server";

import { withAuth } from "@/src/_internals/with-auth";
import z from "zod";
import { p2pConfigSchema } from "../schema";

export const connectP2p = withAuth({
  input: p2pConfigSchema,
  handler: async ({ input, account, db }) => {
    try {
      const config = {
        bankDetails: input.bankDetails,
        accountHolder: input.accountHolder,
        bankName: input.bankName,
        accountNumber: input.accountNumber,
        routingNumber: input.routingNumber,
        notes: input.notes,
      };

      // Check if P2P is already connected
      const existingP2p = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "P2P",
        },
      });

      if (existingP2p) {
        return {
          data: null,
          success: false,
          message: "P2P payment method is already connected",
        };
      }

      // Create new P2P connection
      const newConnection = await db.paymentMethodConfig.create({
        data: {
          provider: "P2P",
          accountId: account.id,
          config: JSON.stringify(config),
          isActive: true,
        },
      });

      return {
        data: newConnection,
        success: true,
        message: "P2P payment method connected successfully",
      };
    } catch (error) {
      console.error("Error connecting P2P:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to connect P2P payment method",
      };
    }
  },
});

// Update P2P payment method configuration
export const updateP2p = withAuth({
  input: p2pConfigSchema.extend({
    isActive: z.boolean().optional(),
  }),
  handler: async ({ input, account, db }) => {
    try {
      const config = {
        bankDetails: input.bankDetails,
        accountHolder: input.accountHolder,
        bankName: input.bankName,
        accountNumber: input.accountNumber,
        routingNumber: input.routingNumber,
        notes: input.notes,
      };

      // Find existing P2P connection
      const existingP2p = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "P2P",
        },
      });

      if (!existingP2p) {
        return {
          data: null,
          success: false,
          message:
            "P2P payment method is not connected. Please connect it first",
        };
      }

      // Prepare update data
      const updateData: any = {
        config: JSON.stringify(config),
      };

      // Only update isActive if it's provided
      if (input.isActive !== undefined) {
        updateData.isActive = input.isActive;
      }

      // Update existing connection
      const updatedConnection = await db.paymentMethodConfig.update({
        where: {
          id: existingP2p.id,
        },
        data: updateData,
      });

      return {
        data: updatedConnection,
        success: true,
        message: "P2P payment method updated successfully",
      };
    } catch (error) {
      console.error("Error updating P2P:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update P2P payment method",
      };
    }
  },
});

// Toggle P2P active status
export const toggleP2pStatus = withAuth({
  input: z.object({
    isActive: z.boolean(),
  }),
  handler: async ({ input, account, db }) => {
    try {
      // Find existing P2P connection
      const existingP2p = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "P2P",
        },
      });

      if (!existingP2p) {
        return {
          data: null,
          success: false,
          message: "P2P payment method is not connected",
        };
      }

      // Update the active status
      const updatedConnection = await db.paymentMethodConfig.update({
        where: {
          id: existingP2p.id,
        },
        data: {
          isActive: input.isActive,
        },
      });

      return {
        data: updatedConnection,
        success: true,
        message: `P2P payment method ${
          input.isActive ? "activated" : "deactivated"
        } successfully`,
      };
    } catch (error) {
      console.error("Error toggling P2P status:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to toggle P2P status",
      };
    }
  },
});

// Get P2P connection details
export const getP2pConnection = withAuth({
  handler: async ({ account, db }) => {
    try {
      const p2pConnection = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "P2P",
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

      if (!p2pConnection) {
        return {
          data: null,
          success: false,
          message: "P2P payment method is not connected",
        };
      }

      // Parse and return config (P2P details are typically not as sensitive as API keys)
      const config = JSON.parse(p2pConnection.config as unknown as string);

      return {
        data: {
          ...p2pConnection,
          config,
        },
        success: true,
        message: "P2P connection retrieved successfully",
      };
    } catch (error) {
      console.error("Error retrieving P2P connection:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve P2P connection",
      };
    }
  },
});

// Disconnect P2P payment method
export const disconnectP2p = withAuth({
  input: z.object({}),
  handler: async ({ account, db }) => {
    try {
      const existingP2p = await db.paymentMethodConfig.findFirst({
        where: {
          accountId: account.id,
          provider: "P2P",
        },
      });

      if (!existingP2p) {
        return {
          data: null,
          success: false,
          message: "P2P payment method is not connected",
        };
      }

      await db.paymentMethodConfig.delete({
        where: {
          id: existingP2p.id,
        },
      });

      return {
        data: { id: existingP2p.id },
        success: true,
        message: "P2P payment method disconnected successfully",
      };
    } catch (error) {
      console.error("Error disconnecting P2P:", error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to disconnect P2P payment method",
      };
    }
  },
});
