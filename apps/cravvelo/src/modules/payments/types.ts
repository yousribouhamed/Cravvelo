export type PaymentListItem = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  createdAt: Date;
  accountEmail: string | null;
  accountName: string | null;
  studentEmail: string | null;
  studentName: string | null;
  gatewayId: string | null;
  description: string | null;
};

export type PaymentsPagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
