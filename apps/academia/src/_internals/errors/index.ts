import { prisma } from "database/src";
import { z } from "zod";
import type { Account, Website } from "@prisma/client";

/**
 * Type representing a Website with its related Account
 */
export type WebsiteWithAccount = Website & {
  Account: Account;
};

/**
 * Tenant error class for better error handling
 */
export class TenantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantError";
  }
}

/**
 * Validation error class for input validation failures
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Parameters passed to the handler function
 */
export interface TenantHandlerParams<TInput> {
  /** Website data with account information */
  website: WebsiteWithAccount;
  /** Account data (for convenience) */
  account: Account;
  /** Account ID (for convenience) */
  accountId: string;
  /** Tenant subdomain */
  tenant: string;
  /** Validated input data */
  input: TInput;
  /** Prisma database instance */
  db: typeof prisma;
}

/**
 * Configuration options for the withTenant wrapper
 */
export interface WithTenantOptions<TInput, TOutput> {
  /** Optional Zod schema for input validation */
  input?: z.ZodType<TInput>;
  /** Handler function to execute after tenant validation */
  handler: (params: TenantHandlerParams<TInput>) => Promise<TOutput>;
  /** Whether to check if website is suspended (default: true) */
  checkSuspended?: boolean;
}
