import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

/**
 * Type representing an authenticated admin
 */
export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: any;
}

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
 * Authorization error class for permission failures
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
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
  /** Authenticated admin user */
  admin: AuthenticatedAdmin;
  /** Validated input data */
  input: TInput;
  /** Database client */
  db: PrismaClient;
}

/**
 * Role-based authorization configuration
 */
export interface RoleRequirement {
  /** Required roles (admin must have one of these) */
  roles?: string[];
  /** Required permissions (admin must have all of these) */
  permissions?: string[];
  /** Custom authorization function */
  customAuth?: (admin: AuthenticatedAdmin) => boolean | Promise<boolean>;
}

/**
 * Configuration options for the withAuth wrapper
 */
export interface WithAuthOptions<TInput, TOutput> {
  /** Optional Zod schema for input validation */
  input?: z.ZodType<TInput>;
  /** Handler function to execute after authentication and validation */
  handler: (params: HandlerParams<TInput>) => Promise<TOutput>;
  /** Role and permission requirements */
  auth?: RoleRequirement;
  /** Action name for logging (optional) */
  action?: string;
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

/**
 * Utility function to create permission objects
 */
export function createPermissions(
  permissions: string[]
): Record<string, boolean> {
  return permissions.reduce((acc, permission) => {
    acc[permission] = true;
    return acc;
  }, {} as Record<string, boolean>);
}

/**
 * Common permission constants
 */
export const PERMISSIONS = {
  // Admin management
  CREATE_ADMIN: "CREATE_ADMIN",
  UPDATE_ADMIN: "UPDATE_ADMIN",
  DELETE_ADMIN: "DELETE_ADMIN",
  VIEW_ADMINS: "VIEW_ADMINS",

  // System management
  MANAGE_SETTINGS: "MANAGE_SETTINGS",
  VIEW_LOGS: "VIEW_LOGS",
  SYSTEM_BACKUP: "SYSTEM_BACKUP",

  // Content management
  CREATE_CONTENT: "CREATE_CONTENT",
  UPDATE_CONTENT: "UPDATE_CONTENT",
  DELETE_CONTENT: "DELETE_CONTENT",
  PUBLISH_CONTENT: "PUBLISH_CONTENT",
} as const;

/**
 * Common role constants
 */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  EDITOR: "EDITOR",
} as const;
