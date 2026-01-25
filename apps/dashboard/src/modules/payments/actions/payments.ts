"use server";

import { withAuth } from "@/src/_internals/with-auth";
import {
  PaymentStatus,
  TransactionType,
  TransactionStatus,
  PurchaseStatus,
} from "@prisma/client";
import { StudentBag } from "@/src/types";
import z from "zod";

export const getAllPayments = withAuth({
  handler: async ({ account, db }) => {
    try {
      const payments = await db.payment.findMany({
        where: {
          accountId: account.id,
        },
        include: {
          Student: {
            select: {
              id: true,
              full_name: true,
              email: true,
              photo_url: true,
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
              id: true,
              provider: true,
            },
          },
          Proofs: true,
          Transactions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: payments,
        success: true,
        message: "Successfully fetched all payments",
      };
    } catch (error) {
      console.error("Error fetching payments:", error);
      return {
        data: null,
        success: false,
        message: "Something went wrong while fetching the payments",
      };
    }
  },
});

export const getPaymentDetailsById = withAuth({
  input: z.object({
    paymentId: z.string(),
  }),
  handler: async ({ account, db, input }) => {
    const { paymentId } = input;
    try {
      if (!paymentId) {
        return {
          data: null,
          success: false,
          message: "Payment ID is required",
        };
      }

      const payment = await db.payment.findFirst({
        where: {
          id: paymentId,
          accountId: account.id, // Ensure user can only access their own payments
        },
        include: {
          Student: {
            select: {
              id: true,
              full_name: true,
              email: true,
              phone: true,
              photo_url: true,
            },
          },
          Sale: {
            include: {
              Course: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                  price: true,
                },
              },
              Product: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                  price: true,
                },
              },
              Coupon: {
                select: {
                  id: true,
                  code: true,
                  discountType: true,
                  discountAmount: true,
                },
              },
            },
          },

          MethodConfig: {
            select: {
              id: true,
              provider: true,
              config: true, // Be careful with sensitive data
            },
          },
          Proofs: {
            orderBy: {
              createdAt: "desc",
            },
          },
          Transactions: {
            include: {
              Wallet: {
                select: {
                  id: true,
                  balance: true,
                  currency: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!payment) {
        return {
          data: null,
          success: false,
          message: "Payment not found or you don't have permission to view it",
        };
      }

      return {
        data: payment,
        success: true,
        message: "Successfully fetched payment details",
      };
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return {
        data: null,
        success: false,
        message: "Something went wrong while fetching payment details",
      };
    }
  },
});

export const approvePayment = withAuth({
  input: z.object({
    paymentId: z.string(),
  }),
  handler: async ({ account, db, input }) => {
    const { paymentId } = input;

    try {
      if (!paymentId) {
        return {
          data: null,
          success: false,
          message: "Payment ID is required",
        };
      }

      // Start a transaction to ensure data consistency
      const result = await db.$transaction(async (tx) => {
        // Find the payment and ensure it belongs to the account
        const payment = await tx.payment.findFirst({
          where: {
            id: paymentId,
            accountId: account.id,
          },
          include: {
            Sale: {
              include: {
                Course: {
                  include: {
                    CoursePricingPlans: {
                      include: {
                        PricingPlan: true,
                      },
                    },
                  },
                },
                Product: {
                  include: {
                    ProductPricingPlans: {
                      include: {
                        PricingPlan: true,
                      },
                    },
                  },
                },
              },
            },
            Student: true,
          },
        });

        if (!payment) {
          throw new Error(
            "Payment not found or you don't have permission to approve it"
          );
        }

        if (payment.status === PaymentStatus.COMPLETED) {
          throw new Error("Payment is already completed");
        }

        if (
          payment.status === PaymentStatus.CANCELLED ||
          payment.status === PaymentStatus.REFUNDED
        ) {
          throw new Error("Cannot approve a cancelled or refunded payment");
        }

        // Update payment status to completed
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.COMPLETED,
            updatedAt: new Date(),
          },
        });

        // Update related sale status if exists
        if (payment.saleId) {
          await tx.sale.update({
            where: { id: payment.saleId },
            data: {
              status: "COMPLETED",
              updatedAt: new Date(),
            },
          });
        }

        // Create a credit transaction in the wallet
        const wallet = await tx.wallet.findUnique({
          where: { accountId: account.id },
        });

        if (wallet) {
          const newBalance = wallet.balance + payment.amount;

          // Update wallet balance
          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              balance: newBalance,
              updatedAt: new Date(),
            },
          });

          // Create transaction record
          await tx.transaction.create({
            data: {
              walletId: wallet.id,
              paymentId: payment.id,
              type: TransactionType.CREDIT,
              amount: payment.amount,
              currency: payment.currency,
              status: TransactionStatus.COMPLETED,
              description: `Payment approved - ${
                payment.description || "Payment"
              }`,
              balanceBefore: wallet.balance,
              balanceAfter: newBalance,
              relatedEntityType: "PAYMENT",
              relatedEntityId: payment.id,
            },
          });
        }

        // Mark payment proofs as verified
        await tx.paymentProof.updateMany({
          where: { paymentId: payment.id },
          data: { verified: true },
        });

        // Create ItemPurchase and add to student bag if Sale exists
        if (payment.Sale && payment.Student) {
          const sale = payment.Sale;
          let item: any = null;
          let pricingPlan: any = null;

          // Get the item (Course or Product) and its pricing plan
          if (sale.itemType === "COURSE" && sale.Course) {
            item = sale.Course;
            pricingPlan =
              item.CoursePricingPlans?.find(
                (p: { isDefault: boolean }) => p.isDefault
              ) ?? item.CoursePricingPlans?.[0];
          } else if (sale.itemType === "PRODUCT" && sale.Product) {
            item = sale.Product;
            pricingPlan =
              item.ProductPricingPlans?.find(
                (p: { isDefault: boolean }) => p.isDefault
              ) ?? item.ProductPricingPlans?.[0];
          }

          if (item && pricingPlan?.PricingPlan) {
            const plan = pricingPlan.PricingPlan;
            const accessStartDate = new Date();
            let accessEndDate: Date | null = null;

            // Calculate accessEndDate based on pricing plan type
            if (plan.pricingType === "RECURRING" && plan.recurringDays) {
              accessEndDate = new Date(accessStartDate);
              accessEndDate.setDate(
                accessEndDate.getDate() + plan.recurringDays
              );
            } else if (
              plan.pricingType === "ONE_TIME" &&
              plan.accessDuration === "LIMITED" &&
              plan.accessDurationDays
            ) {
              accessEndDate = new Date(accessStartDate);
              accessEndDate.setDate(
                accessEndDate.getDate() + plan.accessDurationDays
              );
            }
            // For FREE or UNLIMITED, accessEndDate remains null

            // Check if ItemPurchase already exists to avoid duplicates
            const existingPurchase = await tx.itemPurchase.findFirst({
              where: {
                studentId: payment.Student.id,
                itemType: sale.itemType,
                itemId: sale.itemId,
                status: PurchaseStatus.ACTIVE,
              },
            });

            if (!existingPurchase) {
              // Create ItemPurchase record
              await tx.itemPurchase.create({
                data: {
                  studentId: payment.Student.id,
                  accountId: account.id,
                  pricingPlanId: plan.id,
                  itemType: sale.itemType,
                  itemId: sale.itemId,
                  purchaseAmount: payment.amount,
                  currency: payment.currency || "DZD",
                  status: PurchaseStatus.ACTIVE,
                  accessStartDate,
                  accessEndDate,
                  nextBillingDate:
                    plan.pricingType === "RECURRING" && plan.recurringDays
                      ? (() => {
                          const next = new Date(accessStartDate);
                          next.setDate(next.getDate() + plan.recurringDays);
                          return next;
                        })()
                      : null,
                },
              });
            }

            // Add course to student bag if it's a course purchase
            if (sale.itemType === "COURSE" && item) {
              const student = payment.Student;
              const studentBag: StudentBag = student.bag
                ? (JSON.parse(student.bag as string) as StudentBag)
                : { courses: [], products: [], certificates: [] };

              // Check if course already exists in bag
              const courseExists =
                studentBag.courses &&
                studentBag.courses.find(
                  (bagItem) => bagItem.course.id === item.id
                );

              if (!courseExists) {
                const oldCourses =
                  studentBag.courses && studentBag.courses.length > 0
                    ? [...studentBag.courses]
                    : [];

                const newStudentBag: StudentBag = {
                  ...studentBag,
                  courses: [
                    ...oldCourses,
                    {
                      course: item,
                      currentEpisode: 0,
                    },
                  ],
                };

                await tx.student.update({
                  where: { id: student.id },
                  data: {
                    bag: JSON.stringify(newStudentBag),
                  },
                });
              }
            }
          }
        }

        return updatedPayment;
      });

      return {
        data: result,
        success: true,
        message: "Payment approved successfully",
      };
    } catch (error) {
      console.error("Error approving payment:", error);
      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while approving the payment",
      };
    }
  },
});

