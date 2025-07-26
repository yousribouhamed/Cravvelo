import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "database/src";
import { z } from "zod";
import type { User } from "@clerk/nextjs/server";
import type { Account, Website } from "@prisma/client";

/**
 * Type representing an Account with its related Website
 */
export type AccountWithWebsite = Account & {
  Website: Website | null;
};

/**
 * Authentication error class for better error handling
 */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
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
export interface HandlerParams<TInput> {
  /** Authenticated Clerk user */
  user: User;
  /** User's account with website information */
  account: AccountWithWebsite;
  /** Validated input data */
  input: TInput;
}

/**
 * Configuration options for the withAuth wrapper
 */
export interface WithAuthOptions<TInput, TOutput> {
  /** Optional Zod schema for input validation */
  input?: z.ZodType<TInput>;
  /** Handler function to execute after authentication and validation */
  handler: (params: HandlerParams<TInput>) => Promise<TOutput>;
  /** Whether to require an account (default: true) */
  requireAccount?: boolean;
}

/**
 * Higher-order function that wraps server actions with Clerk authentication
 * and Zod validation, providing a type-safe, tRPC-like experience
 *
 * @template TInput - The type of input after Zod validation
 * @template TOutput - The return type of the handler function
 * @param options - Configuration options including Zod schema and handler
 * @returns Authenticated and validated server action function
 *
 * @example
 * ```typescript
 * const createCourse = withAuth({
 *   input: z.object({
 *     title: z.string().min(1),
 *     description: z.string().optional(),
 *   }),
 *   handler: async ({ user, account, input }) => {
 *     return await prisma.course.create({
 *       data: {
 *         title: input.title,
 *         description: input.description,
 *         accountId: account.id,
 *       },
 *     });
 *   },
 * });
 * ```
 */
export function withAuth<TInput = void, TOutput = void>(
  options: WithAuthOptions<TInput, TOutput>
): (input?: TInput) => Promise<TOutput> {
  const { input: inputSchema, handler, requireAccount = true } = options;

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

      // Authenticate user
      const user = await currentUser();

      if (!user) {
        throw new AuthenticationError("User not authenticated");
      }

      // Fetch account with website information
      const account = await prisma.account.findUnique({
        where: {
          userId: user.id,
        },
        include: {
          Website: true,
        },
      });

      // Check if account is required and exists
      if (requireAccount && !account) {
        throw new AuthenticationError("User account not found");
      }

      // Execute handler with validated input and authenticated data
      return await handler({
        user,
        account: account
          ? {
              ...account,
              Website: Array.isArray(account.Website)
                ? account.Website[0] ?? null
                : account.Website,
            }
          : (null as unknown as AccountWithWebsite),
        input: validatedInput,
      });
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof AuthenticationError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      // Handle unexpected errors
      console.error("Unexpected error in withAuth:", error);
      throw new Error(
        `Server action failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
}

/**
 * Variant of withAuth that doesn't require an account to exist
 * Useful for onboarding flows or initial setup actions
 */
export function withAuthOptionalAccount<TInput = void, TOutput = void>(
  options: Omit<WithAuthOptions<TInput, TOutput>, "requireAccount">
): (input?: TInput) => Promise<TOutput> {
  return withAuth({
    ...options,
    requireAccount: false,
  });
}

/**
 * Type helper for extracting input type from a withAuth function
 */
export type ExtractInput<T> = T extends (input?: infer U) => any ? U : never;

/**
 * Type helper for extracting output type from a withAuth function
 */
export type ExtractOutput<T> = T extends (input?: any) => Promise<infer U>
  ? U
  : never;
