import { PaymentPricingOption, PaymentProduct } from "../types";
import { formatPrice as baseFormatPrice } from "@/lib/price";

export interface CourseToPaymentProductParams {
  course: {
    id: string;
    title: string;
    courseDescription?: any;
    thumbnailUrl?: string | null;
    CoursePricingPlans?: Array<{
      id: string;
      isDefault: boolean;
      PricingPlan: {
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
        isActive: boolean;
      };
    }>;
  };
  tenantCurrency?: string; // Optional tenant currency override
}

export function courseToPaymentProduct(
  params: CourseToPaymentProductParams
): PaymentProduct {
  const { course, tenantCurrency } = params;

  // Convert pricing plans to payment pricing options
  // Filter out any plans where PricingPlan is missing
  const pricingOptions: PaymentPricingOption[] =
    course.CoursePricingPlans?.filter((cp) => cp.PricingPlan != null)
      .map((cp) => ({
        id: cp.PricingPlan.id,
        name: cp.PricingPlan.name,
        description: cp.PricingPlan.description || undefined,
        pricingType: cp.PricingPlan.pricingType,
        price: cp.PricingPlan.price ?? 0,
        compareAtPrice: cp.PricingPlan.compareAtPrice ?? undefined,
        currency: cp.PricingPlan.currency,
        accessDuration: cp.PricingPlan.accessDuration || undefined,
        accessDurationDays: cp.PricingPlan.accessDurationDays ?? undefined,
        recurringDays: cp.PricingPlan.recurringDays ?? undefined,
        isDefault: cp.isDefault,
        isActive: cp.PricingPlan.isActive,
      })) || [];

  // Find default pricing option, or use first available option
  const defaultPricing =
    pricingOptions.find((option) => option.isDefault) ||
    pricingOptions[0] ||
    null;
  const mainPrice = defaultPricing?.price ?? 0;

  // Extract description from course description (assuming it's rich text)
  let description = "Course description";
  if (course.courseDescription) {
    if (typeof course.courseDescription === "string") {
      description = course.courseDescription;
    } else if (course.courseDescription.text) {
      description = course.courseDescription.text;
    } else {
      description =
        JSON.stringify(course.courseDescription).slice(0, 100) + "...";
    }
  }

  // Use tenant currency if provided, otherwise use currency from pricing plan, fallback to DZD
  const currency = tenantCurrency || defaultPricing?.currency || "DZD";

  return {
    id: course.id,
    name: course.title,
    description,
    price: mainPrice,
    currency,
    image: course.thumbnailUrl || undefined,
    pricingOptions,
    selectedPricingId: defaultPricing?.id,
    type: "COURSE",
  };
}

export interface ProductToPaymentProductParams {
  product: {
    id: string;
    title: string;
    description?: any;
    thumbnailUrl?: string | null;
    ProductPricingPlans?: Array<{
      id: string;
      isDefault: boolean;
      PricingPlan: {
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
        isActive: boolean;
      };
    }>;
    price?: number | null; // legacy/back-compat
  };
  tenantCurrency?: string;
}

export function productToPaymentProduct(
  params: ProductToPaymentProductParams
): PaymentProduct {
  const { product, tenantCurrency } = params;

  const pricingOptions: PaymentPricingOption[] =
    product.ProductPricingPlans?.filter((pp) => pp.PricingPlan != null)
      .map((pp) => ({
        id: pp.PricingPlan.id,
        name: pp.PricingPlan.name,
        description: pp.PricingPlan.description || undefined,
        pricingType: pp.PricingPlan.pricingType,
        price: pp.PricingPlan.price ?? 0,
        compareAtPrice: pp.PricingPlan.compareAtPrice ?? undefined,
        currency: pp.PricingPlan.currency,
        accessDuration: pp.PricingPlan.accessDuration || undefined,
        accessDurationDays: pp.PricingPlan.accessDurationDays ?? undefined,
        recurringDays: pp.PricingPlan.recurringDays ?? undefined,
        isDefault: pp.isDefault,
        isActive: pp.PricingPlan.isActive,
      })) || [];

  const defaultPricing =
    pricingOptions.find((option) => option.isDefault) ||
    pricingOptions[0] ||
    null;

  const mainPrice =
    defaultPricing?.price ?? (product.price != null ? Number(product.price) : 0);

  // Extract description (rich JSON or string)
  let description = "Product description";
  if (product.description) {
    if (typeof product.description === "string") {
      description = product.description;
    } else if (product.description.text) {
      description = product.description.text;
    } else {
      description = JSON.stringify(product.description).slice(0, 100) + "...";
    }
  }

  const currency = tenantCurrency || defaultPricing?.currency || "DZD";

  return {
    id: product.id,
    name: product.title,
    description,
    price: mainPrice,
    currency,
    image: product.thumbnailUrl || undefined,
    pricingOptions,
    selectedPricingId: defaultPricing?.id,
    type: "PRODUCT",
  };
}

// Helper function to get selected pricing option
export function getSelectedPricingOption(
  product: PaymentProduct
): PaymentPricingOption | null {
  if (!product.pricingOptions || product.pricingOptions.length === 0) {
    return null;
  }

  if (product.selectedPricingId) {
    return (
      product.pricingOptions.find(
        (option) => option.id === product.selectedPricingId
      ) || null
    );
  }

  // Fallback to default pricing option
  return (
    product.pricingOptions.find((option) => option.isDefault) ||
    product.pricingOptions[0]
  );
}

// Helper function to check if product has multiple pricing options
export function hasMultiplePricingOptions(product: PaymentProduct): boolean {
  return (product.pricingOptions?.length || 0) > 1;
}

// Helper function to check if product is free
export function isProductFree(product: PaymentProduct): boolean {
  const selectedPricing = getSelectedPricingOption(product);
  return (
    selectedPricing?.pricingType === "FREE" ||
    selectedPricing?.price === 0 ||
    product.price === 0
  );
}

// Helper function to check if product is recurring
export function isProductRecurring(product: PaymentProduct): boolean {
  const selectedPricing = getSelectedPricingOption(product);
  return selectedPricing?.pricingType === "RECURRING";
}

// Helper function to format pricing display
export function formatPricingDisplay(
  product: PaymentProduct,
  locale: string = "ar-DZ"
): {
  price: string;
  originalPrice?: string;
  isFree: boolean;
  isRecurring: boolean;
  recurringText?: string;
  hasDiscount: boolean;
} {
  const selectedPricing = getSelectedPricingOption(product);
  const isFree = isProductFree(product);
  const isRecurring = isProductRecurring(product);

  if (isFree) {
    return {
      price: "Free",
      isFree: true,
      isRecurring: false,
      hasDiscount: false,
    };
  }

  const currentPrice = selectedPricing?.price || product.price;
  const originalPrice = selectedPricing?.compareAtPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  // Use currency from pricing plan or product, fallback to DZD
  const currency = selectedPricing?.currency || product.currency || "DZD";

  const formatPrice = (price: number) => {
    return baseFormatPrice(price, currency, locale);
  };

  let recurringText;
  if (isRecurring && selectedPricing?.recurringDays) {
    recurringText = `every ${selectedPricing.recurringDays} days`;
  } else if (isRecurring) {
    recurringText = "subscription";
  }

  return {
    price: formatPrice(currentPrice),
    originalPrice: hasDiscount ? formatPrice(originalPrice) : undefined,
    isFree,
    isRecurring,
    recurringText,
    hasDiscount: !!hasDiscount,
  };
}
