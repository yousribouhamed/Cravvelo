"use server";

import { withAuth } from "@/src/_internals/with-auth";
import z from "zod";

export const getCheckoutByPaymentId = withAuth({
  input: z.object({
    paymentId: z.string(),
  }),
  handler: async ({ account, db, input }) => {
    try {
      // Fetch the payment with all related data
      const payment = await db.payment.findUnique({
        where: {
          id: input.paymentId,
        },
        include: {
          // Include invoice details
          Invoices: true,

          // Include sale information if it's a purchase payment
          Sale: {
            include: {
              // Include course details if it's a course purchase
              Course: {
                include: {
                  CoursePricingPlans: {
                    include: {
                      PricingPlan: true,
                    },
                  },
                },
              },

              // Include product details if it's a product purchase
              Product: {
                include: {
                  ProductPricingPlans: {
                    include: {
                      PricingPlan: true,
                    },
                  },
                },
              },

              // Include coupon information
              Coupon: true,

              // Include student information
              Student: {
                select: {
                  id: true,
                  full_name: true,
                  email: true,
                  photo_url: true,
                },
              },
            },
          },

          // Include student information (for direct payments)
          Student: {
            select: {
              id: true,
              full_name: true,
              email: true,
              photo_url: true,
            },
          },

          // Include payment method configuration
          MethodConfig: true,

          // Include account information (seller)
          Account: {
            select: {
              id: true,
              user_name: true,
              avatarUrl: true,
              support_email: true,
            },
          },
        },
      });

      if (!payment) {
        return {
          success: false,
          error: "Payment not found",
        };
      }

      // Check if the payment belongs to the authenticated account or the student
      const isAuthorized =
        payment.accountId === account.id ||
        (payment.Student && payment.Student.id);

      if (!isAuthorized) {
        return {
          success: false,
          error: "Unauthorized access to payment",
        };
      }

      // Fetch app installation details if it's an app payment
      let appInstallation = null;
      if (payment.type === "SUBSCRIPTION") {
        appInstallation = await db.appInstall.findFirst({
          where: {
            paymentId: payment.id,
          },
          include: {
            App: {
              include: {
                AppPricingPlans: {
                  include: {
                    PricingPlan: true,
                  },
                },
              },
            },
          },
        });
      }

      // Fetch item purchase details for course/product purchases
      let itemPurchase = null;
      if (payment.Sale) {
        itemPurchase = await db.itemPurchase.findFirst({
          where: {
            studentId: payment.Sale.studentId,
            itemType: payment.Sale.itemType,
            itemId: payment.Sale.itemId,
          },
          include: {
            PricingPlan: true,
          },
        });
      }

      // Format the response with all checkout information
      const checkoutData = {
        // Payment information
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          type: payment.type,
          method: payment.method,
          description: payment.description,
          checkoutUrl: payment.checkoutUrl,
          gatewayId: payment.gatewayId,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },

        // Invoice information
        invoice:
          payment.Invoices.length > 0
            ? {
                id: payment.Invoices[0].id,
                amount: payment.Invoices[0].amount,
                currency: payment.Invoices[0].currency,
                status: payment.Invoices[0].status,
                description: payment.Invoices[0].description,
                dueDate: payment.Invoices[0].dueDate,
                paidAt: payment.Invoices[0].paidAt,
              }
            : null,

        // Sale information (for course/product purchases)
        sale: payment.Sale
          ? {
              id: payment.Sale.id,
              orderNumber: payment.Sale.orderNumber,
              amount: payment.Sale.amount,
              originalAmount: payment.Sale.originalAmount,
              discountAmount: payment.Sale.discountAmount,
              itemType: payment.Sale.itemType,
              itemId: payment.Sale.itemId,
              quantity: payment.Sale.quantity,
              coupon: payment.Sale.Coupon
                ? {
                    code: payment.Sale.Coupon.code,
                    discountType: payment.Sale.Coupon.discountType,
                    discountAmount: payment.Sale.Coupon.discountAmount,
                  }
                : null,
            }
          : null,

        // Item information (course or product)
        item: payment.Sale
          ? {
              type: payment.Sale.itemType,
              id: payment.Sale.itemId,
              details:
                payment.Sale.itemType === "COURSE" && payment.Sale.Course
                  ? {
                      title: payment.Sale.Course.title,
                      thumbnailUrl: payment.Sale.Course.thumbnailUrl,
                      courseDescription: payment.Sale.Course.courseDescription,
                      price: payment.Sale.Course.price,
                      compareAtPrice: payment.Sale.Course.compareAtPrice,
                      level: payment.Sale.Course.level,
                      length: payment.Sale.Course.length,
                      certificate: payment.Sale.Course.certificate,
                    }
                  : payment.Sale.itemType === "PRODUCT" && payment.Sale.Product
                  ? {
                      title: payment.Sale.Product.title,
                      thumbnailUrl: payment.Sale.Product.thumbnailUrl,
                      description: payment.Sale.Product.description,
                      price: payment.Sale.Product.price,
                      compareAtPrice: payment.Sale.Product.compareAtPrice,
                    }
                  : null,
            }
          : null,

        // Pricing plan information
        pricingPlan: (() => {
          if (itemPurchase?.PricingPlan) {
            return {
              id: itemPurchase.PricingPlan.id,
              name: itemPurchase.PricingPlan.name,
              description: itemPurchase.PricingPlan.description,
              pricingType: itemPurchase.PricingPlan.pricingType,
              price: itemPurchase.PricingPlan.price,
              compareAtPrice: itemPurchase.PricingPlan.compareAtPrice,
              currency: itemPurchase.PricingPlan.currency,
              accessDuration: itemPurchase.PricingPlan.accessDuration,
              accessDurationDays: itemPurchase.PricingPlan.accessDurationDays,
              recurringDays: itemPurchase.PricingPlan.recurringDays,
              trialDays: itemPurchase.PricingPlan.trialDays,
            };
          }

          // Try to get pricing plan from course or product
          if (payment.Sale?.Course?.CoursePricingPlans?.length > 0) {
            const pricingPlan =
              payment.Sale.Course.CoursePricingPlans[0].PricingPlan;
            return {
              id: pricingPlan.id,
              name: pricingPlan.name,
              description: pricingPlan.description,
              pricingType: pricingPlan.pricingType,
              price: pricingPlan.price,
              compareAtPrice: pricingPlan.compareAtPrice,
              currency: pricingPlan.currency,
              accessDuration: pricingPlan.accessDuration,
              accessDurationDays: pricingPlan.accessDurationDays,
              recurringDays: pricingPlan.recurringDays,
              trialDays: pricingPlan.trialDays,
            };
          }

          if (payment.Sale?.Product?.ProductPricingPlans?.length > 0) {
            const pricingPlan =
              payment.Sale.Product.ProductPricingPlans[0].PricingPlan;
            return {
              id: pricingPlan.id,
              name: pricingPlan.name,
              description: pricingPlan.description,
              pricingType: pricingPlan.pricingType,
              price: pricingPlan.price,
              compareAtPrice: pricingPlan.compareAtPrice,
              currency: pricingPlan.currency,
              accessDuration: pricingPlan.accessDuration,
              accessDurationDays: pricingPlan.accessDurationDays,
              recurringDays: pricingPlan.recurringDays,
              trialDays: pricingPlan.trialDays,
            };
          }

          return null;
        })(),

        // App installation information (for app subscriptions)
        appInstallation: appInstallation
          ? {
              id: appInstallation.id,
              appId: appInstallation.appId,
              planName: appInstallation.planName,
              subscriptionAmount: appInstallation.subscriptionAmount,
              currency: appInstallation.currency,
              trialDays: appInstallation.trialDays,
              recurringDays: appInstallation.recurringDays,
              isRecurring: appInstallation.isRecurring,
              status: appInstallation.status,
              app: {
                name: appInstallation.App.name,
                slug: appInstallation.App.slug,
                shortDesc: appInstallation.App.shortDesc,
                logoUrl: appInstallation.App.logoUrl,
              },
            }
          : null,

        // Customer information
        customer:
          payment.Student || payment.Sale?.Student
            ? {
                id: (payment.Student || payment.Sale?.Student)?.id,
                full_name: (payment.Student || payment.Sale?.Student)
                  ?.full_name,
                email: (payment.Student || payment.Sale?.Student)?.email,
                photo_url: (payment.Student || payment.Sale?.Student)
                  ?.photo_url,
              }
            : null,

        // Seller information
        seller: payment.Account
          ? {
              id: payment.Account.id,
              user_name: payment.Account.user_name,
              avatarUrl: payment.Account.avatarUrl,
              support_email: payment.Account.support_email,
            }
          : null,

        // Payment method configuration
        paymentMethod: payment.MethodConfig
          ? {
              provider: payment.MethodConfig.provider,
              isActive: payment.MethodConfig.isActive,
            }
          : null,
      };

      return {
        success: true,
        data: checkoutData,
      };
    } catch (error) {
      console.error("Error fetching checkout details:", error);
      return {
        success: false,
        error: "Failed to fetch checkout details",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
