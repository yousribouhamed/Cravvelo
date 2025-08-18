import { useTenant } from "@/contexts/tenant";

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

export function useTenantUser() {
  const { user } = useTenant();
  return user;
}

export function useIsAuthenticated() {
  const { user } = useTenant();
  return user !== null;
}
