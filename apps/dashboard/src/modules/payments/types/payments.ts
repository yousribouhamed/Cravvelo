export enum PaymentTypes {
  BUYPRODUCT = "BUYPRODUCT",
  BUYCOURSE = "BUYCOURSE",
  SUBSCRIPTION = "SUBSCRIPTION",
  REFERAL_WITHDRAWAL = "REFERAL_WITHDRAWAL",
  REFUND = "REFUND",
}

export enum PaymentMethod {
  CASH = "CASH",
  CHARGILY = "CHARGILY",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentProvider {
  STRIPE = "STRIPE",
  CHARGILY = "CHARGILY",
  P2P = "P2P",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
}

export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
  REFUND = "REFUND",
  WITHDRAWAL = "WITHDRAWAL",
  COMMISSION = "COMMISSION",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum SaleStatus {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum ItemType {
  COURSE = "COURSE",
  PRODUCT = "PRODUCT",
}

// Base Types
export interface StudentInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
}

export interface CourseInfo {
  id: string;
  title: string;
  thumbnailUrl?: string;
  price?: number;
}

export interface ProductInfo {
  id: string;
  title: string;
  thumbnailUrl?: string;
  price?: number;
}

export interface CouponInfo {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountAmount: number;
}

export interface SubscriptionInfo {
  id: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date;
  amount?: number;
  billingCycle?: string;
}

export interface PaymentMethodConfig {
  id: string;
  provider: PaymentProvider;
  config?: Record<string, any>;
}

export interface WalletInfo {
  id: string;
  balance: number;
  currency: string;
}

// Payment Proof
export interface PaymentProof {
  id: string;
  paymentId: string;
  fileUrl: string;
  note?: string;
  verified: boolean;
  createdAt: Date;
}

// Transaction Details
export interface TransactionDetails {
  id: string;
  walletId?: string;
  paymentId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string;
  reference?: string;
  metadata?: Record<string, any>;
  balanceBefore?: number;
  balanceAfter?: number;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: Date;
  updatedAt: Date;
  Wallet?: WalletInfo;
}

// Sale Details
export interface SaleDetails {
  id: string;
  orderNumber: number;
  accountId: string;
  studentId: string;
  amount: number;
  originalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  status: SaleStatus;
  itemType: ItemType;
  itemId: string;
  price: number;
  quantity: number;
  courseId?: string;
  productId?: string;
  couponId?: string;
  couponCode?: string;
  customerNotes?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  Course?: CourseInfo;
  Product?: ProductInfo;
  Coupon?: CouponInfo;
}

// Main Payment Details Interface
export interface PaymentDetails {
  id: string;
  type: PaymentTypes;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;

  // Relations
  studentId?: string;
  accountId?: string;
  saleId?: string;
  subscriptionId?: string;
  methodConfigId?: string;

  // Gateway information
  gatewayId?: string;
  gatewayResponse?: Record<string, any>;

  // Description and metadata
  description?: string;
  metadata?: Record<string, any>;

  // Checkout information
  checkoutUrl?: string;

