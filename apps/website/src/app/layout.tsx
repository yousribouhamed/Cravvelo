import "@ui/styles/globals.css";
import { NavBar } from "../components/layout/header/nav-bar";
import {Analytics} from "@vercel/analytics/react"
import { CrispChat } from "../components/crisp-chat";
import { constructMetadata } from "../lib/utils";

export const metadata = constructMetadata({
  title: "Cravvelo — أنشئ اكاديمية اونلاين وبع دوراتك وأستلم ارباحك",
  description:
    "تقدم Cravvelo تطبيقًا متعدد المستأجرين يسمح للمستخدمين بإنشاء منصة خاصة بهم حيث يمكنهم بيع دوراتهم التعليمية ومنتجاتهم الرقمية وإدارة طلابهم تحت علامتهم التجارية الخاصة. يمكنهم فرض رسوم على عملائهم / الطلاب بأسعار أعلى والاحتفاظ بجميع الأرباح لأنفسهم.",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      dir="rtl"
      lang="ar"
      className="!scroll-smooth"
    >
      {/* <CrispChat /> */}
      <body className={"min-h-screen h-fit  bg-[#FAFAFA] w-full"}>
        <NavBar />
        <div className="  w-full h-fit min-h-full">{children}</div>
      </body>
      {/* 
      <Script
        src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"
        async
      /> */}
      <Analytics />
    </html>
  );
}
