export const PLANS = [
  {
    plan: "الباقة الآساسية",
    plan_code: "BASIC",
    price: "1999",
    imageUrl: "/pricing-icons/beginner.png",
    tagline:
      "إنشاء منصتك التعليمية ومنتجاتك الرقمية وبيعها وتسويقها عبر الإنترنت.",
    quota: 10,
    icon: () => (
      <svg
        width="49"
        height="50"
        viewBox="0 0 49 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 49.43H49V0.43H0V49.43Z" fill="black" />
      </svg>
    ),
    priceIds: {
      test: "price_1ObeduCxv0KQVM5xHees3z9n",
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
      test: "price_1Obef0Cxv0KQVM5xGGVkqWMS",
      production: "",
    },
    imageUrl: "/pricing-icons/infi.png",
    plan_code: "ADVANCED",
    plan: "باقة النمو",
    price: "4999",
    icon: () => (
      <svg
        width="49"
        height="50"
        viewBox="0 0 49 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 49.43H49V0.43H0V49.43Z" fill="black" />
      </svg>
    ),
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
      test: "price_1Obeg9Cxv0KQVM5x3qHaFrbs",
      production: "",
    },
    imageUrl: "/pricing-icons/pro.png",
    plan_code: "PRO",
    plan: "الباقة الاحترافية",
    price: "19999",
    tagline: "سعة غير محدودة وأدوات متقدمة تساعدك على التوسّع بعملك ومنتجاتك.",
    quota: 10,
    icon: () => (
      <svg
        width="49"
        height="50"
        viewBox="0 0 49 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 49.43H49V0.43H0V49.43Z" fill="black" />
      </svg>
    ),

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
