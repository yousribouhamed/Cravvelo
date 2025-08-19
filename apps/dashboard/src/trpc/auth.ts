import { publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import crypto from "crypto";

// Helper function to generate a unique machine ID
function generateMachineId(): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const combined = `${timestamp}-${randomBytes}`;
  return Buffer.from(combined).toString("base64url");
}

// Response type for better type safety
const AuthCallbackResponse = z.object({
  success: z.boolean(),
  accountId: z.string(),
  isNewUser: z.boolean().optional(),
});

export const auth = {
  authCallback: publicProcedure
    .output(AuthCallbackResponse)
    .query(async (): Promise<z.infer<typeof AuthCallbackResponse>> => {
      try {
        // Get current user from Clerk
        const user = await currentUser();

        // Validate user data
        if (!user?.id || !user?.emailAddresses?.[0]) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated or missing required data",
          });
        }

        // Check if account exists
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: user.id,
          },
        });

        if (existingAccount) {
          return {
            success: true,
            accountId: existingAccount.id,
            isNewUser: false,
          };
        }

        // Create new account
        const newAccount = await prisma.account.create({
          data: {
            userId: user.id,
            user_name:
              `${user.firstName} ${user.lastName}` || user.firstName || "User",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          accountId: newAccount.id,
          isNewUser: true,
        };
      } catch (error) {
        console.error("Auth callback error:", error);

        // Handle specific Clerk errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle database errors
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Account already exists",
          });
        }

        // Generic error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to authenticate user",
        });
      }
    }),
};
