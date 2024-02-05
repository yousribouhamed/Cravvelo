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
            pages: JSON.stringify(input.pages as string),
            accountId: account.id,
            name: input.name,
            description: input.description,
            subdomain:
              input.subdomain + "." + process.env.NEXT_PUBLIC_ROOT_DOMAIN,
          },
        });
        return site;
      } catch (err) {
        console.error(err);
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
