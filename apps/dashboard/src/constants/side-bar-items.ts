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
    ],
  },
  {
    title: "الطلبات",
    slug: "/orders",
    icon: Icons.money,
    subitems: [],
  },
  {
    title: "تخصيص الأكاديمية",
    slug: "/cutomize",
    icon: Icons.customize,
    subitems: [],
  },

  {
    title: "الإعدادات",
    icon: Icons.settings,
    subitems: [],
    slug: "/settings",
  },
];
