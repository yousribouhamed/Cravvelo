import { useTenant } from "@/contexts/tanant";

// Hook to get tenant's branding
export function useTenantBranding() {
  const { website } = useTenant();

  return {
    primaryColor: website?.color || "#FC6B00",
    logo: website?.logo,
    favicon: website?.favicon,
    name: website?.name || website?.Account.user_name,
    description: website?.description || website?.Account.user_bio,
    font: website?.font || "font-cal",
    customDomain: website?.customDomain,
    subdomain: website?.subdomain,
  };
}

// Hook to get tenant's settings
export function useTenantSettings() {
  const { website } = useTenant();

  return {
    showCoursesOnHome: website?.dCoursesHomeScreen ?? true,
    showProductsOnHome: website?.dDigitalProductsHomeScreen ?? false,
    itemsAlignment: website?.itemsAlignment ?? false,
    enableReferral: website?.enableReferral ?? false,
    enableSalesBanner: website?.enableSalesBanner ?? false,
    phoneNumber: website?.phoneNumber,
    supportEmail: website?.supportEmail,
    privacyPolicy: website?.privacy_policy,
    stamp: website?.stamp,
  };
}

// Hook to get account info
export function useTenantAccount() {
  const { website } = useTenant();

  return {
    id: website?.Account.id,
    userName: website?.Account.user_name,
    bio: website?.Account.user_bio,
    avatarUrl: website?.Account.avatarUrl,
    verified: website?.Account.verified,
    plan: website?.Account.plan,
    firstName: website?.Account.firstName,
    lastName: website?.Account.lastName,
    profession: website?.Account.profession,
    company: website?.Account.company,
    preferredLanguage: website?.Account.preferredLanguage,
    profileVisibility: website?.Account.profileVisibility,
  };
}
