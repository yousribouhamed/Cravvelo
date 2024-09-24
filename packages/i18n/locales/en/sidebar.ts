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
    ],
  },

  {
    title: "Settings",
    slug: "/settings/profile",
    icon: Settings,
    subitems: [],
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
    icon: BookMarked,
  },
];
