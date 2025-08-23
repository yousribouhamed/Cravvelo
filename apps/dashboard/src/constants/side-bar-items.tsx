import { LayoutGrid, PiggyBank, Settings, Users } from "lucide-react";
import { Icons } from "../components/my-icons";

export const SIDE_BAR_ITEMS = [
  {
    title: "الرئيسية",
    slug: "/",
    icon: LayoutGrid,
    subitems: [],
  },
  // {
  //   title: "الدورات التدريبية",
  //   slug: "/courses",
  //   icon: Youtube,
  //   subitems: [],
  // },
  // {
  //   title: "المنتجات الرقمية",
  //   slug: "/products",
  //   icon: Box,
  //   subitems: [],
  // },

  {
    title: "الدفع",
    slug: "/orders",
    icon: PiggyBank,
    subitems: [
      {
        title: "صانع القسائم",
        icon: Icons.Home,
        slug: "/marketing/coupons",
      },
      {
        title: "التسويق بالعمولة",
        icon: Icons.Home,
        slug: "/marketing/affiliate-marketing",
      },
    ],
  },

  // {
  //   title: "التسويق",
  //   slug: "/marketing",
  //   icon: Megaphone,
  //   subitems: [
  //     {
  //       title: "صانع القسائم",
  //       icon: Icons.Home,
  //       slug: "/marketing/coupons",
  //     },
  //     {
  //       title: "التسويق بالعمولة",
  //       icon: Icons.Home,
  //       slug: "/marketing/affiliate-marketing",
  //     },
  //   ],
  // },

  {
    title: "العملاء",
    slug: "/students",
    icon: Users,
    subitems: [
      {
        title: "الطلاب",
        icon: Icons.Home,
        slug: "/students",
      },
    ],
  },

  {
    title: "الإعدادات",
    icon: Settings,
    slug: "/settings",
    subitems: [
      {
        title: "الحساب",
        icon: Icons.Home,
        slug: "/settings",
      },

      {
        title: "إعدادات الموقع",
        icon: Icons.Home,
        slug: "/settings/website-settings/appearance",
      },
    ],
  },
];
