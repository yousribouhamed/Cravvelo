"use server";

import { WebSitePage } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "database/src";

export const getUserPages = async ({
  accountId,
}: {
  accountId: string;
}): Promise<WebSitePage[] | null> => {
  const website = await prisma.website.findFirst({
    where: {
      accountId: accountId,
    },
  });

  if (!website) return null;

  const pages = JSON.parse(website.pages as string) as WebSitePage[];
  // get the pages

  return pages;
};
