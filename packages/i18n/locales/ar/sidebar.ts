import {
  Globe,
  LayoutGrid,
  Megaphone,
  Palette,
  PiggyBank,
  Settings,
  Shield,
  UserRoundPen,
  Users,
  Wrench,
  Youtube,
} from "lucide-react";
import { BookMarked } from "lucide-react";

export const SIDE_BAR_ITEMS_AR = [
  {
    title: "الرئيسية",
    slug: "/",
    icon: LayoutGrid,
    subitems: [],
  },
  {
    title: "الدورات التدريبية",
    slug: "/courses",
    icon: Youtube,
    subitems: [],
  },
  // {
  //   title: "المنتجات الرقمية",
  //   slug: "/products",
  //   icon: Box,
  //   subitems: [],
  // },

  {
    title: "المبيعات",
    slug: "/orders",
    icon: PiggyBank,
    subitems: [],
  },

  {
    title: "التسويق",
    slug: "/marketing",
    icon: Megaphone,
    subitems: [
      {
        title: "صانع القسائم",
        slug: "/marketing/coupons",
      },
      {
        title: "التسويق بالعمولة",
        slug: "/marketing/affiliate-marketing",
      },
    ],
  },

  {
    title: "تجربة الطلاب",
    slug: "/students",
    icon: Users,
    subitems: [
      {
        title: "الطلاب",

        slug: "/students",
      },
      {
        title: "الشهدات",

        slug: "/students/certificates",
      },

      {
        title: "التعليقات ",

        slug: "/students/comments",
      },
    ],
  },

  {
    title: "الإعدادات",
    slug: "/settings/profile",
    icon: Settings,
    subitems: [],
  },
];

export const SETTING_SADEBAR_AR = [
  {
    name: "الملف الشخصي",
    url: "/settings/profile",
    icon: UserRoundPen,
  },
  {
    name: "الأكاديمية",
    url: "/settings/academia",
    icon: Wrench,
  },
  {
    name: "المظهر",
    url: "/settings/appearance",
    icon: Palette,
  },
  {
    name: "التصاريح",
    url: "/settings/authorazations",
    icon: Shield,
  },
  {
    name: "النطاقات",
    url: "/settings/domains",
    icon: Globe,
  },
  {
    name: "السياسات",
    url: "/settings/policy",
    icon: Globe,
  },
];
