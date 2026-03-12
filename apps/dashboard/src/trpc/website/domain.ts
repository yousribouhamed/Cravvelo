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
import {
  sanitizeSubdomain,
  validateSubdomain,
} from "@/src/modules/settings/utils/wordsFilter";
import { prisma } from "database/src";

type Response = {
  status: DomainVerificationStatusProps;
  domainJson: DomainResponse & { error: { code: string; message: string } };
};

// Subdomain validation regex - alphanumeric and hyphens only, 3-32 chars
const subdomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,30}[a-zA-Z0-9]$/;

// List of restricted subdomain names
const restrictedSubdomains = [
  "admin",
  "api",
  "app",
  "www",
  "mail",
  "ftp",
  "smtp",
  "pop",
  "imap",
  "beta",
  "staging",
  "test",
  "dev",
  "development",
  "production",
  "prod",
  "support",
  "help",
  "status",
  "dashboard",
];

export const domain = {
  // Change subdomain with improved validation and error handling
  chnageSubDmain: privateProcedure
    .input(
      z.object({
        subdomain: z.string().min(3).max(64),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });

        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found",
          });
        }

        // Extract subdomain name from full domain (e.g., "test.cravvelo.com" -> "test")
        const subdomainName = input.subdomain.split(".")[0].toLowerCase();

        // Validate subdomain format
        if (!subdomainRegex.test(subdomainName)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Subdomain must be 3-32 characters long and contain only letters, numbers, and hyphens",
          });
        }

        // Check for restricted subdomains
        if (restrictedSubdomains.includes(subdomainName)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This subdomain is reserved and cannot be used",
          });
        }

        // Check if the subdomain already exists for another user
        const existingWebsite = await ctx.prisma.website.findFirst({
          where: {
            subdomain: input.subdomain,
            NOT: {
              accountId: account.id,
            },
          },
        });

        if (existingWebsite) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This subdomain is already taken. Please choose another.",
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
        if (err instanceof TRPCError) {
          throw err;
        }
        console.error("Error changing subdomain:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while updating the subdomain",
        });
      }
    }),

  setCustomDomain: privateProcedure
    .input(
      z.object({
        customdomain: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.user.id },
        });

        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found",
          });
        }

        const site = await ctx.prisma.website.findFirst({
          where: { accountId: account.id },
        });

        if (!site) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Website not found",
          });
        }

        // Prevent using cravvelo.com as custom domain
        if (input.customdomain.includes("cravvelo.com")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot use cravvelo.com subdomain as your custom domain",
          });
        }

        // Check if another user already has this custom domain
        if (input.customdomain !== "") {
          const existingDomain = await ctx.prisma.website.findFirst({
            where: {
              customDomain: input.customdomain,
              NOT: {
                accountId: account.id,
              },
            },
          });

          if (existingDomain) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "This domain is already in use by another website",
            });
          }
        }

        // Remove old domain from Vercel if it exists and is different
        if (site.customDomain && site.customDomain !== input.customdomain) {
          try {
            await removeDomainFromVercelProject(site.customDomain);
          } catch (removeError) {
            console.error("Error removing old domain from Vercel:", removeError);
            // Continue even if removal fails - the old domain might already be removed
          }
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
          try {
            await addDomainToVercel(input.customdomain);
          } catch (vercelError) {
            // Revert database change if Vercel add fails
            await ctx.prisma.website.update({
              where: {
                accountId: account.id,
              },
              data: {
                customDomain: site.customDomain, // Restore original
              },
            });

            console.error("Error adding domain to Vercel:", vercelError);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                "Failed to add domain to Vercel. Please check your domain settings and try again.",
            });
          }
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Invalid domain format. Please enter a valid domain (e.g., yourdomain.com)",
          });
        }

        return updatedSite;
      } catch (error) {
        // Handle unexpected errors
        if (error instanceof TRPCError) {
          throw error; // Re-throw TRPC errors as-is
        }

        console.error("Unexpected error in setCustomDomain:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while updating the custom domain",
        });
      }
    }),

  getDomainStatus: privateProcedure
    .input(z.object({ domain: z.string() }))
    .mutation(async ({ input }) => {
      try {
        if (!validDomainRegex.test(input.domain)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid domain format",
          });
        }

        const URL =
          process.env.NODE_ENV === "development"
            ? `http://localhost:3001/api/domain/${input.domain}/verify`
            : `https://beta.cravvelo.com/api/domain/${input.domain}/verify`;

        const response = await axios.get(URL);
        return response.data as Response;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        console.error("Error getting domain status:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check domain status",
        });
      }
    }),

  checkSubdomain: privateProcedure
    .input(
      z.object({
        subdomain: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const cleaned = sanitizeSubdomain(input.subdomain);

        if (!cleaned) {
          return {
            isValid: false,
            message: "Subdomain is required",
          };
        }

        const localValidation = validateSubdomain(cleaned);
        if (!localValidation.isValid) {
          return {
            isValid: false,
            message: localValidation.message,
            suggestion: localValidation.suggestion,
          };
        }

        // Additional regex and reserved-name checks for safety
        if (!subdomainRegex.test(cleaned)) {
          return {
            isValid: false,
            message:
              "Subdomain must be 3-32 characters long and contain only letters, numbers, and hyphens",
          };
        }

        if (restrictedSubdomains.includes(cleaned)) {
          return {
            isValid: false,
            message: "This subdomain is reserved and cannot be used",
          };
        }

        const existingWebsite = await prisma.website.findFirst({
          where: {
            subdomain: `${cleaned}.cravvelo.com`,
          },
        });

        if (existingWebsite) {
          return {
            isValid: false,
            message: "This subdomain is already taken. Please choose another.",
          };
        }

        return {
          isValid: true,
        };
      } catch (err) {
        console.error("Error checking subdomain:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to validate subdomain",
        });
      }
    }),
};
