import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";

export const account = {
  getAllAccounts: privateProcedure.query(async ({ input, ctx }) => {
    const accounts = await ctx.prisma.account.findMany();
    return accounts;
  }),

  createBlackKing: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = ctx.prisma.account.update({
          where: {
            id: input.id,
          },
          data: {
            plan: "BLACK_KING",
          },
        });

        return account;
      } catch (err) {
        console.log(err);
      }
    }),
};
