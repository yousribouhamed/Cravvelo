import { increaseVerificationSteps } from "@/src/lib/actions/increase-steps";
import { privateProcedure } from "../trpc";
import { z } from "zod";

export const builder = {
  createWebSite: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        subdomain: z.string(),
        pages: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = ctx.prisma.website.create({
          data: {
            accountId: account.id,
            name: input.name,
            description: input.description,
            subdomain: input.subdomain + ".cravvelo.com",
          },
        });
        await increaseVerificationSteps({ accountId: ctx.account.id });
        return site;
      } catch (err) {
        console.error(err);
        throw new Error(err);
      }
    }),

  getUserWebSite: privateProcedure.query(async ({ input, ctx }) => {
    try {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.user.id },
      });
      const site = ctx.prisma.website.findMany({
        where: { accountId: account.id },
      });

      return site;
    } catch (err) {
      console.error(err);
    }
  }),
};
