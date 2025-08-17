import {
  Box,
  LayoutGrid,
  Megaphone,
  PiggyBank,
  Settings,
  Users,
  Youtube,
} from "lucide-react";
import { Icons } from "../components/my-icons";

export const SIDE_BAR_ITEMS = [
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
  {
    title: "المنتجات الرقمية",
    slug: "/products",
    icon: Box,
    subitems: [],
  },

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

  {
    title: "تجربة الطلاب",
    slug: "/students",
    icon: Users,
    subitems: [
      {
        title: "الطلاب",
        icon: Icons.Home,
        slug: "/students",
      },
      {
        title: "الشهدات",
        icon: Icons.Home,
        slug: "/students/certificates",
      },

      {
        title: "التعليقات ",
        icon: Icons.Home,
        slug: "/students/comments",
      },
      // {
      //   title: "الواجبات",
      //   icon: Icons.Home,
      //   slug: "/students/homeworks",
      // },
      // {
      //   title: "الاختبارات ",
      //   icon: Icons.Home,
      //   slug: "/students/exams",
      // },
      // {
      //   title: "الاشعارات",
      //   icon: Icons.Home,
      //   slug: "/students/notifications",
      // },
    ],
  },

  // {
  //   title: "التحليلات",
  //   slug: "/analytics",
  //   icon: Icons.customize,
  //   subitems: [
  //     {
  //       title: "المنتجات",
  //       icon: Icons.Home,
  //       slug: "/analytics/products",
  //     },
  //     {
  //       title: "الارباح",
  //       icon: Icons.Home,
  //       slug: "/analytics/profits",
  //     },
  //     {
  //       title: "العملاء",
  //       icon: Icons.Home,
  //       slug: "/analytics/customers",
  //     },
  //   ],
  // },

  {
    title: "الإعدادات",
    icon: Settings,
    slug: "/settings",
    subitems: [
      {
        title: "الاعدادات العامة",
        icon: Icons.Home,
        slug: "/settings",
      },
      {
        title: "الاشترك ",
        icon: Icons.Home,
        slug: "/pricing",
      },
      {
        title: "وسائل الدفع",
        icon: Icons.Home,
        slug: "/settings/payments-methods",
      },
      {
        title: "إعدادات الموقع",
        icon: Icons.Home,
        slug: "/settings/website-settings/appearance",
      },
    ],
  },
];
