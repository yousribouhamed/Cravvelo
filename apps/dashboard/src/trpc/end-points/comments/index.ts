import { z } from "zod";
import { privateProcedure } from "../../trpc";
import { prisma } from "database/src";

export const comments = {
  getAllComments: privateProcedure.query(async ({ ctx, input }) => {
    const allComments = await ctx.prisma.comment.findMany({
      where: {
        accountId: ctx.account.id,
      },
    });

    return allComments;
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
        },
      });

      return updatedComment;
    }),
};
