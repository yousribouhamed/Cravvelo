import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { prisma } from "database/src";

const PAGE_SIZE = 10;

export const comments = {
  getAllComments: privateProcedure
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

      const [commentsList, totalCount] = await Promise.all([
        ctx.prisma.comment.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        ctx.prisma.comment.count({ where }),
      ]);

      const pageCount = Math.ceil(totalCount / limit);
      return { comments: commentsList, totalCount, pageCount, currentPage: page };
    }),

  rejectComment: privateProcedure
    .input(
      z.object({
        comment_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedComment = await ctx.prisma.comment.update({
        where: {
          id: input.comment_id,
        },
        data: {
          status: "rejected",
          isApproved: false,
        },
      });

      return updatedComment;
    }),

  approveComment: privateProcedure
    .input(
      z.object({
        comment_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedComment = await ctx.prisma.comment.update({
        where: {
          id: input.comment_id,
        },
        data: {
          status: "approved",
          isApproved: true,
          // Ensure an approved comment is visible on the public course page
          isPublic: true,
        },
      });

      return updatedComment;
    }),
};
