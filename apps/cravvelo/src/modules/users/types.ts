export type UserListItem = {
  id: string;
  userId: string;
  user_name: string | null;
  firstName: string | null;
  lastName: string | null;
  support_email: string | null;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: Date;
};

export type UsersPagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
