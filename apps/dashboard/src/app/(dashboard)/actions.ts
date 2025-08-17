"use server";

import { prisma } from "database/src";

// Types for better type safety
interface DateRangeParams {
  accountId: string;
  start_date?: Date;
  end_date?: Date;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Helper function to build date filter
const buildDateFilter = (start_date?: Date, end_date?: Date) => {
  if (!start_date && !end_date) return {};

  const filter: any = {};
  if (start_date) filter.gte = start_date;
  if (end_date) filter.lte = end_date;

  return filter;
};

// Helper function to build pagination
const buildPagination = (page: number = 1, limit: number = 50) => ({
  skip: (page - 1) * limit,
  take: Math.min(limit, 100), // Cap at 100 for performance
});

// Enhanced Sales Actions
export const getAllSales = async ({
  accountId,
  start_date,
  end_date,
  page = 1,
  limit = 50,
  status,
  itemType,
}: DateRangeParams &
  PaginationParams & {
    status?: string;
    itemType?: string;
  }) => {
  try {
    const whereClause: any = {
      accountId,
      ...(Object.keys(buildDateFilter(start_date, end_date)).length > 0 && {
        createdAt: buildDateFilter(start_date, end_date),
      }),
      ...(status && { status }),
      ...(itemType && { itemType }),
    };

    const [sales, totalCount] = await Promise.all([
      prisma.sale.findMany({
        where: whereClause,
        ...buildPagination(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          Student: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      }),
      prisma.sale.count({ where: whereClause }),
    ]);

    return {
      data: sales,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw new Error("Failed to fetch sales");
  }
};

// Enhanced Students Actions
export const getAllStudents = async ({
  accountId,
  start_date,
  end_date,
  page = 1,
  limit = 50,
  search,
}: DateRangeParams &
  PaginationParams & {
    search?: string;
  }) => {
  try {
    const whereClause: any = {
      accountId,
      ...(Object.keys(buildDateFilter(start_date, end_date)).length > 0 && {
        createdAt: buildDateFilter(start_date, end_date),
      }),
      ...(search && {
        OR: [
          { full_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
        ...buildPagination(page, limit),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          full_name: true,
          email: true,
          photo_url: true,
          createdAt: true,
          // confirmedEmail: true,
          _count: {
            select: {
              Sale: true,
              Comment: true,
            },
          },
        },
      }),
      prisma.student.count({ where: whereClause }),
    ]);

    return {
      data: students,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
};

// Enhanced Comments Actions
export const getAllComments = async ({
  accountId,
  start_date,
  end_date,
  page = 1,
  limit = 50,
  status,
  courseId,
}: DateRangeParams &
  PaginationParams & {
    status?: string;
    courseId?: string;
  }) => {
  try {
    const whereClause: any = {
      accountId,
      ...(Object.keys(buildDateFilter(start_date, end_date)).length > 0 && {
        createdAt: buildDateFilter(start_date, end_date),
      }),
      ...(status && { status }),
      ...(courseId && { courseId }),
    };

    const [comments, totalCount] = await Promise.all([
      prisma.comment.findMany({
        where: whereClause,
        ...buildPagination(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          Course: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
            },
          },
          Student: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      }),
      prisma.comment.count({ where: whereClause }),
    ]);

    return {
      data: comments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};

// Enhanced Notifications Actions
export const getAllNotifications = async ({
  accountId,
  page = 1,
  limit = 30,
  isRead,
  type,
}: {
  accountId: string;
} & PaginationParams & {
    isRead?: boolean;
    type?: string;
  }) => {
  try {
    const whereClause: any = {
      accountId,
      isArchived: false,
      ...(typeof isRead === "boolean" && { isRead }),
      ...(type && { type }),
    };

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        ...buildPagination(page, limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({
        where: { accountId, isRead: false, isArchived: false },
      }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      unreadCount,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};

// Enhanced Courses Actions
export const getAllCourses = async ({
  accountId,
  page = 1,
  limit = 30,
  status,
  search,
}: {
  accountId: string;
} & PaginationParams & {
    status?: string;
    search?: string;
  }) => {
  try {
    const whereClause: any = {
      accountId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { seoTitle: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where: whereClause,
        ...buildPagination(page, limit),
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              Comment: true,
              Chapter: true,
            },
          },
        },
      }),
      prisma.course.count({ where: whereClause }),
    ]);

    return {
      data: courses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
};

// Analytics Functions
export const getSalesAnalytics = async ({
  accountId,
  current_start,
  current_end,
  previous_start,
  previous_end,
}: {
  accountId: string;
  current_start?: Date;
  current_end?: Date;
  previous_start?: Date;
  previous_end?: Date;
}) => {
  try {
    const [currentPeriod, previousPeriod] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          accountId,
          status: "COMPLETED",
          ...(Object.keys(buildDateFilter(current_start, current_end)).length >
            0 && {
            createdAt: buildDateFilter(current_start, current_end),
          }),
        },
        _sum: { amount: true },
        _count: { _all: true },
        _avg: { amount: true },
      }),
      prisma.sale.aggregate({
        where: {
          accountId,
          status: "COMPLETED",
          ...(Object.keys(buildDateFilter(previous_start, previous_end))
            .length > 0 && {
            createdAt: buildDateFilter(previous_start, previous_end),
          }),
        },
        _sum: { amount: true },
        _count: { _all: true },
        _avg: { amount: true },
      }),
    ]);

    const currentRevenue = currentPeriod._sum.amount || 0;
    const previousRevenue = previousPeriod._sum.amount || 0;
    const revenueChange =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const currentSales = currentPeriod._count._all || 0;
    const previousSales = previousPeriod._count._all || 0;
    const salesChange =
      previousSales > 0
        ? ((currentSales - previousSales) / previousSales) * 100
        : 0;

    return {
      current: {
        revenue: currentRevenue,
        salesCount: currentSales,
        averageOrderValue: currentPeriod._avg.amount || 0,
      },
      previous: {
        revenue: previousRevenue,
        salesCount: previousSales,
        averageOrderValue: previousPeriod._avg.amount || 0,
      },
      changes: {
        revenueChange,
        salesChange,
      },
    };
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw new Error("Failed to fetch sales analytics");
  }
};

export const getStudentsAnalytics = async ({
  accountId,
  current_start,
  current_end,
  previous_start,
  previous_end,
}: {
  accountId: string;
  current_start?: Date;
  current_end?: Date;
  previous_start?: Date;
  previous_end?: Date;
}) => {
  try {
    const [currentCount, previousCount] = await Promise.all([
      prisma.student.count({
        where: {
          accountId,
          ...(Object.keys(buildDateFilter(current_start, current_end)).length >
            0 && {
            createdAt: buildDateFilter(current_start, current_end),
          }),
        },
      }),
      prisma.student.count({
        where: {
          accountId,
          ...(Object.keys(buildDateFilter(previous_start, previous_end))
            .length > 0 && {
            createdAt: buildDateFilter(previous_start, previous_end),
          }),
        },
      }),
    ]);

    const change =
      previousCount > 0
        ? ((currentCount - previousCount) / previousCount) * 100
        : 0;

    return {
      current: currentCount,
      previous: previousCount,
      change,
    };
  } catch (error) {
    console.error("Error fetching students analytics:", error);
    throw new Error("Failed to fetch students analytics");
  }
};

// Mark notifications as read
export const markNotificationsAsRead = async ({
  accountId,
  notificationIds,
}: {
  accountId: string;
  notificationIds?: string[];
}) => {
  try {
    const whereClause = notificationIds?.length
      ? { accountId, id: { in: notificationIds } }
      : { accountId };

    await prisma.notification.updateMany({
      where: whereClause,
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw new Error("Failed to mark notifications as read");
  }
};

// Get dashboard summary
export const getDashboardSummary = async ({
  accountId,
  start_date,
  end_date,
}: DateRangeParams) => {
  try {
    const dateFilter = buildDateFilter(start_date, end_date);
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    const [
      totalRevenue,
      totalSales,
      totalStudents,
      totalComments,
      unreadNotifications,
    ] = await Promise.all([
      prisma.sale.aggregate({
        where: {
          accountId,
          status: "COMPLETED",
          ...(hasDateFilter && { createdAt: dateFilter }),
        },
        _sum: { amount: true },
      }),
      prisma.sale.count({
        where: {
          accountId,
          status: "COMPLETED",
          ...(hasDateFilter && { createdAt: dateFilter }),
        },
      }),
      prisma.student.count({
        where: {
          accountId,
          ...(hasDateFilter && { createdAt: dateFilter }),
        },
      }),
      prisma.comment.count({
        where: {
          accountId,
          ...(hasDateFilter && { createdAt: dateFilter }),
        },
      }),
      prisma.notification.count({
        where: {
          accountId,
          isRead: false,
          isArchived: false,
        },
      }),
    ]);

    return {
      revenue: totalRevenue._sum.amount || 0,
      sales: totalSales,
      students: totalStudents,
      comments: totalComments,
      unreadNotifications,
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw new Error("Failed to fetch dashboard summary");
  }
};