export const rejectPayment = withAuth({
  input: z.object({
    paymentId: z.string(),
    rejectionReason: z.string().optional(),
  }),
  handler: async ({ account, db, input }) => {
    const { paymentId, rejectionReason } = input;
    try {
      if (!paymentId) {
        return {
          data: null,
          success: false,
          message: "Payment ID is required",
        };
      }

      // Start a transaction to ensure data consistency
      const result = await db.$transaction(async (tx) => {
        // Find the payment and ensure it belongs to the account
        const payment = await tx.payment.findFirst({
          where: {
            id: paymentId,
            accountId: account.id,
          },
          include: {
            Sale: true,

            Student: true,
          },
        });

        if (!payment) {
          throw new Error(
            "Payment not found or you don't have permission to reject it"
          );
        }

        if (payment.status === PaymentStatus.COMPLETED) {
          throw new Error("Cannot reject a completed payment");
        }

        if (
          payment.status === PaymentStatus.CANCELLED ||
          payment.status === PaymentStatus.REFUNDED
        ) {
          throw new Error("Payment is already cancelled or refunded");
        }

        // Update payment status to failed
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.FAILED,
            metadata: {
              ...((payment.metadata as any) || {}),
              rejectionReason: rejectionReason || "Payment rejected by admin",
              rejectedAt: new Date().toISOString(),
            },
            updatedAt: new Date(),
          },
        });

        // Update related sale status if exists
        if (payment.saleId) {
          await tx.sale.update({
            where: { id: payment.saleId },
            data: {
              status: "CANCELLED",
              updatedAt: new Date(),
            },
          });
        }

        // Create a transaction record for the rejection
        const wallet = await tx.wallet.findUnique({
          where: { accountId: account.id },
        });

        if (wallet) {
          await tx.transaction.create({
            data: {
              walletId: wallet.id,
              paymentId: payment.id,
              type: TransactionType.DEBIT,
              amount: 0, // No actual money movement, just recording the rejection
              currency: payment.currency,
              status: TransactionStatus.FAILED,
              description: `Payment rejected - ${
                rejectionReason || "Admin rejection"
              }`,
              balanceBefore: wallet.balance,
              balanceAfter: wallet.balance,
              relatedEntityType: "PAYMENT",
              relatedEntityId: payment.id,
            },
          });
        }

        return updatedPayment;
      });

      return {
        data: result,
        success: true,
        message: "Payment rejected successfully",
      };
    } catch (error) {
      console.error("Error rejecting payment:", error);
      return {
        data: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while rejecting the payment",
      };
    }
  },
});

// Additional helper function to get payment statistics
export const getPaymentStats = withAuth({
  handler: async ({ account, db }) => {
    try {
      const stats = await db.payment.aggregate({
        where: {
          accountId: account.id,
        },
        _sum: {
          amount: true,
        },
        _count: {
          _all: true,
        },
      });

      const statusStats = await db.payment.groupBy({
        by: ["status"],
        where: {
          accountId: account.id,
        },
        _count: {
          _all: true,
        },
        _sum: {
          amount: true,
        },
      });

      const monthlyStats = await db.payment.groupBy({
        by: ["createdAt"],
        where: {
          accountId: account.id,
          status: PaymentStatus.COMPLETED,
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 12)), // Last 12 months
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          _all: true,
        },
      });

      return {
        data: {
          totalAmount: stats._sum.amount || 0,
          totalPayments: stats._count._all,
          statusBreakdown: statusStats,
          monthlyTrends: monthlyStats,
        },
        success: true,
        message: "Successfully fetched payment statistics",
      };
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      return {
        data: null,
        success: false,
        message: "Something went wrong while fetching payment statistics",
      };
    }
  },
});
