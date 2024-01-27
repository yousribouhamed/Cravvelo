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
        slug: "/products",
      },
      {
        title: "مكتبة الفيديو",
        icon: Icons.Home,
        slug: "/video-library",
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
    subitems: [
      {
        title: "منشئ الموقع",
        icon: Icons.Home,
        slug: "/editor",
      },
      {
        title: "مصمم الشهادة",
        icon: Icons.Home,
        slug: "/products",
      },
    ],
  },

  {
    title: "الإعدادات",
    icon: Icons.settings,
    subitems: [
      {
        title: "إعدادات الاكاديمية",
        icon: Icons.Home,
        slug: "/courses",
      },
      {
        title: "وسائل الدفع",
        icon: Icons.Home,
        slug: "/products",
      },
      {
        title: "باقة الأكاديمية",
        icon: Icons.Home,
        slug: "/products",
      },
    ],
    slug: "/settings",
  },
];
