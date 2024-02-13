"use server";

import { prisma } from "database/src";
import { ThemePage } from "../../(theme-editor)/theme-editor-store";
import { Website } from "database";

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

  if (!website) return null;

  const pages = JSON.parse(website.pages as string) as ThemePage[];

  const page = pages.find((item) => item.path === path);

  return page;
};

export const getAllCourses = async ({ subdomain }: { subdomain: string }) => {
  try {
    const website = await prisma.website.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    const account = await prisma.account.findUnique({
      where: {
        id: website.accountId,
      },
    });

    const courses = await prisma.course.findMany({
      where: {
        accountId: account.id,
      },
    });
    return courses;
  } catch (err) {
    console.error(err);
  }
};

export const getSiteData = async ({
  subdomain,
}: {
  subdomain: string;
}): Promise<Website> => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        subdomain,
      },
    });

    return website;
  } catch (err) {
    console.error(err);
  }
};
