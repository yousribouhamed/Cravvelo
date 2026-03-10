export type UserSubscriptionInfo = {
  planCode: string;
  billingCycle: string;
  status: string;
  currentPeriodEnd: Date;
};

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
  subscription: UserSubscriptionInfo | null;
};

export type UsersPagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
