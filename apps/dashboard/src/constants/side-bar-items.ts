import { Icons } from "../components/Icons";

export const SIDE_BAR_ITEMS = [
  {
    title: "الرئيسية",
    slug: "/",
    icon: Icons.Home,
    subitems: [],
  },
  {
    title: "ادارة محتوى",
    slug: "/courses",
    icon: Icons.Academy,
    subitems: [
      {
        title: "الدورات التدريبية",
        icon: Icons.Home,
        slug: "/courses",
      },
      {
        title: "المنتجات الرقمية",
        icon: Icons.Home,
        slug: "hoodies",
      },
      {
        title: "الجلسات الاستشارية",
        icon: Icons.Home,
        slug: "pants",
      },
    ],
  },
  {
    title: "الطلبات",

    icon: Icons.money,
    subitems: [],
  },
  {
    title: "تخصيص الأكاديمية",

    icon: Icons.customize,
    subitems: [],
  },

  {
    title: "الإعدادات",
    icon: Icons.settings,
    subitems: [],
  },
];
