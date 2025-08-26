export type SetAppPricing = {
  pricingPlan: {
    id: string;
    accountId: string;
    name: string;
    description: string | null;
    pricingType: string; // "RECURRING"
    price: number;
    currency: string;
    accessDuration: string; // "UNLIMITED"
    recurringDays: number;
    isActive: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  appPricingPlan: {
    id: string;
    appId: string;
    pricingPlanId: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string;
};

// Return type for updateAppPricing
export type UpdateAppPricing = {
  pricingPlan: {
    id: string;
    accountId: string;
    name: string;
    description: string | null;
    pricingType: string;
    price: number;
    currency: string;
    accessDuration: string | null;
    accessDurationDays: number | null;
    recurringDays: number | null;
    isActive: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string;
};

// Return type for removeAppPricing
export type RemoveAppPricing = {
  message: string;
};

// Return type for getAppPricing
export type GetAppPricing = {
  appPricingPlans: {
    id: string;
    appId: string;
    pricingPlanId: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    PricingPlan: {
      id: string;
      accountId: string;
      name: string;
      description: string | null;
      pricingType: string;
      price: number | null;
      compareAtPrice: number | null;
      currency: string;
      accessDuration: string | null;
      accessDurationDays: number | null;
      recurringDays: number | null;
      isActive: boolean;
      isDefault: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    App: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  message: string;
};

// Return type for setDefaultAppPricing
export type SetDefaultAppPricing = {
  message: string;
};

export interface pricingPlanType {
  id: string;
  pricingPlanId: string;
  appId: string;
  accountId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  recurringDays: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  app: {
    id: string;
    name: string;
    slug: string;
  };
}
