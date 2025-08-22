import { PaymentPricingOption, PaymentProduct } from "../types";

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
}

export function courseToPaymentProduct(
  params: CourseToPaymentProductParams
): PaymentProduct {
  const { course } = params;

  // Convert pricing plans to payment pricing options
  const pricingOptions: PaymentPricingOption[] =
    course.CoursePricingPlans?.map((cp) => ({
      id: cp.PricingPlan.id,
      name: cp.PricingPlan.name,
      description: cp.PricingPlan.description || undefined,
      pricingType: cp.PricingPlan.pricingType,
      price: cp.PricingPlan.price,
      compareAtPrice: cp.PricingPlan.compareAtPrice,
      currency: cp.PricingPlan.currency,
      accessDuration: cp.PricingPlan.accessDuration || undefined,
      accessDurationDays: cp.PricingPlan.accessDurationDays,
      recurringDays: cp.PricingPlan.recurringDays,
      isDefault: cp.isDefault,
      isActive: cp.PricingPlan.isActive,
    })) || [];

  // Find default pricing option
  const defaultPricing = pricingOptions.find((option) => option.isDefault);
  const mainPrice = defaultPricing?.price || 0;

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

  return {
    id: course.id,
    name: course.title,
    description,
    price: mainPrice,
    currency: defaultPricing?.currency || "DZD",
    image: course.thumbnailUrl || undefined,
    pricingOptions,
    selectedPricingId: defaultPricing?.id,
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
export function formatPricingDisplay(product: PaymentProduct): {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-DZ", {
      style: "currency",
      currency: selectedPricing?.currency || product.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
