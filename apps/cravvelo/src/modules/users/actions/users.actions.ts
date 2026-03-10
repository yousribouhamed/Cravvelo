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

    const [accountsRaw, totalCount] = await Promise.all([
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
          AccountSubscription: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
              planCode: true,
              billingCycle: true,
              status: true,
              currentPeriodEnd: true,
            },
          },
        },
      }),
      db.account.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const accounts: UserListItem[] = accountsRaw.map((a) => {
      const sub = a.AccountSubscription?.[0];
      return {
        id: a.id,
        userId: a.userId,
        user_name: a.user_name,
        firstName: a.firstName,
        lastName: a.lastName,
        support_email: a.support_email,
        isActive: a.isActive,
        isSuspended: a.isSuspended,
        createdAt: a.createdAt,
        subscription: sub
          ? {
              planCode: sub.planCode,
              billingCycle: sub.billingCycle,
              status: sub.status,
              currentPeriodEnd: sub.currentPeriodEnd,
            }
          : null,
      };
    });

    return {
      accounts,
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

export const getAccountCount = withAuth({
  auth: {
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  handler: async ({ db }) => {
    const count = await db.account.count();
    return { count };
  },
});
