"use server";

import { withAuth } from "@/src/_internals/with-auth";
import z from "zod";
import bcrypt from "bcryptjs";

export const getStudentStats = withAuth({
  handler: async ({ account, db }) => {
    try {
      // Get current month start and end dates
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // Get total students count
      const totalStudents = await db.student.count({
        where: {
          accountId: account.id,
        },
      });

      // Get active students count
      const activeStudents = await db.student.count({
        where: {
          accountId: account.id,
          isActive: true,
        },
      });

      // Get new students this month
      const newStudentsThisMonth = await db.student.count({
        where: {
          accountId: account.id,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      // Get total purchases count from Sales (all sales are student purchases)
      const totalPurchases = await db.sale.count({
        where: {
          accountId: account.id,
        },
      });

      // Get students with certificates count
      const studentsWithCertificates = await db.student.count({
        where: {
          accountId: account.id,
          Certificates: {
            some: {},
          },
        },
      });

      // Get email verified students count
      const emailVerifiedStudents = await db.student.count({
        where: {
          accountId: account.id,
          emailVerified: true,
        },
      });

      return {
        data: {
          totalStudents,
          activeStudents,
          newStudentsThisMonth,
          totalPurchases,
          studentsWithCertificates,
          emailVerifiedStudents,
        },
        success: true,
        message: "Successfully fetched student statistics",
      };
    } catch (error) {
      console.error("Error fetching student stats:", error);
      return {
        data: null,
        success: false,
        message: "Something went wrong while fetching student statistics",
      };
    }
  },
});

export const updateStudentPassword = withAuth({
  input: z.object({
    studentId: z.string().min(1),
    newPassword: z.string().min(8),
  }),
  handler: async ({ input, account, db }) => {
    try {
      const student = await db.student.findFirst({
        where: {
          id: input.studentId,
          accountId: account.id,
        },
        select: {
          id: true,
        },
      });

      if (!student) {
        return {
          data: null,
          success: false,
          message: "Student not found",
        };
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await db.student.update({
        where: { id: student.id },
        data: { password: hashedPassword },
      });

      return {
        data: { id: student.id },
        success: true,
        message: "Student password updated successfully",
      };
    } catch (error) {
      console.error("Error updating student password:", error);
      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update student password",
      };
    }
  },
});
