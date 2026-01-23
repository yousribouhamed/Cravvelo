export const PLANS = [
  {
    plan_code: "BASIC",
    planKey: "plans.basic.name",
    price: "1500",
    imageUrl: "/pricing-icons/beginner.png",
    taglineKey: "plans.basic.tagline",
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
        textKey: "plans.basic.features.courses",
        count: 1,
      },
      {
        textKey: "plans.basic.features.unlimitedStudents",
      },
      {
        textKey: "plans.basic.features.digitalProducts",
        count: 1,
      },
      {
        textKey: "plans.basic.features.tests",
      },
      {
        textKey: "plans.basic.features.payment",
      },
      {
        textKey: "plans.basic.features.design",
      },
      {
        textKey: "plans.basic.features.domain",
      },
      {
        textKey: "plans.basic.features.seo",
      },
      {
        textKey: "plans.basic.features.removeBranding",
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
    planKey: "plans.advanced.name",
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
    taglineKey: "plans.advanced.tagline",
    quota: 10,
    features: [
      {
        textKey: "plans.advanced.features.courses",
        count: 2,
      },
      {
        textKey: "plans.advanced.features.unlimitedStudents",
      },
      {
        textKey: "plans.advanced.features.digitalProducts",
        count: 2,
      },
      {
        textKey: "plans.advanced.features.tests",
      },
      {
        textKey: "plans.advanced.features.payment",
      },
      {
        textKey: "plans.advanced.features.design",
      },
      {
        textKey: "plans.advanced.features.domain",
      },
      {
        textKey: "plans.advanced.features.seo",
      },
      {
        textKey: "plans.advanced.features.removeBranding",
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
    planKey: "plans.pro.name",
    price: "6990",
    taglineKey: "plans.pro.tagline",
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
        textKey: "plans.pro.features.courses",
        count: 6,
      },
      {
        textKey: "plans.pro.features.unlimitedStudents",
      },
      {
        textKey: "plans.pro.features.digitalProducts",
      },
      {
        textKey: "plans.pro.features.tests",
      },
      {
        textKey: "plans.pro.features.payment",
      },
      {
        textKey: "plans.pro.features.design",
      },
      {
        textKey: "plans.pro.features.domain",
      },
      {
        textKey: "plans.pro.features.seo",
      },
      {
        textKey: "plans.pro.features.removeBranding",
      },
    ],
  },
] as const;
