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

      return [];
    } catch (err) {
      console.error(err);
    }
  }),

  addWebSiteColor: privateProcedure
    .input(
      z.object({
        color: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = await ctx.prisma.website.update({
          where: { accountId: account.id },
          data: {
            color: input.color,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  addPolicy: privateProcedure
    .input(
      z.object({
        policy: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = await ctx.prisma.website.update({
          where: { accountId: account.id },
          data: {
            privacy_policy: JSON.stringify(input.policy),
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  addContactInformations: privateProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = await ctx.prisma.website.update({
          where: { accountId: account.id },
          data: {
            phoneNumber: input.phoneNumber,
            supportEmail: input.email,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  addFavIcon: privateProcedure
    .input(
      z.object({
        fav_icon_url: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = await ctx.prisma.website.update({
          where: { accountId: account.id },
          data: {
            favicon: input.fav_icon_url,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  addWebSiteSeo: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        const site = await ctx.prisma.website.update({
          where: { accountId: account.id },
          data: {
            name: input.title,
            description: input.description,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),
};
