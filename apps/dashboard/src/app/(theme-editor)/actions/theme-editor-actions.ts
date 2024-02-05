"use server";

import { prisma } from "database/src";
import { ThemePage } from "../theme-editor-store";

export const getUserThemePages = async ({
  accountId,
}: {
  accountId: string;
}): Promise<ThemePage[] | null> => {
  const website = await prisma.website.findFirst({
    where: {
      accountId: accountId,
    },
  });

  if (!website) return null;

  const pages = JSON.parse(website.pages as string) as ThemePage[];
  // get the pages

  return pages;
};
