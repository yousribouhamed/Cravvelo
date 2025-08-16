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
    const host = headersList.get("host");

    if (!host) return null;

    // Extract subdomain from host (e.g., "tenant.cravvelo.com" -> "tenant")
    const parts = host.split(".");
    if (parts.length >= 3 && parts[1] === "cravvelo" && parts[2] === "com") {
      return parts[0];
    }

    return null;
  } catch (error) {
    console.error("Error extracting tenant from request:", error);
    return null;
  }
}

/**
 * Get tenant website and account data from subdomain
 */
export async function getTenantData(
  subdomain: string
): Promise<TenantData | null> {
  try {
    const website = await prisma.website.findUnique({
      where: {
        subdomain: subdomain,
        suspended: false,
      },
      include: {
        Account: true,
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
    const website = await prisma.website.findUnique({
      where: {
        subdomain: subdomain,
        suspended: false,
      },
      select: {
        Account: true,
      },
    });

    return website?.Account || null;
  } catch (error) {
    console.error("Error fetching tenant account:", error);
    return null;
  }
}
