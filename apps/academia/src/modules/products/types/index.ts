export type PricingPlan = {
  id: string;
  name: string;
  description?: string | null;
  pricingType: "FREE" | "ONE_TIME" | "RECURRING";
  price: number | null;
  compareAtPrice?: number | null;
  currency: string;
  accessDuration?: "LIMITED" | "UNLIMITED" | null;
  accessDurationDays?: number | null;
  recurringDays?: number | null;
};

export type ProductPricingPlan = {
  id: string;
  isDefault: boolean;
  PricingPlan: PricingPlan | null;
};

export type ProductWithDefaultPricing = {
  id: string;
  title: string;
  subDescription?: string | null;
  thumbnailUrl?: string | null;
  description?: any;
  SeoTitle?: string | null;
  SeoDescription?: string | null;
  status?: string | null;
  isVisible: boolean;
  fileUrl?: string | null;
  price?: number | null; // legacy/back-compat
  compareAtPrice?: number | null; // legacy/back-compat
  createdAt: Date;
  updatedAt: Date;
  ProductPricingPlans?: ProductPricingPlan[];
  _count?: { Sale: number };
};

export type ProductWithPricing = ProductWithDefaultPricing & {
  ProductPricingPlans: ProductPricingPlan[];
};

