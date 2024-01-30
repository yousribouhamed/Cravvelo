export const PLANS = [
  {
    plan: "الباقة الآساسية",
    plan_code: "BASIC",
    price: "10",
    tagline:
      "إنشاء منصتك التعليمية ومنتجاتك الرقمية وبيعها وتسويقها عبر الإنترنت.",
    quota: 10,
    priceIds: {
      test: "price_1NvyXVCxv0KQVM5xCieMmhkZ",
      production: "",
    },

    features: [
      {
        text: "3 دورات تدريبية",
      },
      {
        text: "عدد طلاب غير محدود",
      },
      {
        text: "3 منتجات رقمية",
      },
      {
        text: "اختبارات وواجبات",
      },
      {
        text: "تخصيص تصميم شهادة واحدة",
      },

      {
        text: "بوابات دفع الكتروني",
      },
      {
        text: "إزالة هوية جدارة",
        negative: true,
      },
    ],
  },

  {
    priceIds: {
      test: "price_1NvyXVCxv0KQVM5xCieMmhkZ",
      production: "",
    },
    plan_code: "ADVANCED",
    plan: "باقة النمو",
    price: "18",
    tagline:
      "ارتقِ بمستوى عملك من خلال ميزات تساعدك على تحقيق نمو فائق السرعة.",
    quota: 10,

    features: [
      {
        text: "10 دورات تدريبية",
      },
      {
        text: "عدد طلاب غير محدود",
      },
      {
        text: "10 منتجات رقمية",
      },
      {
        text: "اختبارات وواجبات",
      },
      {
        text: "تخصيص تصميم 3 شهادات",
      },

      {
        text: "بوابات دفع الكتروني",
      },
      {
        text: "إزالة هوية جدارة",
        negative: true,
      },
    ],
  },

  {
    priceIds: {
      test: "price_1NvyXVCxv0KQVM5xCieMmhkZ",
      production: "",
    },
    plan_code: "PRO",
    plan: "الباقة الاحترافية",
    price: "28",
    tagline: "سعة غير محدودة وأدوات متقدمة تساعدك على التوسّع بعملك ومنتجاتك.",
    quota: 10,

    features: [
      {
        text: "عدد دورات غير محدود",
      },
      {
        text: "عدد طلاب غير محدود",
      },
      {
        text: "منتجات رقمية غير محدودة",
      },
      {
        text: "اختبارات وواجبات",
      },
      {
        text: "تخصيص تصميم 10 شهادات",
      },

      {
        text: "بوابات دفع الكتروني",
      },
      {
        text: "إزالة هوية جدارة",
      },
    ],
  },
] as const;
