import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { Prisma } from "database";

export const coubons = {
  // Get all coupons with server-side pagination and filters
  getAllCoupons: privateProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
          search: z.string().optional(),
          status: z
            .array(z.enum(["active", "inactive", "archived"]))
            .optional(),
          discountType: z
            .array(z.enum(["PERCENTAGE", "FIXED_AMOUNT"]))
            .optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.CouponWhereInput = {
        accountId: ctx.account.id,
      };

      // Search filter
      if (input?.search) {
        where.code = {
          contains: input.search,
          mode: "insensitive",
        };
      }

      // Status filter
      if (input?.status && input.status.length > 0) {
        const statusConditions: Prisma.CouponWhereInput[] = [];

        if (input.status.includes("active")) {
          statusConditions.push({ isActive: true, isArchive: false });
        }
        if (input.status.includes("inactive")) {
          statusConditions.push({ isActive: false, isArchive: false });
        }
        if (input.status.includes("archived")) {
          statusConditions.push({ isArchive: true });
        }

        if (statusConditions.length > 0) {
          where.OR = statusConditions;
        }
      }

      // Discount type filter
      if (input?.discountType && input.discountType.length > 0) {
        where.discountType = {
          in: input.discountType,
        };
      }

      // Get total count
      const totalCount = await ctx.prisma.coupon.count({ where });

      // Get coupons with pagination
      const coupons = await ctx.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      const pageCount = Math.ceil(totalCount / limit);

      return {
        coupons,
        totalCount,
        pageCount,
        currentPage: page,
      };
    }),

  // Create a new coupon
  createCoupon: privateProcedure
    .input(
      z.object({
        code: z.string().min(3).max(20),
        discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
        discountAmount: z.number().positive(),
        expirationDate: z.coerce.date(),
        usageLimit: z.number().int().positive().optional(),
        minimumAmount: z.number().positive().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if code already exists
      const existingCoupon = await ctx.prisma.coupon.findUnique({
        where: { code: input.code },
      });

      if (existingCoupon) {
        throw new Error("Coupon code already exists");
      }

      const coupon = await ctx.prisma.coupon.create({
        data: {
          accountId: ctx.account.id,
          code: input.code.toUpperCase(),
          discountType: input.discountType,
          discountAmount: input.discountAmount,
          expirationDate: input.expirationDate,
          usageLimit: input.usageLimit,
          minimumAmount: input.minimumAmount,
          isActive: input.isActive,
          usageCount: 0,
        },
      });

      return coupon;
    }),

  // Update an existing coupon
  updateCoupon: privateProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string().min(3).max(20).optional(),
        discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).optional(),
        discountAmount: z.number().positive().optional(),
        expirationDate: z.coerce.date().optional(),
        usageLimit: z.number().int().positive().nullable().optional(),
        minimumAmount: z.number().positive().nullable().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify coupon belongs to this account
      const existingCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          id,
          accountId: ctx.account.id,
        },
      });

      if (!existingCoupon) {
        throw new Error("Coupon not found");
      }

      // If updating code, check it doesn't conflict with existing codes
      if (updateData.code && updateData.code !== existingCoupon.code) {
        const codeExists = await ctx.prisma.coupon.findUnique({
          where: { code: updateData.code.toUpperCase() },
        });

        if (codeExists) {
          throw new Error("Coupon code already exists");
        }

        updateData.code = updateData.code.toUpperCase();
      }

      const coupon = await ctx.prisma.coupon.update({
        where: { id },
        data: updateData,
      });

      return coupon;
    }),

  // Toggle coupon active status
  toggleCouponStatus: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify coupon belongs to this account
      const existingCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          id: input.id,
          accountId: ctx.account.id,
        },
      });

      if (!existingCoupon) {
        throw new Error("Coupon not found");
      }

      const coupon = await ctx.prisma.coupon.update({
        where: { id: input.id },
        data: {
          isActive: !existingCoupon.isActive,
        },
      });

      return coupon;
    }),

  // Archive a coupon
  archiveCoupon: privateProcedure
    .input(
      z.object({
        coupon_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify coupon belongs to this account
      const existingCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          id: input.coupon_id,
          accountId: ctx.account.id,
        },
      });

      if (!existingCoupon) {
        throw new Error("Coupon not found");
      }

      const coupon = await ctx.prisma.coupon.update({
        where: {
          id: input.coupon_id,
        },
        data: {
          isArchive: true,
        },
      });

      return coupon;
    }),

  // Delete a coupon
  deleteCoupon: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify coupon belongs to this account
      const existingCoupon = await ctx.prisma.coupon.findFirst({
        where: {
          id: input.id,
          accountId: ctx.account.id,
        },
      });

      if (!existingCoupon) {
        throw new Error("Coupon not found");
      }

      await ctx.prisma.coupon.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
};
