"use server";

import { withAuth, withSuperAdminAuth } from "@/_internals/with-auth";
import { z } from "zod";
import { AppType } from "../types";

const updateAppSchema = z.object({
  id: z.string().min(1, "App ID is required"),
  name: z
    .string()
    .min(1, "App name is required")
    .max(100, "App name too long")
    .optional(),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  shortDesc: z.string().max(200, "Short description too long").optional(),
  longDesc: z.any().optional(),
  logoUrl: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().nullable().optional(),
  configSchema: z.any().optional(),
  uiInjection: z.any().optional(),
});

const getAppByIdSchema = z.object({
  id: z.string().min(1, "App ID is required"),
});

const deleteAppSchema = z.object({
  id: z.string().min(1, "App ID is required"),
});

const getAppsQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  category: z.string().optional(),
  search: z.string().optional(),
});

// Get all apps with pagination and filtering
export const getAllApps = withAuth({
  input: getAppsQuerySchema,
  handler: async ({ input, db }) => {
    const { page, limit, category, search } = input;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDesc: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get apps with pagination
    const [apps, total] = await Promise.all([
      db.app.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          installations: {
            select: { id: true },
          },
          _count: {
            select: { installations: true },
          },
        },
      }),
      db.app.count({ where }),
    ]);

    // Transform data to include installation count
    const transformedApps = apps.map((app) => ({
      ...app,
      installationsCount: app._count.installations,
      _count: undefined,
      installations: undefined,
    }));

    return {
      apps: transformedApps as unknown as AppType[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },
  action: "VIEW_APPS",
});

export const getAppById = withAuth({
  input: getAppByIdSchema,
  handler: async ({ input, db }) => {
    const app = await db.app.findUnique({
      where: { id: input.id },
      include: {
        installations: {
          select: {
            id: true,
            userId: true,
            enabled: true,
            createdAt: true,
          },
        },
        _count: {
          select: { installations: true },
        },
      },
    });

    if (!app) {
      throw new Error("App not found");
    }

    return {
      ...app,
      installationsCount: app._count.installations,
    };
  },
  action: "VIEW_APP_DETAILS",
});
export const createApp = withSuperAdminAuth({
  input: z.object({
    name: z
      .string()
      .min(1, "App name is required")
      .max(100, "App name too long"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
      ),
    shortDesc: z
      .string()
      .min(1, "Short description is required")
      .max(200, "Short description too long"),
    longDesc: z.any().optional(), // Already parsed JSON object or null
    logoUrl: z.string().url().optional(),
    images: z.array(z.string().url()).default([]),
    category: z.string().optional(),
    configSchema: z.any().optional(), // Already parsed JSON object or null
    uiInjection: z.any().optional(), // Already parsed JSON object or null
  }),
  handler: async ({ input, admin, db }) => {
    const existingApp = await db.app.findUnique({
      where: { slug: input.slug },
    });

    if (existingApp) {
      throw new Error("App with this slug already exists");
    }

    const app = await db.app.create({
      data: {
        name: input.name,
        longDesc: input.longDesc ? JSON.stringify(input.longDesc) : null,
        shortDesc: input.shortDesc,
        slug: input.slug,
        logoUrl: input.logoUrl,
        images: input.images,
        category: input.category,
        configSchema: input.configSchema
          ? JSON.stringify(input.configSchema)
          : null,
        uiInjection: input.uiInjection
          ? JSON.stringify(input.uiInjection)
          : JSON.stringify({ ui: "SIDEBAR" }),
        createdBy: admin.id,
      },
    });

    return app;
  },
  action: "CREATE_APP",
});
// Update app (Super Admin only)
export const updateApp = withSuperAdminAuth({
  input: updateAppSchema,
  handler: async ({ input, db }) => {
    const { id, ...updateData } = input;

    // Check if app exists
    const existingApp = await db.app.findUnique({
      where: { id },
    });

    if (!existingApp) {
      throw new Error("App not found");
    }

    // If slug is being updated, check if it's already taken
    if (updateData.slug && updateData.slug !== existingApp.slug) {
      const slugExists = await db.app.findUnique({
        where: { slug: updateData.slug },
      });

      if (slugExists) {
        throw new Error("App with this slug already exists");
      }
    }

    const updatedApp = await db.app.update({
      where: { id },
      data: updateData,
    });

    return updatedApp;
  },
  action: "UPDATE_APP",
});

// Delete app (Super Admin only)
export const deleteApp = withSuperAdminAuth({
  input: deleteAppSchema,
  handler: async ({ input, db }) => {
    // Check if app exists
    const existingApp = await db.app.findUnique({
      where: { id: input.id },
      include: {
        _count: {
          select: { installations: true },
        },
      },
    });

    if (!existingApp) {
      throw new Error("App not found");
    }

    // Check if app has active installations
    if (existingApp._count.installations > 0) {
      throw new Error(
        "Cannot delete app with active installations. Please remove all installations first."
      );
    }

    await db.app.delete({
      where: { id: input.id },
    });

    return { message: "App deleted successfully" };
  },
  action: "DELETE_APP",
});

// Get app categories (for filtering)
export const getAppCategories = withAuth({
  handler: async ({ db }) => {
    const categories = await db.app.findMany({
      select: { category: true },
      where: { category: { not: null } },
      distinct: ["category"],
    });

    return categories
      .map((app) => app.category)
      .filter(Boolean)
      .sort();
  },
  action: "VIEW_APP_CATEGORIES",
});

// Get app statistics
export const getAppStats = withAuth({
  handler: async ({ db }) => {
    const [totalApps, totalInstallations, categoriesCount, recentApps] =
      await Promise.all([
        db.app.count(),
        db.installedApp.count(),
        db.app.count({
          where: { category: { not: null } },
          distinct: ["category"],
        }),
        db.app.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
      ]);

    return {
      totalApps,
      totalInstallations,
      categoriesCount,
      recentApps,
    };
  },
  action: "VIEW_APP_STATS",
});
