"use server";

import { prisma } from "database/src";
import { ThemePage } from "../../(theme-editor)/theme-editor-store";

export const getPage = async ({
  path,
  subdomain,
}: {
  path: string;
  subdomain: string;
}): Promise<ThemePage | null> => {
  // get all the pages

  const website = await prisma.website.findFirst({
    where: {
      subdomain,
    },
  });

  console.log("this is the website we got");

  if (!website) return null;

  const pages = JSON.parse(website.pages as string) as ThemePage[];

  const page = pages.find((item) => item.path === path);

  return page;
};
