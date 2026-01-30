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
