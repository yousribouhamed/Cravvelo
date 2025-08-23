import { headers } from "next/headers";

// Get current admin from middleware headers
export const getCurrentAdminFromHeaders = async () => {
  const headersList = await headers();

  const adminId = headersList.get("x-admin-id");
  const adminEmail = headersList.get("x-admin-email");
  const adminRole = headersList.get("x-admin-role");
  const adminPermissions = headersList.get("x-admin-permissions");

  if (!adminId) return null;

  return {
    id: adminId,
    email: adminEmail,
    role: adminRole,
    permissions: adminPermissions ? JSON.parse(adminPermissions) : {},
  };
};

// Check if current user has permission
export const hasPermission = (permission: string): boolean => {
  const admin = getCurrentAdminFromHeaders();
  if (!admin) return false;

  return admin.permissions[permission] === true;
};

// Check if current user has role
export const hasRole = (roles: string | string[]): boolean => {
  const admin = getCurrentAdminFromHeaders();
  if (!admin) return false;

  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  return requiredRoles.includes(admin.role);
};

// Default admin permissions
export const DEFAULT_ADMIN_PERMISSIONS = {
  // User management
  view_users: true,
  create_users: false,
  edit_users: false,
  delete_users: false,

  // Course management
  view_courses: true,
  create_courses: true,
  edit_courses: true,
  delete_courses: false,

  // Product management
  view_products: true,
  create_products: true,
  edit_products: true,
  delete_products: false,

  // Payment management
  view_payments: true,
  process_payments: false,
  refund_payments: false,

  // Analytics
  view_analytics: true,
  export_data: false,

  // System settings
  manage_settings: false,
  manage_integrations: false,

  // Admin management
  view_admins: false,
  create_admins: false,
  edit_admins: false,
  delete_admins: false,
};

export const SUPER_ADMIN_PERMISSIONS = {
  // All permissions set to true
  view_users: true,
  create_users: true,
  edit_users: true,
  delete_users: true,

  view_courses: true,
  create_courses: true,
  edit_courses: true,
  delete_courses: true,

  view_products: true,
  create_products: true,
  edit_products: true,
  delete_products: true,

  view_payments: true,
  process_payments: true,
  refund_payments: true,

  view_analytics: true,
  export_data: true,

  manage_settings: true,
  manage_integrations: true,

  view_admins: true,
  create_admins: true,
  edit_admins: true,
  delete_admins: true,
};
