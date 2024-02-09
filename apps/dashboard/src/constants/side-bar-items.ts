import { Icons } from "../components/my-icons";

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
        slug: "/theme-editor",
      },
      {
        title: "مصمم الشهادة",
        icon: Icons.Home,
        slug: "/products",
      },
    ],
  },

  {
    title: "التسويق",
    slug: "/marketing",
    icon: Icons.customize,
    subitems: [
      {
        title: "كبونات الخصم",
        icon: Icons.Home,
        slug: "/coupons",
      },
      {
        title: "التسويق بالعمولة",
        icon: Icons.Home,
        slug: "/",
      },
    ],
  },

  {
    title: "تجربة الطلاب",
    slug: "/marketing",
    icon: Icons.customize,
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
      {
        title: "الواجبات",
        icon: Icons.Home,
        slug: "/students/homeworks",
      },
      {
        title: "الاختبارات ",
        icon: Icons.Home,
        slug: "/students/exams",
      },
      {
        title: "الاشعارات",
        icon: Icons.Home,
        slug: "/students/notifications",
      },
    ],
  },

  {
    title: "التحليلات",
    slug: "/marketing",
    icon: Icons.customize,
    subitems: [
      {
        title: "المنتجات",
        icon: Icons.Home,
        slug: "/analytics/products",
      },
      {
        title: "الارباح",
        icon: Icons.Home,
        slug: "/analytics/profits",
      },
      {
        title: "العملاء",
        icon: Icons.Home,
        slug: "/analytics/customers",
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
        slug: "/settings",
      },
      {
        title: "وسائل الدفع",
        icon: Icons.Home,
        slug: "/settings/payments-methods",
      },
      {
        title: "إعدادات الموقع",
        icon: Icons.Home,
        slug: "/settings/website-settings",
      },
      {
        title: "باقة الأكاديمية",
        icon: Icons.Home,
        slug: "/pricing",
      },
    ],
    slug: "/settings",
  },
];
