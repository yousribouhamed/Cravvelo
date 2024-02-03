"use server";

import { WebSitePage } from "@/src/types";
import { prisma } from "database/src";

export const getPage = async ({
  path,
  subdomain,
}: {
  path: string;
  subdomain: string;
}): Promise<WebSitePage> => {
  // get all the pages

  const website = await prisma.website.findFirst({
    where: {
      subdomain,
    },
  });

  const pages = JSON.parse(website.pages as string) as WebSitePage[];

  const page = pages.find((item) => item.pathname === path);

  return page;
};
