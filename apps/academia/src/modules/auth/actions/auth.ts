"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { withTenant } from "@/_internals/with-tenant";
import { signJWT } from "../lib/jwt";

const AUTH_MESSAGES = {
  invalidCredentials: "Invalid email or password",
  loginFailed: "Unable to sign in right now",
} as const;

export const loginUser = withTenant({
  input: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .max(320, "Email too long")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password too long"),
    remember: z.boolean().optional().default(false),
  }),

  handler: async ({ accountId, input, website, account, db }) => {
    try {
      // Find user by email and accountId
      const user = await db.student.findFirst({
        where: {
          email: input.email,
          accountId: accountId,
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        throw new Error(AUTH_MESSAGES.invalidCredentials);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error(AUTH_MESSAGES.invalidCredentials);
      }

      // Create JWT token
      const token = await signJWT({
        userId: user.id,
        email: user.email,
        accountId: accountId,
      });

      // Set cookie
      const cookieStore = await cookies();
      const maxAge = input.remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 1 day

      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
      });

      console.log(
        `User ${input.email} logged in to ${website.name} (${account.user_name})`
      );

      return {
        success: true,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
        },
        message: "Login successful",
      };
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes("invalid email or password") ||
          message.includes("invalid credentials")
        ) {
          throw new Error(AUTH_MESSAGES.invalidCredentials);
        }
      }

      throw new Error(AUTH_MESSAGES.loginFailed);
    }
  },
});

export const logoutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  return { success: true };
};
