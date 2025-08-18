"use server";

import { withTenant } from "@/_internals/with-tenant";
import { getCurrentUser } from "@/modules/auth/lib/utils";

export const getStudentCertificates = withTenant({
  handler: async ({ db }) => {
    try {
      const user = await getCurrentUser();

      const certificates = await db.certificate.findMany({
        where: {
          studentId: user?.userId,
        },
      });

      return {
        data: certificates,
        message: "we got all certificates",
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        message: "we got all certificates",
        success: false,
      };
    }
  },
});
