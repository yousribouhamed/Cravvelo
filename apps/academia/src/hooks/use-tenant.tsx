import { useTenant } from "@/contexts/tenant";
import { useMemo, useCallback } from "react";
import { formatPrice as baseFormatPrice } from "@/lib/price";

export function useTenantBranding() {
  const { website } = useTenant();

  return {
    primaryColor: website?.primaryColor || "#FC6B00",
    primaryColorDark: website?.primaryColorDark || "#FC6B00",
    logo: website?.logo,
    favicon: website?.favicon,
    name: website?.name || website?.Account.user_name,
    description: website?.description || website?.Account.user_bio,

    customDomain: website?.customDomain,
    subdomain: website?.subdomain,
  };
}

export function useTenantCurrency() {
  const { website } = useTenant();

  const currency = website?.currency || "DZD";
  const currencySymbol = website?.currencySymbol || "DA";
  const language = website?.language || "ARABIC";
  
  // Determine locale based on language setting
  const locale = language === "ARABIC" ? "ar-DZ" : "en-US";

  const formatPrice = useCallback(
    (price: number): string => {
      return baseFormatPrice(price, currency, locale);
    },
    [currency, locale]
  );

  return useMemo(
    () => ({
      currency,
      currencySymbol,
      locale,
      formatPrice,
    }),
    [currency, currencySymbol, locale, formatPrice]
  );
}

export function useTenantSettings() {
  const { website } = useTenant();

  return {
    showCoursesOnHome: website?.dCoursesHomeScreen ?? true,
    showProductsOnHome: website?.dDigitalProductsHomeScreen ?? false,
    itemsAlignment: website?.itemsAlignment ?? false,
    enableReferral: website?.enableReferral ?? false,
    enableSalesBanner: website?.enableSalesBanner ?? false,
    enableWelcomeBanner: website?.enableWelcomeBanner ?? true,
    enableTestimonials: website?.enableTestimonials ?? true,
    enableContactForm: website?.enableContactForm ?? true,
    enableNewsletterSignup: website?.enableNewsletterSignup ?? false,
    enableBlog: website?.enableBlog ?? false,
    phoneNumber: website?.phoneNumber,
    supportEmail: website?.supportEmail,
    address: website?.address,
    privacyPolicy: website?.privacy_policy,
    stamp: website?.stamp,
  };
}

export function useTenantThemeStyles() {
  const { website } = useTenant();
  const theme = (website?.themeCustomization ?? {}) as Record<string, string | undefined>;
  return {
    bannerStyle: theme.bannerStyle ?? "DEFAULT",
    courseCardStyle: theme.courseCardStyle ?? "DEFAULT",
    productCardStyle: theme.productCardStyle ?? "DEFAULT",
    coursePlayerStyle: theme.coursePlayerStyle ?? "DEFAULT",
    authFormStyle: theme.authFormStyle ?? "DEFAULT",
    profileStyle: theme.profileStyle ?? "DEFAULT",
  };
}

export function useTenantAccount() {
  const { website } = useTenant();

  return {
    id: website?.Account.id,
    userName: website?.Account.user_name,
    bio: website?.Account.user_bio,
    avatarUrl: website?.Account.avatarUrl,
    verified: website?.Account.verified,
    firstName: website?.Account.firstName,
    lastName: website?.Account.lastName,
    profession: website?.Account.profession,
    company: website?.Account.company,
    preferredLanguage: website?.Account.preferredLanguage,
    profileVisibility: website?.Account.profileVisibility,
  };
}

export function useTenantUser() {
  const { user } = useTenant();
  return user;
}

export function useIsAuthenticated() {
  const { user } = useTenant();
  return user !== null;
}
