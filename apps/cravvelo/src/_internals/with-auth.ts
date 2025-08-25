import { prisma } from "database/src";
import { getCurrentAdmin } from "@/modules/auth/actions/auth.action";
import type {
  AuthenticatedAdmin,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  WithAuthOptions,
  RoleRequirement,
} from "./auth-types";

/**
 * Check if admin meets authorization requirements
 */
async function checkAuthorization(
  admin: AuthenticatedAdmin,
  auth: RoleRequirement
): Promise<boolean> {
  // Check roles
  if (auth.roles && auth.roles.length > 0) {
    if (!auth.roles.includes(admin.role)) {
      return false;
    }
  }

  // Check permissions
  if (auth.permissions && auth.permissions.length > 0) {
    const adminPermissions = admin.permissions || {};
    for (const permission of auth.permissions) {
      if (!adminPermissions[permission]) {
        return false;
      }
    }
  }

  // Check custom authorization
  if (auth.customAuth) {
    const customResult = await auth.customAuth(admin);
    if (!customResult) {
      return false;
    }
  }

  return true;
}

/**
 * Higher-order function that wraps server actions with admin authentication,
 * authorization, and Zod validation, providing a type-safe experience
 */
export function withAuth<TInput = void, TOutput = void>(
  options: WithAuthOptions<TInput, TOutput>
): (input?: TInput) => Promise<{
  success: boolean;
  data?: TOutput;
  error?: string;
  message?: string;
}> {
  const { input: inputSchema, handler, auth, action } = options;

  return async (input?: TInput) => {
    try {
      // Validate input if schema is provided
      let validatedInput: TInput;

      if (inputSchema) {
        const validationResult = inputSchema.safeParse(input);

        if (!validationResult.success) {
          const errorMessage = validationResult.error.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", ");

          return {
            success: false,
            error: `Input validation failed: ${errorMessage}`,
          };
        }

        validatedInput = validationResult.data;
      } else {
        // If no schema provided, use input as-is
        validatedInput = input as TInput;
      }

      // Authenticate admin
      const admin = await getCurrentAdmin();

      if (!admin) {
        return {
          success: false,
          error: "Authentication required",
        };
      }

      // Check authorization if requirements are specified
      if (auth) {
        //@ts-expect-error
        const isAuthorized = await checkAuthorization(admin, auth);
        if (!isAuthorized) {
          return {
            success: false,
            error: "Insufficient permissions",
          };
        }
      }

      // Log admin activity if action is specified
      if (action) {
        await prisma.adminActivity
          .create({
            data: {
              adminId: admin.id,
              action,
              //@ts-expect-error
              meta: {
                timestamp: new Date().toISOString(),
                inputData: inputSchema ? validatedInput : null,
              },
            },
          })
          .catch((error) => {
            console.warn("Failed to log admin activity:", error);
          });
      }

      // Execute handler with validated input and authenticated data
      const result = await handler({
        //@ts-expect-error
        admin,
        input: validatedInput,
        db: prisma,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error in withAuth:", error);

      // Handle known error types
      if (error instanceof Error) {
        if (error.name === "AuthenticationError") {
          return {
            success: false,
            error: "Authentication required",
          };
        }

        if (error.name === "AuthorizationError") {
          return {
            success: false,
            error: "Insufficient permissions",
          };
        }

        if (error.name === "ValidationError") {
          return {
            success: false,
            error: error.message,
          };
        }
      }

      // Handle unexpected errors
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };
}

/**
 * Variant of withAuth for super admin only actions
 */
export function withSuperAdminAuth<TInput = void, TOutput = void>(
  options: Omit<WithAuthOptions<TInput, TOutput>, "auth">
): (input?: TInput) => Promise<{
  success: boolean;
  data?: TOutput;
  error?: string;
  message?: string;
}> {
  return withAuth({
    ...options,
    auth: {
      roles: ["SUPER_ADMIN"],
    },
  });
}

/**
 * Variant of withAuth that only requires authentication (no role/permission checks)
 */
export function withBasicAuth<TInput = void, TOutput = void>(
  options: Omit<WithAuthOptions<TInput, TOutput>, "auth">
): (input?: TInput) => Promise<{
  success: boolean;
  data?: TOutput;
  error?: string;
  message?: string;
}> {
  return withAuth({
    ...options,
    // No auth requirements, just authentication
  });
}
