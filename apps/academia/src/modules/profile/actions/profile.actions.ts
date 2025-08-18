"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import { StudentProfile } from "../types";

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
