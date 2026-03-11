"use server";

import { headers } from "next/headers";
import { prisma } from "database/src";

export interface TenantData {
  website: any;
  account: any;
}

/**
 * Extract tenant subdomain from request headers
 */
export async function getTenantFromRequest(): Promise<string | null> {
  try {
    const headersList = await headers();
    const forwardedTenant = headersList.get("x-tenant");
    if (forwardedTenant) {
      return forwardedTenant.toLowerCase();
    }

    const host =
      headersList.get("x-forwarded-host") ?? headersList.get("host");

    if (!host) return null;
    const normalizedHost = host.toLowerCase().split(":")[0];

    if (normalizedHost.includes("localhost")) {
      if (process.env.NODE_ENV !== "development") return null;

      if (normalizedHost === "localhost") {
        return "twice.cravvelo.com";
      }

      if (normalizedHost.endsWith(".localhost")) {
        const localSubdomain = normalizedHost.replace(".localhost", "");
        const sanitizedSubdomain = localSubdomain.replace(/[^a-zA-Z0-9-]/g, "");
        if (sanitizedSubdomain) {
          return `${sanitizedSubdomain}.cravvelo.com`;
        }
      }

      return "twice.cravvelo.com";
    }

    // Full host is the tenant key in production (subdomain or custom domain)
    return normalizedHost;
  } catch (error) {
    console.error("Error extracting tenant from request:", error);
    return null;
  }
}

/**
 * Get tenant website and account data from subdomain
 */
export async function getTenantData(
  tenantKey: string
): Promise<TenantData | null> {
  try {
    const website = await prisma.website.findFirst({
      where: {
        OR: [{ subdomain: tenantKey }, { customDomain: tenantKey }],
        suspended: false,
      },
      include: {
        Account: {
          select: {
            id: true,
            user_name: true,
            user_bio: true,
            avatarUrl: true,
            verified: true,
            firstName: true,
            lastName: true,
            profession: true,
            company: true,
            preferredLanguage: true,
            profileVisibility: true,
          },
        },
      },
    });

    if (!website || !website.Account) {
      return null;
    }

    return {
      website,
      account: website.Account,
    };
  } catch (error) {
    console.error("Error fetching tenant data:", error);
    return null;
  }
}

/**
 * Get tenant data directly from request (combines both functions)
 */
export async function getTenantDataFromRequest(): Promise<TenantData | null> {
  const subdomain = await getTenantFromRequest();

  if (!subdomain) {
    return null;
  }

  return getTenantData(subdomain);
}

/**
 * Get only the account data for a tenant
 */
export async function getTenantAccount(subdomain: string) {
  try {
    const website = await prisma.website.findFirst({
      where: {
        OR: [{ subdomain: subdomain }, { customDomain: subdomain }],
        suspended: false,
      },
      include: {
        Account: {
          select: {
            id: true,
            user_name: true,
            user_bio: true,
            avatarUrl: true,
            verified: true,
            firstName: true,
            lastName: true,
            profession: true,
            company: true,
            preferredLanguage: true,
            profileVisibility: true,
          },
        },
      },
    });

    return website?.Account || null;
  } catch (error) {
    console.error("Error fetching tenant account:", error);
    return null;
  }
}
