"use server";

import { prisma } from "database/src";
import { getTenantWebsite } from "./tanant";

const PAGE_SIZE = 10;

export type TestimonialItem = {
  id: string;
  content: string;
  rating: number;
  reviewerName: string;
  courseTitle: string | null;
  createdAt: Date;
};

export async function getTestimonials(
  tenant: string,
  cursor?: string | null,
  limit: number = PAGE_SIZE
): Promise<{ data: TestimonialItem[]; nextCursor: string | null }> {
  const website = await getTenantWebsite(tenant);
  if (!website) return { data: [], nextCursor: null };

  const accountId = website.accountId;

  const items = await prisma.comment.findMany({
    where: {
      accountId,
      isApproved: true,
      isPublic: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      content: true,
      rating: true,
      createdAt: true,
      Course: { select: { title: true } },
      Student: { select: { full_name: true } },
    },
  });

  const hasMore = items.length > limit;
  const list = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? list[list.length - 1]?.id ?? null : null;

  const data: TestimonialItem[] = list.map((c) => ({
    id: c.id,
    content: c.content,
    rating: c.rating,
    reviewerName: c.Student?.full_name ?? "Student",
    courseTitle: c.Course?.title ?? null,
    createdAt: c.createdAt,
  }));

  return { data, nextCursor };
}
