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
        // const site = ctx.prisma.website.update({
        //   data: {
        //     font: input.font,
        //   },
        //   where: {
        //     accountId: ctx.account.id,
        //   },
        // });
        // return site;
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
        primaryColor: z.string(),
        darkPrimaryColor: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            primaryColor: input.primaryColor,
            primaryColorDark: input.darkPrimaryColor,
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
        const PolictAsJson = JSON.stringify(input.policy);

        console.log("this is the policy server");
        console.log(PolictAsJson);

        const [site] = await Promise.all([
          ctx.prisma.website.update({
            where: { accountId: ctx.account.id },
            data: {
              privacy_policy: PolictAsJson,
            },
          }),
          increaseVerificationSteps({ accountId: ctx.account.id }),
        ]);

        return site;
      } catch (err) {
        console.error("Error in addPolicy:", err);
        throw err; // Re-throw the error so tRPC can handle it
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

  addSocialLinks: privateProcedure
    .input(
      z.object({
        facebookUrl: z.string().optional(),
        twitterUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            facebookUrl: input.facebookUrl,
            twitterUrl: input.twitterUrl,
            instagramUrl: input.instagramUrl,
            linkedinUrl: input.linkedinUrl,
            youtubeUrl: input.youtubeUrl,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),

  addCurrencySettings: privateProcedure
    .input(
      z.object({
        currency: z.string(),
        currencySymbol: z.string(),
        language: z.string(),
        timezone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            currency: input.currency,
            currencySymbol: input.currencySymbol,
            language: input.language,
            timezone: input.timezone,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),

  addTermsOfService: privateProcedure
    .input(
      z.object({
        termsOfService: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const termsAsJson = JSON.stringify(input.termsOfService);

        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            terms_of_service: termsAsJson,
          },
        });

        return site;
      } catch (err) {
        console.error("Error in addTermsOfService:", err);
        throw err;
      }
    }),

  addRefundPolicy: privateProcedure
    .input(
      z.object({
        refundPolicy: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const refundAsJson = JSON.stringify(input.refundPolicy);

        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            refund_policy: refundAsJson,
          },
        });

        return site;
      } catch (err) {
        console.error("Error in addRefundPolicy:", err);
        throw err;
      }
    }),

  addAnalyticsIds: privateProcedure
    .input(
      z.object({
        googleAnalyticsId: z.string().optional(),
        facebookPixelId: z.string().optional(),
        tiktokPixelId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const site = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: {
            googleAnalyticsId: input.googleAnalyticsId,
            facebookPixelId: input.facebookPixelId,
            tiktokPixelId: input.tiktokPixelId,
          },
        });

        return site;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),

  updateWebsiteTheme: privateProcedure
    .input(z.record(z.string(), z.unknown()))
    .mutation(async ({ input, ctx }) => {
      try {
        const site = await ctx.prisma.website.findFirst({
          where: { accountId: ctx.account.id },
          select: { themeCustomization: true },
        });
        const existing = (site?.themeCustomization as Record<string, unknown>) ?? {};
        const merged = { ...existing, ...input };
        const updated = await ctx.prisma.website.update({
          where: { accountId: ctx.account.id },
          data: { themeCustomization: merged },
        });
        return updated;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
};
