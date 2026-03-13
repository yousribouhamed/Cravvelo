import { headers } from "next/headers";
import { prisma } from "database/src";
import { cache } from "react";
import {
  TenantError,
  ValidationError,
  WithTenantOptions,
} from "./errors";
import { DATABASE_UNAVAILABLE_MESSAGE } from "./tenant-errors";

/**
 * Extract tenant subdomain from request headers
 * Handles both development (localhost:3000) and production (tenant.cravvelo.com) environments
 */
const getTenantFromRequest = cache(async (): Promise<string | null> => {
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

    // Development environment - any host containing localhost (e.g. localhost:3001 or twice.localhost:3001)
    if (normalizedHost.includes("localhost")) {
      if (process.env.NODE_ENV !== "development") return null;
      // Plain localhost:<port> -> default tenant
      if (normalizedHost === "localhost") {
        return "twice.cravvelo.com";
      }
      // Subdomain.localhost:<port> (e.g. twice.localhost:3001) -> extract subdomain
      const subdomain = normalizedHost.split(".")[0];
      if (subdomain && subdomain !== "localhost") {
        return `${subdomain.replace(/[^a-zA-Z0-9-]/g, "")}.cravvelo.com`;
      }
      return "twice.cravvelo.com";
    }

    // Production environment - use full host as tenant key (subdomain or custom domain)
    return normalizedHost;
  } catch (error) {
    console.error("Error extracting tenant from request:", error);
    return null;
  }
});

const getWebsiteForTenant = cache(async (tenant: string) => {
  return prisma.website.findFirst({
    where: {
      OR: [{ subdomain: tenant }, { customDomain: tenant }],
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
});

const PUBLIC_ERROR_MESSAGES = {
  tenantUnavailable: "Unable to resolve tenant context",
  websiteNotFound: "Academy website not found",
  accountNotFound: "Academy account not found",
  websiteSuspended: "Academy website is not available",
  actionFailed: "Request failed. Please try again.",
  databaseUnavailable: DATABASE_UNAVAILABLE_MESSAGE,
} as const;

/**
 * Higher-order function that wraps server actions with tenant data fetching
 * and Zod validation, providing type-safe access to tenant information
 *
 * @template TInput - The type of input after Zod validation
 * @template TOutput - The return type of the handler function
 * @param options - Configuration options including Zod schema and handler
 * @returns Server action function with tenant data
 *
 * @example
 * ```typescript
 * const createUser = withTenant({
 *   input: z.object({
 *     name: z.string().min(1),
 *     email: z.string().email(),
 *   }),
 *   handler: async ({ website, account, accountId, input, db }) => {
 *     return await db.student.create({
 *       data: {
 *         full_name: input.name,
 *         email: input.email,
 *         accountId: accountId,
 *       },
 *     });
 *   },
 * });
 * ```
 */
export function withTenant<TInput = void, TOutput = void>(
  options: WithTenantOptions<TInput, TOutput>
): (input?: TInput) => Promise<TOutput> {
  const { input: inputSchema, handler, checkSuspended = true } = options;

  return async (input?: TInput): Promise<TOutput> => {
    try {
      // Validate input if schema is provided
      let validatedInput: TInput;

      if (inputSchema) {
        const validationResult = inputSchema.safeParse(input);

        if (!validationResult.success) {
          const errorMessage = validationResult.error.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", ");

          throw new ValidationError(`Input validation failed: ${errorMessage}`);
        }

        validatedInput = validationResult.data;
      } else {
        // If no schema provided, use input as-is
        validatedInput = input as TInput;
      }

      // Extract tenant from request
      const tenant = await getTenantFromRequest();

      if (!tenant) {
        throw new TenantError(PUBLIC_ERROR_MESSAGES.tenantUnavailable);
      }

      // Fetch website with account data
      const website = await getWebsiteForTenant(tenant);

      if (!website) {
        throw new TenantError(PUBLIC_ERROR_MESSAGES.websiteNotFound);
      }

      if (!website.Account) {
        throw new TenantError(PUBLIC_ERROR_MESSAGES.accountNotFound);
      }

      // Check if website is suspended
      if (checkSuspended && website.suspended) {
        throw new TenantError(PUBLIC_ERROR_MESSAGES.websiteSuspended);
      }

      // Execute handler with validated input and tenant data
      return await handler({
        website: website,
        account: website.Account,
        accountId: website.Account.id,
        tenant,
        input: validatedInput,
        db: prisma,
      });
    } catch (error) {
      // Re-throw known errors
      if (error instanceof TenantError || error instanceof ValidationError) {
        throw error;
      }

      // Prisma connectivity errors: DB unreachable (P1001) or connection pool timeout (P2024)
      const prismaCode = (error as { code?: string })?.code;
      if (prismaCode === "P1001" || prismaCode === "P2024") {
        console.error("Database unreachable or pool timeout in withTenant:", error);
        throw new TenantError(PUBLIC_ERROR_MESSAGES.databaseUnavailable);
      }

      // Handle other unexpected errors
      console.error("Unexpected error in withTenant:", error);
      throw new Error(PUBLIC_ERROR_MESSAGES.actionFailed);
    }
  };
}

/**
 * Variant of withTenant that allows suspended websites
 * Useful for admin actions or maintenance operations
 */
export function withTenantAllowSuspended<TInput = void, TOutput = void>(
  options: Omit<WithTenantOptions<TInput, TOutput>, "checkSuspended">
): (input?: TInput) => Promise<TOutput> {
  return withTenant({
    ...options,
    checkSuspended: false,
  });
}

/**
 * Type helper for extracting input type from a withTenant function
 */
export type ExtractTenantInput<T> = T extends (input?: infer U) => any
  ? U
  : never;

/**
 * Type helper for extracting output type from a withTenant function
 */
export type ExtractTenantOutput<T> = T extends (input?: any) => Promise<infer U>
  ? U
  : never;
