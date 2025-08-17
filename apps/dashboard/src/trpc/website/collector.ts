import { privateProcedure } from "../trpc";
import { z } from "zod";
import { increaseVerificationSteps } from "@/src/lib/actions/increase-steps";

export const collector = {
  addWebSiteFont: privateProcedure
    .input(
      z.object({
        font: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
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
        const site = ctx.prisma.website.update({
          data: {
            logo: input.logo,
          },
          where: {
            accountId: ctx.account.id,
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
        const site = await ctx.prisma.website.findFirst({
          where: { accountId: ctx.account.id },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  getWebsiteAssets: privateProcedure.query(async ({ input, ctx }) => {
    try {
      const site = await ctx.prisma.website.findFirst({
        where: { accountId: ctx.account.id },
      });

      return site;
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
        const [site] = await Promise.all([
          ctx.prisma.website.update({
            where: { accountId: ctx.account.id },
            data: {
              privacy_policy: JSON.stringify(input.policy),
            },
          }),

          increaseVerificationSteps({ accountId: ctx.account.id }),
        ]);

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
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
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
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            favicon: input.fav_icon_url,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
      }
    }),

  addStamp: privateProcedure
    .input(
      z.object({
        stempUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const stamp = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            stamp: input?.stempUrl,
          },
        });

        return stamp;
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
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
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
