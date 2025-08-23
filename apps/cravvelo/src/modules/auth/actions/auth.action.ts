"use server";

import { prisma } from "database/src";
import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { CreateAdminData, SignInData, UpdateAdminData } from "@/types";

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);

// JWT Token utilities
export const signJWT = async (payload: any, expiresIn: string = "7d") => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
};

// Set auth cookie
const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
};

// Remove auth cookie
const removeAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
};

// Create Admin Action
export const createAdminAction = async (data: CreateAdminData) => {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        error: "Name, email, and password are required",
      };
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existingAdmin) {
      return {
        success: false,
        error: "Admin with this email already exists",
      };
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 12);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "ADMIN",
        permissions: data.permissions || {},
        createdById: data.createdById || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log admin activity
    if (data.createdById) {
      await prisma.adminActivity.create({
        data: {
          adminId: data.createdById,
          action: "CREATE_ADMIN",
          meta: {
            createdAdminId: admin.id,
            createdAdminEmail: admin.email,
          },
        },
      });
    }

    return {
      success: true,
      data: admin,
      message: "Admin created successfully",
    };
  } catch (error) {
    console.error("Create admin error:", error);
    return {
      success: false,
      error: "Failed to create admin. Please try again.",
    };
  }
};

// Sign In Action
export const signInAction = async (data: SignInData) => {
  try {
    // Validate required fields
    if (!data.email || !data.password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    const admin = await prisma.admin.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        permissions: true,
      },
    });

    if (!admin) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Check if admin is active
    if (!admin.isActive) {
      return {
        success: false,
        error: "Account is deactivated. Please contact administrator.",
      };
    }

    // Verify password
    const isValidPassword = await compare(data.password, admin.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create JWT token
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    };

    const token = await signJWT(tokenPayload);
    await setAuthCookie(token);

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: "SIGN_IN",
        meta: {
          timestamp: new Date().toISOString(),
          userAgent: "server-action", // You can enhance this with request headers
        },
      },
    });

    return {
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
      message: "Signed in successfully",
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "Failed to sign in. Please try again.",
    };
  }
};

// Sign Out Action
export const signOutAction = async () => {
  try {
    // Get current admin info before signing out
    const currentAdmin = await getCurrentAdmin();

    if (currentAdmin?.id) {
      // Log admin activity
      await prisma.adminActivity.create({
        data: {
          adminId: currentAdmin.id,
          action: "SIGN_OUT",
          meta: {
            timestamp: new Date().toISOString(),
          },
        },
      });
    }

    await removeAuthCookie();

    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "Failed to sign out",
    };
  }
};

// Get All Admins Action
export const getAllAdminsAction = async (
  page: number = 1,
  limit: number = 10
) => {
  try {
    // Check if current user has permission
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const skip = (page - 1) * limit;

    // Get admins with pagination
    const [admins, totalCount] = await Promise.all([
      prisma.admin.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              createdAdmins: true,
              AdminActivity: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.admin.count(),
    ]);

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: currentAdmin.id,
        action: "VIEW_ADMINS_LIST",
        meta: {
          page,
          limit,
          totalCount,
        },
      },
    });

    return {
      success: true,
      data: {
        admins,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
      },
      message: "Admins retrieved successfully",
    };
  } catch (error) {
    console.error("Get admins error:", error);
    return {
      success: false,
      error: "Failed to retrieve admins",
    };
  }
};

// Update Admin Action
export const updateAdminAction = async (data: UpdateAdminData) => {
  try {
    // Check if current user has permission
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Validate required fields
    if (!data.id) {
      return {
        success: false,
        error: "Admin ID is required",
      };
    }

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: data.id },
    });

    if (!existingAdmin) {
      return {
        success: false,
        error: "Admin not found",
      };
    }

    // Check if email is being updated and if it's already taken
    if (data.email && data.email !== existingAdmin.email) {
      const emailExists = await prisma.admin.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        return {
          success: false,
          error: "Email is already taken by another admin",
        };
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.permissions !== undefined)
      updateData.permissions = data.permissions;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id: data.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: currentAdmin.id,
        action: "UPDATE_ADMIN",
        meta: {
          updatedAdminId: data.id,
          changes: updateData,
          previousData: {
            name: existingAdmin.name,
            email: existingAdmin.email,
            role: existingAdmin.role,
            isActive: existingAdmin.isActive,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedAdmin,
      message: "Admin updated successfully",
    };
  } catch (error) {
    console.error("Update admin error:", error);
    return {
      success: false,
      error: "Failed to update admin",
    };
  }
};

// Get Current Admin (helper function)
export const getCurrentAdmin = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.id) {
      return null;
    }

    // Get fresh admin data
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        permissions: true,
      },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    return admin;
  } catch (error) {
    console.error("Get current admin error:", error);
    return null;
  }
};

// Delete Admin Action
export const deleteAdminAction = async (adminId: string) => {
  try {
    // Check if current user has permission
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Don't allow deleting yourself
    if (currentAdmin.id === adminId) {
      return {
        success: false,
        error: "You cannot delete your own account",
      };
    }

    // Check if admin exists
    const adminToDelete = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!adminToDelete) {
      return {
        success: false,
        error: "Admin not found",
      };
    }

    // Delete admin (soft delete by deactivating)
    await prisma.admin.update({
      where: { id: adminId },
      data: { isActive: false },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: currentAdmin.id,
        action: "DELETE_ADMIN",
        meta: {
          deletedAdminId: adminId,
          deletedAdminEmail: adminToDelete.email,
          deletedAdminName: adminToDelete.name,
        },
      },
    });

    return {
      success: true,
      message: "Admin deleted successfully",
    };
  } catch (error) {
    console.error("Delete admin error:", error);
    return {
      success: false,
      error: "Failed to delete admin",
    };
  }
};
