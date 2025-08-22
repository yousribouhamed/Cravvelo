export type ChargilyApiResponse = {
  id: string;
  entity: "checkout";
  livemode: boolean;
  amount: number;
  currency: string;
  fees: number;
  fees_on_merchant: number;
  fees_on_customer: number;
  pass_fees_to_customer: boolean | null;
  chargily_pay_fees_allocation: "customer" | "merchant" | string;
  status: "pending" | "paid" | "failed" | string;
  locale: string;
  description: string | null;
  metadata: Record<string, any> | null;
  success_url: string;
  failure_url: string | null;
  payment_method: string | null;
  invoice_id: string | null;
  customer_id: string;
  payment_link_id: string | null;
  created_at: number;
  updated_at: number;
  shipping_address: string | null;
  collect_shipping_address: number; // 0 or 1
  discount: number | null;
  amount_without_discount: number | null;
  checkout_url: string;
};

// Types
export interface PaymentConnection {
  provider: string;
  isActive: boolean;
  id?: string;
  config?: any;
}

// Updated PaymentProduct interface with pricing options
export interface PaymentProduct {
  id: string;
  name: string;
  description: string;
  price: number; // Keep for backward compatibility (default/main price)
  currency: string;
  image?: string;

  // New pricing system support
  pricingOptions?: PaymentPricingOption[];
  selectedPricingId?: string; // ID of the currently selected pricing option
}

// Individual pricing option
export interface PaymentPricingOption {
  id: string;
  name: string; // e.g., "Basic Access", "Full Course", "Premium"
  description?: string;
  pricingType: "FREE" | "ONE_TIME" | "RECURRING";
  price: number | null; // null for FREE
  compareAtPrice?: number | null; // Original price for discounts
  currency: string;

  // Access duration info
  accessDuration?: "LIMITED" | "UNLIMITED";
  accessDurationDays?: number | null;

  // Recurring billing info (for RECURRING type)
  recurringDays?: number | null; // Every X days

  // Display flags
  isDefault?: boolean;
  isActive?: boolean;

  // Additional metadata
  features?: string[]; // List of features included in this pricing tier
  metadata?: Record<string, any>;
}

export interface PaymentContextState {
  // Sheet state
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  setSheetOpen: (open: boolean) => void;

  // Product state
  selectedProduct: PaymentProduct | null;
  setSelectedProduct: (product: PaymentProduct | null) => void;

  // Payment method state
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  // Loading states
  isCheckoutLoading: boolean;
  setCheckoutLoading: (loading: boolean) => void;
  isFormSubmitting: boolean;
  setFormSubmitting: (submitting: boolean) => void;

  // Connections data
  connections: PaymentConnection[];
  activeConnections: PaymentConnection[];
  isConnectionsLoading: boolean;

  refetchConnections: () => void;

  // Helper methods
  hasActiveConnection: (provider: string) => boolean;
  getActiveConnection: (provider: string) => PaymentConnection | undefined;
  resetPaymentState: () => void;

  // Form data (for managing form state across components)
  formData: Record<string, any>;
  updateFormData: (key: string, value: any) => void;
  clearFormData: () => void;
}
