import {
  LayoutGrid,
  CreditCard,
  Settings,
  Users,
  GraduationCap,
  Puzzle,
  User,
  Palette,
  Receipt,
} from "lucide-react";

export const SIDE_BAR_ITEMS = [
  {
    title: "الرئيسية",
    slug: "/",
    icon: LayoutGrid, // Good choice - represents dashboard/overview
    subitems: [],
  },

  {
    title: "الدفع",
    slug: "/payments",
    icon: CreditCard, // Better than PiggyBank - more professional for payments
    subitems: [
      {
        title: "المدفوعات",
        icon: Receipt, // Better than Home - represents payment records
        slug: "/payments",
      },
      // {
      //   title: "صانع القسائم",
      //   icon: Tag, // Perfect for coupons/vouchers
      //   slug: "/payments/coupons",
      // },
      // {
      //   title: "التسويق بالعمولة",
      //   icon: Share2, // Great for affiliate marketing/sharing
      //   slug: "/payments/affiliate-marketing",
      // },
    ],
  },

  {
    title: "العملاء",
    slug: "/students",
    icon: Users, // Good choice for customers/users
    subitems: [
      {
        title: "الطلاب",
        icon: GraduationCap, // Much better than Home - specifically for students
        slug: "/students",
      },
    ],
  },

  {
    title: "التطبيقات",
    slug: "/applications",
    icon: Puzzle, // Better than LayoutGrid (duplicate) - represents apps/integrations
    subitems: [],
  },

  {
    title: "الإعدادات",
    icon: Settings, // Good choice
    slug: "/settings",
    subitems: [
      {
        title: "الحساب",
        icon: User, // Better than Home - represents user account
        slug: "/settings",
      },

      {
        title: "إعدادات الموقع",
        icon: Palette, // Perfect for appearance/website settings
        slug: "/settings/website-settings/appearance",
      },
    ],
  },
];
