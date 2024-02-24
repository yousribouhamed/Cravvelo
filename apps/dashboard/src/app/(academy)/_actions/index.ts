/**
 * Module for retrieving data related to pages, courses, and website configuration.
 * Includes functions to fetch specific pages, all courses, site data, and Chargily keys.
 * @requires prisma Prisma client for database operations.
 * @requires ThemePage Interface representing a theme page.
 * @requires Website Interface representing website data.
 */

import { prisma } from "database/src"; // Importing Prisma client for database operations
import { ThemePage } from "../../(theme-editor)/theme-editor-store"; // Importing ThemePage interface for representing a theme page
import { Website } from "database"; // Importing Website interface representing website data

/**
 * Function to retrieve a specific page based on its path and subdomain.
 * @param path The path of the page to be retrieved.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to the retrieved page or null if not found.
 */
export const getPage = async ({
  path,
  subdomain,
}: {
  path: string;
  subdomain: string;
}): Promise<ThemePage | null> => {
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

/**
 * Function to retrieve all courses associated with a subdomain.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to an array of courses.
 */
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

/**
 * Function to retrieve website data based on a subdomain.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to the retrieved website data.
 */
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

/**
 * Function to retrieve Chargily keys (public and secret) based on a subdomain.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to Chargily keys (public and secret).
 */
export const getChargilyKeys = async ({ subdomain }: { subdomain: string }) => {
  const website = await getSiteData({ subdomain });

  console.log("this is the website");
  console.log(website);
  const payments = await prisma.paymentsConnect.findFirst({
    where: {
      accountId: website.accountId,
    },
  });

  console.log("this is the Chargily credential");
  console.log(payments);

  return {
    chargilyPublicKey: payments?.chargilyPublicKey,
    chargiySecretKey: payments?.chargiySecretKey,
  };
};
