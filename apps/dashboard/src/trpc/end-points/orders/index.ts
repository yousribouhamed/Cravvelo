import { z } from "zod";
import { privateProcedure } from "../../trpc";

const PAGE_SIZE = 10;

export const orders = {
  getAllOrders: privateProcedure
    .input(
      z
        .object({
          page: z.number().min(1).optional(),
          limit: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? PAGE_SIZE;
      const skip = (page - 1) * limit;
      const where = { accountId: ctx.account.id };

      const [ordersList, totalCount] = await Promise.all([
        ctx.prisma.sale.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        ctx.prisma.sale.count({ where }),
      ]);

      const pageCount = Math.ceil(totalCount / limit);
      return { orders: ordersList, totalCount, pageCount, currentPage: page };
    }),
};
