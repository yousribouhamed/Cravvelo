"use server";

import { z } from "zod";
import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";

export const getMyReferral = withTenant({
  handler: async ({ db, accountId, website }) => {
    try {
      const enableReferral = !!website.enableReferral;
      if (!enableReferral) {
        return { referral: null, enableReferral: false, success: true };
      }

      const user = await getCurrentUser();
      if (!user) {
        return { referral: null, enableReferral: true, success: true };
      }

      const referral = await db.referral.findFirst({
        where: {
          studentId: user.userId,
          accountId,
        },
      });

      return { referral, enableReferral: true, success: true };
    } catch (error) {
      console.error("getMyReferral error:", error);
      return { referral: null, enableReferral: false, success: false };
    }
  },
});

const joinAffiliateProgramSchema = z.object({
  ccp: z.string().optional(),
});

export const joinAffiliateProgram = withTenant({
  input: joinAffiliateProgramSchema,
  handler: async ({ db, accountId, website, input }) => {
    try {
      if (!website.enableReferral) {
        return {
          success: false,
          message: "Affiliate program is not enabled for this academy",
        };
      }

      const user = await getCurrentUser();
      if (!user) {
        return { success: false, message: "Authentication required" };
      }

      const existing = await db.referral.findFirst({
        where: {
          studentId: user.userId,
          accountId,
        },
      });

      if (existing) {
        return { success: false, message: "You are already in the affiliate program" };
      }

      const student = await db.student.findUnique({
        where: { id: user.userId },
        select: { full_name: true, photo_url: true },
      });

      if (!student) {
        return { success: false, message: "Student not found" };
      }

      await db.referral.create({
        data: {
          studentId: user.userId,
          accountId,
          studentName: student.full_name,
          studentImage: student.photo_url ?? null,
          ccp: input.ccp ?? null,
        },
      });

      return { success: true, message: "Successfully joined the affiliate program" };
    } catch (error) {
      console.error("joinAffiliateProgram error:", error);
      return { success: false, message: "Failed to join the affiliate program" };
    }
  },
});
