import { privateProcedure } from "../trpc";

export const comments = {
  getAllComments: privateProcedure.query(async ({ ctx, input }) => {
    const allComments = await ctx.prisma.comment.findMany();

    return allComments;
  }),
};
