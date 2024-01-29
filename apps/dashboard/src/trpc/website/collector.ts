import { TRPCError } from "@trpc/server";
import { privateProcedure } from "../trpc";
import { z } from "zod";
import { WebsiteAssets } from "@/src/types";

export const collector = {
  addWebSiteFont: privateProcedure
    .input(
      z.object({
        font: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = ctx.prisma.website.update({
          data: {
            font: input.font,
          },
          where: {
            accountId: account.id,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),
  addWebSiteLogo: privateProcedure
    .input(
      z.object({
        logo: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = ctx.prisma.website.update({
          data: {
            logo: input.logo,
          },
          where: {
            accountId: account.id,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  addWebSiteAssets: privateProcedure
    .input(
      z.object({
        name: z.string(),
        fileUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = await ctx.prisma.website.findFirst({
          where: { accountId: account.id },
        });

        const assets = site.assets
          ? (JSON.parse(site.assets as string) as WebsiteAssets[])
          : [];

        const newAssets = [
          ...assets,
          { name: input.name, fileUrl: input.fileUrl },
        ];

        console.log("here are the new assets");

        await ctx.prisma.website.update({
          where: {
            accountId: account.id,
          },
          data: {
            assets: JSON.stringify(newAssets),
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  getWebsiteAssets: privateProcedure.query(async ({ input, ctx }) => {
    try {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.user.id },
      });
      const site = await ctx.prisma.website.findFirst({
        where: { accountId: account.id },
      });

      const assets = site.assets
        ? (JSON.parse(site.assets as string) as WebsiteAssets[])
        : ([] as WebsiteAssets[]);

      return assets;
    } catch (err) {
      console.error(err);
    }
  }),
};
