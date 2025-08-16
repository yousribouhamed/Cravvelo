"use server";

import { z } from "zod";
import { withTenant } from "@/_internals/with-tenant";

export const confirmEmail = withTenant({
  input: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .max(320, "Email too long")
      .toLowerCase()
      .trim(),
    token: z.string().min(1, "Token is required").max(256, "Invalid token"),
  }),

  handler: async ({ accountId, input, website, account, db }) => {
    try {
      // Find user with matching email and token
      const user = await db.student.findFirst({
        where: {
          email: input.email,
          accountId: accountId,
          emailVerificationToken: input.token,
        },
      });

      if (!user) {
        throw new Error("Invalid verification token or email");
      }

      // Check if user is already verified
      if (user.emailVerified) {
        throw new Error("Email is already verified");
      }

      // Check if token has expired
      if (
        user.emailVerificationExpiry &&
        user.emailVerificationExpiry < new Date()
      ) {
        throw new Error("Verification token has expired");
      }

      // Update user as verified and clear verification fields
      const updatedUser = await db.student.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          emailVerificationToken: null,
          emailVerificationExpiry: null,
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          emailVerified: true,
          emailVerifiedAt: true,
        },
      });

      console.log(
        `Email verified for ${input.email} for ${website.name} (${account.user_name})`
      );

      return {
        success: true,
        user: updatedUser,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Error confirming email:", error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to confirm email");
    }
  },
});
