import { privateProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/src/lib/domains";

export const domain = {
  // this if the user wants to chnage it's subdomain
  chnageSubDmain: privateProcedure
    .input(
      z.object({
        subdomain: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });
        // if the subdomain exists in the data base then throw an error
        const webSiteWithSameSubDomain = await ctx.prisma.website.findFirst({
          where: {
            subdomain: input.subdomain,
          },
        });

        if (webSiteWithSameSubDomain) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "sub domain exists in the database and it has be unique",
          });
        }
        const site = await ctx.prisma.website.update({
          data: {
            subdomain: input.subdomain,
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

  // in here we need to set a custom domain fot the user
  setCustomDomain: privateProcedure
    .input(
      z.object({
        customdomain: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.user.id },
      });
      const site = await ctx.prisma.website.findFirst({
        where: { accountId: account.id },
      });

      if (input.customdomain.includes("jadir.vercel.app/")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot use vercel.pub subdomain as your custom domain",
        });

        // if the custom domain is valid, we need to add it to Vercel
      } else if (validDomainRegex.test(input.customdomain)) {
        const response = await ctx.prisma.website.update({
          where: {
            accountId: account.id,
          },
          data: {
            customDomain: input.customdomain,
          },
        });
        await Promise.all([
          addDomainToVercel(input.customdomain),
          // Optional: add www subdomain as well and redirect to apex domain
          addDomainToVercel(`www.${input.customdomain}`),
        ]);

        // empty value means the user wants to remove the custom domain
      } else if (input.customdomain === "") {
        const response = await ctx.prisma.website.update({
          where: {
            accountId: account.id,
          },
          data: {
            customDomain: null,
          },
        });
      }

      // if the site had a different customDomain before, we need to remove it from Vercel
      if (site.customDomain && site.customDomain !== input.customdomain) {
        const response = await removeDomainFromVercelProject(site.customDomain);

        /* Optional: remove domain from Vercel team 

        // first, we need to check if the apex domain is being used by other sites
        const apexDomain = getApexDomain(`https://${site.customDomain}`);
        const domainCount = await prisma.site.count({
          where: {
            OR: [
              {
                customDomain: apexDomain,
              },
              {
                customDomain: {
                  endsWith: `.${apexDomain}`,
                },
              },
            ],
          },
        });

        // if the apex domain is being used by other sites
        // we should only remove it from our Vercel project
        if (domainCount >= 1) {
          await removeDomainFromVercelProject(site.customDomain);
        } else {
          // this is the only site using this apex domain
          // so we can remove it entirely from our Vercel team
          await removeDomainFromVercelTeam(
            site.customDomain
          );
        }
        
        */

        return site;
      }
    }),
};
