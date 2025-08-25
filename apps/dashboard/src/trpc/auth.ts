import { publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "database/src";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

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

        // Check if account exists with wallet included
        const existingAccount = await prisma.account.findUnique({
          where: {
            userId: user.id,
          },
          include: {
            Wallet: true,
          },
        });

        if (existingAccount) {
          // Create wallet if it doesn't exist for existing account
          if (!existingAccount.Wallet) {
            await prisma.wallet.create({
              data: {
                accountId: existingAccount.id,
                balance: 0,
                currency: "DZD",
                isActive: true,
              },
            });
          }

          return {
            success: true,
            accountId: existingAccount.id,
            isNewUser: false,
          };
        }

        // Create new account with wallet in a transaction
        const result = await prisma.$transaction(async (tx) => {
          // Create the account
          const newAccount = await tx.account.create({
            data: {
              userId: user.id,
              user_name: constructUserName(user),
              // Set default values that aren't handled by schema defaults
              verified: false,
              verification_steps: 0,
              profileCompleted: false,
              isActive: true,
            },
          });

          // Create the wallet
          await tx.wallet.create({
            data: {
              accountId: newAccount.id,
              balance: 0,
              currency: "DZD",
              isActive: true,
            },
          });

          return newAccount;
        });

        return {
          success: true,
          accountId: result.id,
          isNewUser: true,
        };
      } catch (error) {
        console.error("Auth callback error:", error);

        // Handle specific Clerk errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle database errors
        if (error?.code === "P2002") {
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

// Helper function to construct user name
function constructUserName(user: any): string {
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  // Fallback to email username or default
  const email = user.emailAddresses?.[0]?.emailAddress;
  if (email) {
    return email.split("@")[0];
  }

  return "User";
}
