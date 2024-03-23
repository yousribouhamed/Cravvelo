import { z } from "zod";
import { privateProcedure } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";

export const website = {
  getAllWebsites: privateProcedure.query(async ({ input, ctx }) => {
    const websites = await ctx.prisma.website.findMany();
    return websites;
  }),

  deletWebSite: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const websites = await ctx.prisma.website.delete({
        where: {
          id: input.id,
        },
      });
      return websites;
    }),

  suspendWebSite: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const websites = await ctx.prisma.website.update({
        where: {
          id: input.id,
        },
        data: {
          suspended: true,
        },
      });
      return websites;
    }),
};
