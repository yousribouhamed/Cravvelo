export type SubscriptionPlanCode = "BASIC" | "STARTER" | "GROWTH" | "SCALE";

export interface SubscriptionPlanFeature {
  text: string;
  i18nKey?: string;
}

export interface SubscriptionPlan {
  planCode: SubscriptionPlanCode;
  name: string;
  nameKey: string;
  tagline: string;
  taglineKey: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: SubscriptionPlanFeature[];
  highlight?: boolean;
  highlightLabelKey?: string;
  ctaSubtextKey?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    planCode: "BASIC",
    name: "Basic",
    nameKey: "subscription.plans.basic.name",
    tagline: "For beginners.",
    taglineKey: "subscription.plans.basic.tagline",
    priceMonthly: 1000,
    priceYearly: 10000,
    currency: "DZD",
    features: [
      { text: "1 workspace", i18nKey: "subscription.features.workspace1" },
      { text: "Up to 50 members", i18nKey: "subscription.features.members50" },
      { text: "2GB storage", i18nKey: "subscription.features.storage2gb" },
      { text: "10GB video bandwidth", i18nKey: "subscription.features.bandwidth10gb" },
      { text: "Courses only", i18nKey: "subscription.features.coursesOnly" },
      { text: "Standard support", i18nKey: "subscription.features.standardSupport" },
      { text: "Sell products (unlock payments)", i18nKey: "subscription.features.sellProducts" },
    ],
  },
  {
    planCode: "STARTER",
    name: "Starter",
    nameKey: "subscription.plans.starter.name",
    tagline: "For small creators.",
    taglineKey: "subscription.plans.starter.tagline",
    priceMonthly: 4370,
    priceYearly: 43700,
    currency: "DZD",
    features: [
      { text: "1 workspace", i18nKey: "subscription.features.workspace1" },
      { text: "Up to 500 members", i18nKey: "subscription.features.members500" },
      { text: "10GB storage", i18nKey: "subscription.features.storage10gb" },
      { text: "50GB video bandwidth", i18nKey: "subscription.features.bandwidth50gb" },
      { text: "Courses OR Products", i18nKey: "subscription.features.coursesOrProducts" },
      { text: "Standard support", i18nKey: "subscription.features.standardSupport" },
      { text: "Sell products (unlock payments)", i18nKey: "subscription.features.sellProducts" },
    ],
  },
  {
    planCode: "GROWTH",
    name: "Growth",
    nameKey: "subscription.plans.growth.name",
    tagline: "For serious businesses.",
    taglineKey: "subscription.plans.growth.tagline",
    priceMonthly: 13570,
    priceYearly: 135700,
    currency: "DZD",
    highlight: true,
    highlightLabelKey: "mostPopular",
    features: [
      { text: "1 workspace", i18nKey: "subscription.features.workspace1" },
      { text: "Up to 5,000 members", i18nKey: "subscription.features.members5000" },
      { text: "100GB storage", i18nKey: "subscription.features.storage100gb" },
      { text: "500GB video bandwidth", i18nKey: "subscription.features.bandwidth500gb" },
      { text: "Courses + Products + Affiliate", i18nKey: "subscription.features.coursesProductsAffiliate" },
      { text: "Custom domain", i18nKey: "subscription.features.customDomain" },
      { text: "Priority support", i18nKey: "subscription.features.prioritySupport" },
    ],
  },
  {
    planCode: "SCALE",
    name: "Scale",
    nameKey: "subscription.plans.scale.name",
    tagline: "For agencies / heavy sellers.",
    taglineKey: "subscription.plans.scale.tagline",
    priceMonthly: 34270,
    priceYearly: 342700,
    currency: "DZD",
    features: [
      { text: "1 workspace", i18nKey: "subscription.features.workspace1" },
      { text: "Up to 20,000 members", i18nKey: "subscription.features.members20000" },
      { text: "500GB storage", i18nKey: "subscription.features.storage500gb" },
      { text: "2TB bandwidth", i18nKey: "subscription.features.bandwidth2tb" },
      { text: "Everything unlocked", i18nKey: "subscription.features.everythingUnlocked" },
      { text: "Dedicated support", i18nKey: "subscription.features.dedicatedSupport" },
      { text: "Early access to new features", i18nKey: "subscription.features.earlyAccess" },
    ],
  },
];
