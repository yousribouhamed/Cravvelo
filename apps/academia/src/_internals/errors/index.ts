import { prisma } from "database/src";
import { z } from "zod";
import type { Account, Website } from "@prisma/client";

/**
 * Type representing the selected Account fields used in tenant queries
 */
export type SelectedAccount = Pick<
  Account,
  | "id"
  | "user_name"
  | "user_bio"
  | "avatarUrl"
  | "verified"
  | "firstName"
  | "lastName"
  | "profession"
  | "company"
  | "preferredLanguage"
  | "profileVisibility"
>;

/**
 * Type representing a Website with its related Account (with selected fields)
 */
export type WebsiteWithAccount = Website & {
  Account: SelectedAccount;
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
  /** Account data (for convenience) - contains selected fields only */
  account: SelectedAccount;
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