  // Refund information
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Related data (populated via includes)
  Student?: StudentInfo;
  Sale?: SaleDetails;
  Subscription?: SubscriptionInfo;
  MethodConfig?: PaymentMethodConfig;
  Proofs?: PaymentProof[];
  Transactions?: TransactionDetails[];
}

// API Response Types
export interface PaymentResponse {
  data: PaymentDetails | null;
  success: boolean;
  message: string;
}

export interface PaymentsListResponse {
  data: PaymentDetails[] | null;
  success: boolean;
  message: string;
}

// Payment Statistics
export interface PaymentStatusStat {
  status: PaymentStatus;
  _count: {
    _all: number;
  };
  _sum: {
    amount: number | null;
  };
}

export interface PaymentMonthlyStats {
  createdAt: Date;
  _sum: {
    amount: number | null;
  };
  _count: {
    _all: number;
  };
}

export interface PaymentStats {
  totalAmount: number;
  totalPayments: number;
  statusBreakdown: PaymentStatusStat[];
  monthlyTrends: PaymentMonthlyStats[];
}

export interface PaymentStatsResponse {
  data: PaymentStats | null;
  success: boolean;
  message: string;
}

// Input Types for API calls
export interface GetPaymentDetailsInput {
  paymentId: string;
}

export interface ApprovePaymentInput {
  paymentId: string;
}

export interface RejectPaymentInput {
  paymentId: string;
  rejectionReason?: string;
}

// Create Payment Input (for new payment creation)
export interface CreatePaymentInput {
  type: PaymentTypes;
  amount: number;
  currency?: string;
  method?: PaymentMethod;
  studentId?: string;
  saleId?: string;
  subscriptionId?: string;
  methodConfigId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Update Payment Input
export interface UpdatePaymentInput {
  paymentId: string;
  status?: PaymentStatus;
  gatewayId?: string;
  gatewayResponse?: Record<string, any>;
  checkoutUrl?: string;
  metadata?: Record<string, any>;
}

// Payment Filter Options
export interface PaymentFilters {
  status?: PaymentStatus | PaymentStatus[];
  type?: PaymentTypes | PaymentTypes[];
  method?: PaymentMethod | PaymentMethod[];
  studentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  currency?: string;
}

// Pagination Options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "amount";
  sortOrder?: "asc" | "desc";
}

// Enhanced Payment Query Options
export interface PaymentQueryOptions {
  filters?: PaymentFilters;
  pagination?: PaginationOptions;
  include?: {
    student?: boolean;
    sale?: boolean;
    subscription?: boolean;
    methodConfig?: boolean;
    proofs?: boolean;
    transactions?: boolean;
  };
}

// Paginated Response
export interface PaginatedPaymentsResponse {
  data: {
    payments: PaymentDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } | null;
  success: boolean;
  message: string;
}

// Payment Summary for Dashboard
export interface PaymentSummary {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentTypes;
  studentName?: string;
  studentEmail?: string;
  itemTitle?: string;
  itemType?: ItemType;
  createdAt: Date;
}

// Utility Types
export type PaymentStatusColor = "green" | "yellow" | "red" | "blue" | "gray";

export interface PaymentStatusConfig {
  label: string;
  color: PaymentStatusColor;
  icon: string;
  description: string;
}

// Type Guards
export const isPaymentCompleted = (payment: PaymentDetails): boolean => {
  return payment.status === PaymentStatus.COMPLETED;
};

export const isPaymentPending = (payment: PaymentDetails): boolean => {
  return (
    payment.status === PaymentStatus.PENDING ||
    payment.status === PaymentStatus.PROCESSING
  );
};

export const isPaymentFailed = (payment: PaymentDetails): boolean => {
  return (
    payment.status === PaymentStatus.FAILED ||
    payment.status === PaymentStatus.CANCELLED ||
    payment.status === PaymentStatus.REFUNDED
  );
};

export const canApprovePayment = (payment: PaymentDetails): boolean => {
  return payment.status === PaymentStatus.PENDING;
};

export const canRejectPayment = (payment: PaymentDetails): boolean => {
  return (
    payment.status === PaymentStatus.PENDING ||
    payment.status === PaymentStatus.PROCESSING
  );
};

// Helper Functions
export const formatPaymentAmount = (
  amount: number,
  currency: string = "DZD"
): string => {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const getPaymentStatusConfig = (
  status: PaymentStatus
): PaymentStatusConfig => {
  const configs: Record<PaymentStatus, PaymentStatusConfig> = {
    [PaymentStatus.PENDING]: {
      label: "Pending",
      color: "yellow",
      icon: "clock",
      description: "Payment is waiting for approval",
    },
    [PaymentStatus.PROCESSING]: {
      label: "Processing",
      color: "blue",
      icon: "loader",
      description: "Payment is being processed",
    },
    [PaymentStatus.COMPLETED]: {
      label: "Completed",
      color: "green",
      icon: "check-circle",
      description: "Payment completed successfully",
    },
    [PaymentStatus.FAILED]: {
      label: "Failed",
      color: "red",
      icon: "x-circle",
      description: "Payment failed",
    },
    [PaymentStatus.CANCELLED]: {
      label: "Cancelled",
      color: "gray",
      icon: "x",
      description: "Payment was cancelled",
    },
    [PaymentStatus.REFUNDED]: {
      label: "Refunded",
      color: "red",
      icon: "arrow-left",
      description: "Payment was refunded",
    },
  };

  return configs[status];
};

// Default payment details for forms/initial states
export const defaultPaymentDetails: Partial<CreatePaymentInput> = {
  currency: "DZD",
  method: PaymentMethod.BANK_TRANSFER,
  type: PaymentTypes.BUYCOURSE,
  amount: 0,
};

export default PaymentDetails;
