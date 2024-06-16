"use server";

import { prisma } from "database/src";

export const getAllSales = async ({
  accountId,
  end_date,
  start_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const sales = await prisma.sale.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date,
              lte: end_date,
            }
          : {},
    },
  });

  return sales;
};

export const getAllstudents = async ({
  accountId,
  end_date,
  start_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const students = await prisma.student.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date, // Start of date range
              lte: end_date, // End of date range
            }
          : {},
    },
  });

  return students;
};
export const getAllCommets = async ({
  accountId,
  end_date,
  start_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const comments = await prisma.comment.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date, // Start of date range
              lte: end_date, // End of date range
            }
          : {},
    },
  });

  return comments;
};

export const getAllNotifications = async ({
  accountId,
}: {
  accountId: string;
}) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
    orderBy: {
      createdAt: "desc", // Assuming 'createdAt' is the field that stores the date and time the notification was created
    },
    take: 30, // Limit the number of notifications to 30
  });
  return notifications;
};

export const getAllCourses = async ({ accountId }: { accountId: string }) => {
  const courses = await prisma.course.findMany({
    where: {
      accountId,
    },
    orderBy: {
      createdAt: "desc", // Assuming 'createdAt' is the field that stores the date and time the notification was created
    },
    take: 30, // Limit the number of notifications to 30
  });
  return courses;
};

export const getPreviousPeriodSales = async ({
  accountId,
  start_date,
  end_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const sales = await prisma.sale.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date,
              lte: end_date,
            }
          : {},
    },
  });

  return sales;
};

export const getPreviousPeriodStudents = async ({
  accountId,
  start_date,
  end_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const students = await prisma.student.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date, // Start of date range
              lte: end_date, // End of date range
            }
          : {},
    },
  });

  return students;
};

export const getPreviousPeriodComments = async ({
  accountId,
  start_date,
  end_date,
}: {
  accountId: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
}) => {
  const comments = await prisma.comment.findMany({
    where: {
      accountId,
      createdAt:
        start_date && end_date
          ? {
              gte: start_date, // Start of date range
              lte: end_date, // End of date range
            }
          : {},
    },
  });

  return comments;
};
