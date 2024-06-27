/**
 * Module for retrieving data related to pages, courses, and website configuration.
 * Includes functions to fetch specific pages, all courses, site data, and Chargily keys.
 * @requires prisma Prisma client for database operations.
 * @requires ThemePage Interface representing a theme page.
 * @requires Website Interface representing website data.
 */

import { prisma } from "database/src";
import { Course, Website } from "database";
import { getStudent } from "./auth";
import { CourseWithEpisode, StudentBag } from "@/src/types";

/**
 * Function to retrieve a specific page based on its path and subdomain.
 * @param path The path of the page to be retrieved.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to the retrieved page or null if not found.
 */
/**
 * Function to retrieve all courses associated with a subdomain.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to an array of courses with current episode information.
 */
export const getAllCourses = async ({
  subdomain,
}: {
  subdomain: string;
}): Promise<CourseWithEpisode[]> => {
  try {
    const website = await prisma.website.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!website) {
      throw new Error("Website not found for the given subdomain");
    }

    const [account, student] = await Promise.all([
      prisma.account.findUnique({
        where: {
          id: website.accountId,
        },
      }),
      getStudent(),
    ]);

    if (!account) {
      throw new Error("No account linked to this website");
    }

    const bag: StudentBag = student
      ? JSON.parse(student.bag as string)
      : { courses: [] };

    const courses = await prisma.course.findMany({
      where: {
        accountId: account.id,
      },
    });

    const filteredCourses = courses
      .filter((item) => item.status === "PUBLISED")
      .map((course) => {
        const studentCourse = bag.courses?.find(
          (c) => c.course.id === course.id
        );
        return {
          ...course,
          currentEpisode: studentCourse?.currentEpisode ?? null,
          owned: studentCourse?.course ? true : false,
        };
      });

    return filteredCourses;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve courses");
  }
};

/**
 * Function to retrieve all courses associated with a subdomain.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to an array of courses.
 */
export const getAllProducts = async ({ subdomain }: { subdomain: string }) => {
  try {
    const website = await prisma.website.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    const account = await prisma.account.findUnique({
      where: {
        id: website?.accountId,
      },
    });

    if (!account) {
      throw new Error("there no account linked to this website");
    }

    const products = await prisma.product.findMany({
      where: {
        accountId: account?.id,
      },
    });

    const filteredCourses = products.filter(
      (item) => item.status === "PUBLISED"
    );
    return filteredCourses;
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

  const payments = await prisma.paymentsConnect.findFirst({
    where: {
      accountId: website.accountId,
    },
  });

  if (!payments) {
    throw new Error("chargily is not connected");
  }

  return {
    chargilyPublicKey: payments?.chargilyPublicKey,
    chargiySecretKey: payments?.chargilySecretKey,
  };
};

/**
 * Function to retrieve all courses associated with a subdomain that the student owns.
 * @param subdomain The subdomain associated with the website.
 * @returns A Promise that resolves to an array of courses with current episode information.
 */
export const getCoursesStudentOwns = async ({
  subdomain,
}: {
  subdomain: string;
}): Promise<CourseWithEpisode[]> => {
  try {
    const website = await prisma.website.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!website) {
      throw new Error("Website not found for the given subdomain");
    }

    const [account, student] = await Promise.all([
      prisma.account.findUnique({
        where: {
          id: website.accountId,
        },
      }),
      getStudent(),
    ]);

    if (!account) {
      throw new Error("No account linked to this website");
    }

    if (!student) {
      throw new Error("No student found");
    }

    const bag: StudentBag = student
      ? JSON.parse(student.bag as string)
      : { courses: [] };

    const studentCourseIds =
      bag.courses?.map((studentCourse) => studentCourse.course.id) || [];

    const courses = await prisma.course.findMany({
      where: {
        accountId: account.id,
        id: {
          in: studentCourseIds,
        },
        status: "PUBLISED",
      },
    });

    const filteredCourses: CourseWithEpisode[] = courses.map((course) => {
      const studentCourse = bag.courses?.find((c) => c.course.id === course.id);
      return {
        ...course,
        currentEpisode: studentCourse?.currentEpisode ?? 0,
      } as CourseWithEpisode;
    });

    return filteredCourses;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve courses");
  }
};
