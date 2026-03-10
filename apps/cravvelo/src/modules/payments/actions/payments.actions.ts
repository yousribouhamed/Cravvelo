"use server";

import { withAuth } from "@/_internals/with-auth";
import { ROLES } from "@/_internals/auth-types";
import { z } from "zod";
import type { PaymentListItem, PaymentsPagination } from "../types";

const getPaymentsQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

function accountDisplayName(account: {
  user_name: string | null;
  firstName: string | null;
  lastName: string | null;
}): string | null {
  const name = account.user_name?.trim();
  if (name) return name;
  const first = account.firstName?.trim();
  const last = account.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return null;
}

export const getAllPayments = withAuth({
  input: getPaymentsQuerySchema,
  auth: {
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  handler: async ({ input, db }) => {
    const { page = 1, limit = 10, search } = input;
    const skip = (page - 1) * limit;
    const searchTrim = search?.trim();

    const where: {
      OR?: Array<
        | { gatewayId: { contains: string; mode: "insensitive" } }
        | { description: { contains: string; mode: "insensitive" } }
        | { Account: { support_email: { contains: string; mode: "insensitive" } } }
        | { Student: { email: { contains: string; mode: "insensitive" } } }
      >;
    } = {};

    if (searchTrim) {
      where.OR = [
        { gatewayId: { contains: searchTrim, mode: "insensitive" } },
        { description: { contains: searchTrim, mode: "insensitive" } },
        { Account: { support_email: { contains: searchTrim, mode: "insensitive" } } },
        { Student: { email: { contains: searchTrim, mode: "insensitive" } } },
      ];
    }

    const [paymentsRaw, totalCount] = await Promise.all([
      db.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          amount: true,
          currency: true,
          status: true,
          method: true,
          createdAt: true,
          gatewayId: true,
          description: true,
          Account: {
            select: {
              support_email: true,
              user_name: true,
              firstName: true,
              lastName: true,
            },
          },
          Student: {
            select: {
              email: true,
              full_name: true,
            },
          },
        },
      }),
      db.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const payments: PaymentListItem[] = paymentsRaw.map((p) => ({
      id: p.id,
      type: p.type,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      method: p.method,
      createdAt: p.createdAt,
      accountEmail: p.Account?.support_email ?? null,
      accountName: p.Account ? accountDisplayName(p.Account) : null,
      studentEmail: p.Student?.email ?? null,
      studentName: p.Student?.full_name ?? null,
      gatewayId: p.gatewayId,
      description: p.description,
    }));

    const pagination: PaymentsPagination = {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page * limit < totalCount,
      hasPrev: page > 1,
    };

    return { payments, pagination };
  },
  action: "VIEW_PAYMENTS",
});
