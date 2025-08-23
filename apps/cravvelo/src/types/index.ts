export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  role?: string;
  permissions?: Record<string, any>;
  createdById?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateAdminData {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  permissions?: Record<string, any>;
  isActive?: boolean;
}
