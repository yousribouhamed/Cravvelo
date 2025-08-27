"use server";

import { withAuth } from "@/src/_internals/with-auth";
import { z } from "zod";
import type {
  Invoice,
  Payment,
  Student,
  App,
  AppInstall,
} from "@prisma/client";

// Extended types for better data representation
export type InvoiceWithDetails = Invoice & {
  Payment: Payment & {
    Student: Student | null;
    AppInstall: (AppInstall & {
      App: App;
    })[];
  };
  Student: Student | null;
};

/**
 * Get all invoices for the authenticated account
 */
export const getAllInvoices = withAuth({
  input: z
    .object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      status: z
        .enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"])
        .optional(),
      sortBy: z
        .enum(["createdAt", "amount", "dueDate", "paidAt"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      search: z.string().optional(), // Search by student name or email
    })
    .optional(),

  handler: async ({ account, db, input }) => {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
      } = input || {};

      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {
        accountId: account.id,
      };

      if (status) {
        whereClause.status = status;
      }

      if (search) {
        whereClause.OR = [
          {
            Payment: {
              Student: {
                full_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            Payment: {
              Student: {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      // Get total count for pagination
      const totalCount = await db.invoice.count({
        where: whereClause,
      });

      // Get invoices with related data
      const invoices = await db.invoice.findMany({
        where: whereClause,
        include: {
          Payment: {
            include: {
              Student: true,
              AppInstall: {
                include: {
                  App: true,
                },
              },
            },
          },
          Student: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      });

      // Calculate summary statistics
      const summaryStats = await db.invoice.aggregate({
        where: { accountId: account.id },
        _sum: {
          amount: true,
        },
        _count: {
          _all: true,
        },
      });

      const statusBreakdown = await db.invoice.groupBy({
        by: ["status"],
        where: { accountId: account.id },
        _count: {
          _all: true,
        },
        _sum: {
          amount: true,
        },
      });

      return {
        invoices: invoices as InvoiceWithDetails[],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1,
        },
        summary: {
          totalRevenue: summaryStats._sum.amount || 0,
          totalInvoices: summaryStats._count._all,
          statusBreakdown: statusBreakdown.map((stat) => ({
            status: stat.status,
            count: stat._count._all,
            totalAmount: stat._sum.amount || 0,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw new Error("Failed to fetch invoices. Please try again later.");
    }
  },
});

/**
 * Get detailed information for a specific invoice by ID
 */
export const getInvoiceDetailById = withAuth({
  input: z.object({
    invoiceId: z.string().min(1, "Invoice ID is required"),
  }),

  handler: async ({ account, db, input }) => {
    try {
      const { invoiceId } = input;

      // Get the invoice with all related data
      const invoice = await db.invoice.findFirst({
        where: {
          id: invoiceId,
          accountId: account.id, // Ensure user can only access their own invoices
        },
        include: {
          Payment: {
            include: {
              Student: true,
              AppInstall: {
                include: {
                  App: true,
                },
              },
              Sale: {
                include: {
                  Course: {
                    select: {
                      id: true,
                      title: true,
                      thumbnailUrl: true,
                    },
                  },
                  Product: {
                    select: {
                      id: true,
                      title: true,
                      thumbnailUrl: true,
                    },
                  },
                },
              },
              MethodConfig: {
                select: {
                  provider: true,
                },
              },
              Proofs: true,
              Transactions: true,
            },
          },
          Student: true,
          Account: {
            select: {
              id: true,
              user_name: true,
              support_email: true,
              Website: {
                select: {
                  name: true,
                  logo: true,
                  customDomain: true,
                  subdomain: true,
                },
              },
            },
          },
        },
      });

      if (!invoice) {
        throw new Error(
          "Invoice not found or you don't have permission to view it."
        );
      }

      // Get the purchased item details (app, course, or product)
      let purchasedItem = null;

      if (invoice.Payment.AppInstall && invoice.Payment.AppInstall.length > 0) {
        // This is an app subscription
        purchasedItem = {
          type: "APP",
          item: invoice.Payment.AppInstall[0].App,
          planName: invoice.Payment.AppInstall[0].planName,
          subscriptionAmount: invoice.Payment.AppInstall[0].subscriptionAmount,
          isRecurring: invoice.Payment.AppInstall[0].isRecurring,
          recurringDays: invoice.Payment.AppInstall[0].recurringDays,
          trialDays: invoice.Payment.AppInstall[0].trialDays,
        };
      } else if (invoice.Payment.Sale) {
        // This is a course or product purchase
        purchasedItem = {
          type: invoice.Payment.Sale.itemType,
          item:
            invoice.Payment.Sale.itemType === "COURSE"
              ? invoice.Payment.Sale.Course
              : invoice.Payment.Sale.Product,
          quantity: invoice.Payment.Sale.quantity,
          price: invoice.Payment.Sale.price,
          originalAmount: invoice.Payment.Sale.originalAmount,
          discountAmount: invoice.Payment.Sale.discountAmount,
          couponCode: invoice.Payment.Sale.couponCode,
        };
      }

      // Calculate payment history and attempts
      const paymentHistory = {
        totalAttempts: 1, // Current payment
        method: invoice.Payment.method,
        provider: invoice.Payment.MethodConfig?.provider,
        gatewayId: invoice.Payment.gatewayId,
        checkoutUrl: invoice.Payment.checkoutUrl,
        refundAmount: invoice.Payment.refundAmount,
        refundReason: invoice.Payment.refundReason,
        refundedAt: invoice.Payment.refundedAt,
      };

      return {
        invoice: invoice as InvoiceWithDetails,
        purchasedItem,
        paymentHistory,
        customer: {
          id: invoice.Student?.id || invoice.Payment.Student?.id,
          name:
            invoice.Student?.full_name || invoice.Payment.Student?.full_name,
          email: invoice.Student?.email || invoice.Payment.Student?.email,
          phone: invoice.Student?.phone || invoice.Payment.Student?.phone,
          photoUrl:
            invoice.Student?.photo_url || invoice.Payment.Student?.photo_url,
        },
        seller: {
          id: invoice.Account?.id,
          name: invoice.Account?.user_name,
          email: invoice.Account?.support_email,
          website: invoice.Account?.Website,
        },
      };
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Failed to fetch invoice details. Please try again later."
      );
    }
  },
});

/**
 * Update invoice status (for manual status changes)
 */
export const updateInvoiceStatus = withAuth({
  input: z.object({
    invoiceId: z.string().min(1, "Invoice ID is required"),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"]),
    note: z.string().optional(),
  }),

  handler: async ({ account, db, input }) => {
    try {
      const { invoiceId, status, note } = input;

      // Verify the invoice belongs to the account
      const existingInvoice = await db.invoice.findFirst({
        where: {
          id: invoiceId,
          accountId: account.id,
        },
      });

      if (!existingInvoice) {
        throw new Error(
          "Invoice not found or you don't have permission to update it."
        );
      }

      // Update the invoice status
      const updatedInvoice = await db.invoice.update({
        where: { id: invoiceId },
        data: {
          status,
          paidAt: status === "COMPLETED" ? new Date() : undefined,
          description: note
            ? `${existingInvoice.description || ""}\nNote: ${note}`
            : existingInvoice.description,
        },
        include: {
          Payment: {
            include: {
              Student: true,
            },
          },
          Student: true,
        },
      });

      // Also update the related payment status if needed
      if (existingInvoice.paymentId) {
        await db.payment.update({
          where: { id: existingInvoice.paymentId },
          data: { status },
        });
      }

      return updatedInvoice;
    } catch (error) {
      console.error("Error updating invoice status:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Failed to update invoice status. Please try again later."
      );
    }
  },
});

/**
 * Get invoice statistics and analytics
 */
export const getInvoiceStats = withAuth({
  input: z
    .object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      period: z.enum(["day", "week", "month", "year"]).default("month"),
    })
    .optional(),

  handler: async ({ account, db, input }) => {
    try {
      const { startDate, endDate, period = "month" } = input || {};

      const dateFilter: any = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);

      const whereClause = {
        accountId: account.id,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      };

      // Get overall statistics
      const overallStats = await db.invoice.aggregate({
        where: whereClause,
        _sum: { amount: true },
        _count: { _all: true },
        _avg: { amount: true },
      });

      // Get revenue trend data
      const revenueTrend = await db.$queryRaw`
        SELECT 
          DATE_TRUNC(${period}, "createdAt") as period,
          SUM(amount) as revenue,
          COUNT(*) as invoices
        FROM "Invoice" 
        WHERE "accountId" = ${account.id}
          ${startDate ? `AND "createdAt" >= ${new Date(startDate)}` : ""}
          ${endDate ? `AND "createdAt" <= ${new Date(endDate)}` : ""}
        GROUP BY DATE_TRUNC(${period}, "createdAt")
        ORDER BY period DESC
        LIMIT 12
      `;

      // Get top customers by invoice amount
      const topCustomers = await db.invoice.groupBy({
        by: ["studentId"],
        where: whereClause,
        _sum: { amount: true },
        _count: { _all: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 10,
      });

      // Fetch customer details for top customers
      const customerIds = topCustomers
        .filter((c) => c.studentId)
        .map((c) => c.studentId!);
      const customerDetails = await db.student.findMany({
        where: { id: { in: customerIds } },
        select: {
          id: true,
          full_name: true,
          email: true,
          photo_url: true,
        },
      });

      const topCustomersWithDetails = topCustomers.map((customer) => {
        const details = customerDetails.find(
          (d) => d.id === customer.studentId
        );
        return {
          ...customer,
          customer: details,
          totalRevenue: customer._sum.amount || 0,
          totalInvoices: customer._count._all,
        };
      });

      return {
        overview: {
          totalRevenue: overallStats._sum.amount || 0,
          totalInvoices: overallStats._count._all,
          averageInvoiceAmount: overallStats._avg.amount || 0,
        },
        revenueTrend,
        topCustomers: topCustomersWithDetails,
      };
    } catch (error) {
      console.error("Error fetching invoice statistics:", error);
      throw new Error(
        "Failed to fetch invoice statistics. Please try again later."
      );
    }
  },
});
