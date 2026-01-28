"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";
import z from "zod";

export const getStudentSettings = withTenant({
  handler: async ({ db }) => {
    try {
      const user = await getCurrentUser();

      const student = await db.student.findFirst({
        where: {
          id: user?.userId,
        },
        select: {
          preferredLanguage: true,
          timezone: true,
          emailNotifications: true,
          smsNotifications: true,
        },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      return {
        data: student,
        message: "Successfully fetched student settings",
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: "Failed to fetch student settings",
        success: false,
      };
    }
  },
});

export const updateStudentSettings = withTenant({
  input: z.object({
    preferredLanguage: z.enum(["ARABIC", "ENGLISH", "FRENCH"]).optional(),
    timezone: z.string().optional(),
    emailNotifications: z.boolean().optional(),
    smsNotifications: z.boolean().optional(),
  }),
  handler: async ({ db, input }) => {
    try {
      const user = await getCurrentUser();

      const student = await db.student.update({
        where: {
          id: user?.userId,
          accountId: user?.accountId,
        },
        data: {
          ...(input.preferredLanguage && {
            preferredLanguage: input.preferredLanguage,
          }),
          ...(input.timezone !== undefined && { timezone: input.timezone }),
          ...(input.emailNotifications !== undefined && {
            emailNotifications: input.emailNotifications,
          }),
          ...(input.smsNotifications !== undefined && {
            smsNotifications: input.smsNotifications,
          }),
        },
      });

      return {
        data: student,
        success: true,
        message: "Settings updated successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        success: false,
        message: "Failed to update settings",
      };
    }
  },
});
