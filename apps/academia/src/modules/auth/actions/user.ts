"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { withTenant } from "@/_internals/with-tenant";
import { signJWT } from "../lib/jwt";

export const createUser = withTenant({
  input: z.object({
    full_name: z.string(),
    email: z
      .string()
      .email("Invalid email format")
      .max(320, "Email too long")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    remember: z.boolean().optional().default(false), // Added for auto-login
  }),

  handler: async ({ accountId, input, website, account, db }) => {
    try {
      // Check if user already exists
      const existingUser = await db.student.findFirst({
        where: {
          email: input.email,
          accountId: accountId,
        },
      });

      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(input.password, saltRounds);

      // Create new user
      const newUser = await db.student.create({
        data: {
          full_name: input.full_name,
          email: input.email,
          password: hashedPassword,
          accountId: accountId,
          bag: {},
          createdAt: new Date(),
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          createdAt: true,
        },
      });

      console.log(
        `Created user ${input.email} for ${website.name} (${account.user_name})`
      );

      // AUTO-LOGIN: Create JWT token and set cookie
      const token = await signJWT({
        userId: newUser.id,
        email: newUser.email,
        accountId: accountId,
      });

      // Set authentication cookie
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
        `User ${input.email} automatically logged in after signup for ${website.name} (${account.user_name})`
      );

      return {
        success: true,
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        message: "User created and logged in successfully",
        isLoggedIn: true, // Flag to indicate auto-login occurred
      };
    } catch (error) {
      console.error("Error creating user:", error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to create user");
    }
  },
});
