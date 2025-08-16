"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { withTenant } from "@/_internals/with-tenant";

export const createUser = withTenant({
  input: z.object({
    full_name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name too long")
      .trim()
      .refine(
        (name) => !/[<>\"'&]/.test(name),
        "Name contains invalid characters"
      ),
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

      return {
        success: true,
        user: newUser,
        message: "User created successfully",
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
