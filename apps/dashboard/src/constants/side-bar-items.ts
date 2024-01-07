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
    slug: "/",
    icon: Icons.Home,
    subitems: [
      {
        title: "الدورات التدريبية",
        icon: Icons.Home,
        slug: "t-shirts",
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
    title: "مساق باي",
    icon: Icons.pay,
    subitems: [],
  },
  {
    title: "التسويق",
    icon: Icons.market,
    subitems: [],
  },

  {
    title: "تجربة الطلاب",

    icon: Icons.students,
    subitems: [],
  },
  {
    title: "التحليلات",
    icon: Icons.analylics,
    subitems: [],
  },
  {
    title: "سوق التطبيقات",
    icon: Icons.pice,
    subitems: [],
  },

  {
    title: "الإعدادات",
    icon: Icons.settings,
    subitems: [],
  },
];
