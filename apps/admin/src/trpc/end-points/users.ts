import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";

export const account = {
  getAllAccounts: privateProcedure.query(async ({ input, ctx }) => {
    const accounts = await ctx.prisma.account.findMany();
    return accounts;
  }),
};
