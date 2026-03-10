export type WebsiteListItem = {
  id: string;
  name: string;
  subdomain: string | null;
  customDomain: string | null;
  ownerName: string;
  suspended: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type WebsitesPagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
