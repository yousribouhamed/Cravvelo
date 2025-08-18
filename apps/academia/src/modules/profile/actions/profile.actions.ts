"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import { StudentProfile } from "../types";
import z from "zod";

export const getUserProfile = withTenant({
  handler: async ({ db }) => {
    try {
      const user = await getCurrentUser();

      const student = await db.student.findFirst({
        where: {
          id: user?.userId,
        },
      });

      if (!student) {
        throw new Error("student not found");
      }

      return {
        data: student as unknown as StudentProfile | null,
        message: "success",
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: "error",
        success: false,
      };
    }
  },
});

export const updateStudentProfile = withTenant({
  input: z.object({
    full_name: z.string(),
    phone_number: z.string(),
    bio: z.string(),
    image_url: z.string(),
  }),
  handler: async ({ db, input }) => {
    try {
      const user = await getCurrentUser();

      console.log("this si the user input");
      console.log(input);
      const student = await db.student.update({
        where: {
          id: user?.userId,
          accountId: user?.accountId,
        },
        data: {
          bio: input.bio,
          full_name: input.full_name,
          phone: input.phone_number,
          photo_url: input.image_url,
        },
      });

      return {
        data: student,
        success: true,
        message: "profile updated",
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        success: false,
        message: "something went wrong",
      };
    }
  },
});
