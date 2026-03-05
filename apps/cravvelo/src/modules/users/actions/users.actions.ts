"use server";

import { withAuth } from "@/_internals/with-auth";
import { ROLES } from "@/_internals/auth-types";
import { z } from "zod";
import type { UserListItem } from "../types";

const getUsersQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const getAllUsers = withAuth({
  input: getUsersQuerySchema,
  auth: {
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  handler: async ({ input, db }) => {
    const { page = 1, limit = 10, search } = input;

    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<
        | { user_name: { contains: string; mode: "insensitive" } }
        | { firstName: { contains: string; mode: "insensitive" } }
        | { lastName: { contains: string; mode: "insensitive" } }
        | { support_email: { contains: string; mode: "insensitive" } }
      >;
    } = {};

    if (search && search.trim()) {
      where.OR = [
        { user_name: { contains: search.trim(), mode: "insensitive" } },
        { firstName: { contains: search.trim(), mode: "insensitive" } },
        { lastName: { contains: search.trim(), mode: "insensitive" } },
        { support_email: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [accounts, totalCount] = await Promise.all([
      db.account.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          user_name: true,
          firstName: true,
          lastName: true,
          support_email: true,
          isActive: true,
          isSuspended: true,
          createdAt: true,
        },
      }),
      db.account.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      accounts: accounts as unknown as UserListItem[],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    };
  },
  action: "VIEW_USERS",
});
