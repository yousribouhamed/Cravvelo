export const PLANS = [
  {
    plan: "الباقة الآساسية",
    plan_code: "BASIC",
    price: "1500",
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
        text: "1 دورات تدريبية",
      },
      {
        text: "عدد طلاب غير محدود",
      },
      {
        text: "1 منتجات رقمية",
      },
      {
        text: "اختبارات وواجبات",
      },

      {
        text: "بوابات دفع الكتروني",
      },
      {
        text: "التصميم الجميل لاكاديميتك",
      },
      {
        text: " نطاق خاص بك ",
      },
      {
        text: "تحسينات تحسين محركات البحث",
      },
      {
        text: "إزالة هوية cravvelo",
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
    price: "2490",
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
        text: "2 دورات تدريبية",
      },
      {
        text: "عدد طلاب غير محدود",
      },
      {
        text: "2 منتجات رقمية",
      },
      {
        text: "اختبارات وواجبات",
      },

      {
        text: "بوابات دفع الكتروني",
      },
      {
        text: "التصميم الجميل لاكاديميتك",
      },
      {
        text: " نطاق خاص بك ",
      },
      {
        text: "تحسينات تحسين محركات البحث",
      },
      {
        text: "إزالة هوية cravvelo",
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
    price: "6990",
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
        text: "6 دورات تدريبية",
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
        text: "بوابات دفع الكتروني",
      },
      {
        text: "التصميم الجميل لاكاديميتك",
      },
      {
        text: " نطاق خاص بك ",
      },
      {
        text: "تحسينات تحسين محركات البحث",
      },
      {
        text: "إزالة هوية cravvelo",
      },
    ],
  },
] as const;
