import { headers } from "next/headers";
import { prisma } from "database/src";
import {
  TenantError,
  ValidationError,
  WebsiteWithAccount,
  WithTenantOptions,
} from "./errors";

/**
 * Extract tenant subdomain from request headers
 * Handles both development (localhost:3000) and production (tenant.cravvelo.com) environments
 */
async function getTenantFromRequest(): Promise<string | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");

    console.log("this is the host");
    console.log(host);

    if (!host) return null;

    // Development environment - check for localhost with port
    if (host.startsWith("localhost:") || host === "abdellah.localhost:3000") {
      // In development, you might want to:
      // 1. Use a default tenant for testing
      // 2. Extract from a query parameter or header
      // 3. Use environment variable

      // Option 1: Return a default tenant for development
      return process.env.NODE_ENV === "development" ? "abdellah" : null;

      // Option 2: Extract from a custom header (uncomment if needed)
      // const devTenant = headersList.get("x-tenant");
      // return devTenant || "dev-tenant";
    }

    // Production environment - extract subdomain from host
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

      console.log(tenant);

      if (!tenant) {
        throw new TenantError("Could not determine tenant from request");
      }

      // Fetch website with account data
      const website = await prisma.website.findUnique({
        where: {
          subdomain: `${tenant}.cravvelo.com`,
        },
        include: {
          Account: true,
        },
      });

      if (!website) {
        throw new TenantError(`Website not found for tenant: ${tenant}`);
      }

      if (!website.Account) {
        throw new TenantError(`Account not found for tenant: ${tenant}`);
      }

      // Check if website is suspended
      if (checkSuspended && website.suspended) {
        throw new TenantError(`Website is suspended for tenant: ${tenant}`);
      }

      // Execute handler with validated input and tenant data
      return await handler({
        website: website as WebsiteWithAccount,
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

      // Handle unexpected errors
      console.error("Unexpected error in withTenant:", error);
      throw new Error(
        `Tenant action failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
