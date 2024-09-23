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

export const SIDE_BAR_ITEMS_EN = [
  {
    title: "Home",
    slug: "/",
    icon: LayoutGrid,
    subitems: [],
  },
  {
    title: "Courses",
    slug: "/courses",
    icon: Youtube,
    subitems: [],
  },
  // {
  //   title: "Digital Products",
  //   slug: "/products",
  //   icon: Box,
  //   subitems: [],
  // },

  {
    title: "Sales",
    slug: "/orders",
    icon: PiggyBank,
    subitems: [],
  },

  // {
  //   title: "Customize Academy",
  //   slug: "/customize",
  //   icon: Icons.customize,
  //   subitems: [
  //     {
  //       title: "Site Builder",
  //       icon: Icons.Home,
  //       slug: "/theme-editor",
  //     },
  //     {
  //       title: "Certificate Designer",
  //       icon: Icons.Home,
  //       slug: "/products",
  //     },
  //   ],
  // },

  {
    title: "Marketing",
    slug: "/marketing",
    icon: Megaphone,
    subitems: [
      {
        title: "Coupon Maker",
        slug: "/marketing/coupons",
      },
      {
        title: "Affiliate Marketing",
        slug: "/marketing/affiliate-marketing",
      },
    ],
  },

  {
    title: "Student Experience",
    slug: "/students",
    icon: Users,
    subitems: [
      {
        title: "Students",
        slug: "/students",
      },
      {
        title: "Certificates",
        slug: "/students/certificates",
      },
      {
        title: "Comments",
        slug: "/students/comments",
      },
      // {
      //   title: "Homeworks",
      //   icon: Icons.Home,
      //   slug: "/students/homeworks",
      // },
      // {
      //   title: "Exams",
      //   icon: Icons.Home,
      //   slug: "/students/exams",
      // },
      // {
      //   title: "Notifications",
      //   icon: Icons.Home,
      //   slug: "/students/notifications",
      // },
    ],
  },

  // {
  //   title: "Analytics",
  //   slug: "/analytics",
  //   icon: Icons.customize,
  //   subitems: [
  //     {
  //       title: "Products",
  //       icon: Icons.Home,
  //       slug: "/analytics/products",
  //     },
  //     {
  //       title: "Profits",
  //       icon: Icons.Home,
  //       slug: "/analytics/profits",
  //     },
  //     {
  //       title: "Customers",
  //       icon: Icons.Home,
  //       slug: "/analytics/customers",
  //     },
  //   ],
  // },

  {
    title: "Settings",
    icon: Settings,
    slug: "/settings/profile",
    // subitems: [
    //   {
    //     title: "Academy Settings",
    //     icon: Icons.Home,
    //     slug: "/settings",
    //   },
    //   {
    //     title: "Payment Methods",
    //     slug: "/settings/payments-methods",
    //   },
    //   {
    //     title: "Website Settings",
    //     slug: "/settings/website-settings",
    //   },
    // ],
  },
];

export const SETTING_SADEBAR_EN = [
  {
    name: "profile",
    url: "/settings/profile",
    icon: UserRoundPen,
  },
  {
    name: "academia",
    url: "/settings/academia",
    icon: Wrench,
  },
  {
    name: "appearance",
    url: "/settings/appearance",
    icon: Palette,
  },
  {
    name: "authorazations",
    url: "/settings/authorazations",
    icon: Shield,
  },
  {
    name: "domains",
    url: "/settings/domains",
    icon: Globe,
  },
  {
    name: "policy",
    url: "/settings/policy",
    icon: Globe,
  },
];
