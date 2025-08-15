import { privateProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/src/lib/domains";
import axios from "axios";

import {
  DomainResponse,
  DomainVerificationStatusProps,
} from "@/src/types/domain-types";

type Response = {
  status: DomainVerificationStatusProps;
  domainJson: DomainResponse & { error: { code: string; message: string } };
};

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

      if (input.customdomain.includes("cravvelo.com")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot use cravvelo.com subdomain as your custom domain",
        });
      }

      // Remove old domain from Vercel if it exists and is different
      if (site.customDomain && site.customDomain !== input.customdomain) {
        await removeDomainFromVercelProject(site.customDomain);
      }

      let updatedSite;

      if (input.customdomain === "") {
        // User wants to remove the custom domain
        updatedSite = await ctx.prisma.website.update({
          where: {
            accountId: account.id,
          },
          data: {
            customDomain: null,
          },
        });
      } else if (validDomainRegex.test(input.customdomain)) {
        // User wants to set a new custom domain
        updatedSite = await ctx.prisma.website.update({
          where: {
            accountId: account.id,
          },
          data: {
            customDomain: input.customdomain,
          },
        });

        // Add domain to Vercel
        await Promise.all([
          addDomainToVercel(input.customdomain),
          // Optional: add www subdomain as well and redirect to apex domain
          // addDomainToVercel(`www.${input.customdomain}`),
        ]);

        console.log("Domain added to Vercel");
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid domain format",
        });
      }

      return updatedSite;
    }),

  getDomainStatus: privateProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input }) => {
      try {
        const data: Response = (await axios.get(
          `http://localhost:3001/api/domain/${input.domain}/verify`
        )) as Response;

        console.log(data);
        return data;
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "something went wrong",
        });
      }
    }),
};
