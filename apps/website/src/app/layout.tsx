import "@ui/styles/globals.css";
import NavBar from "../components/layout/header/nav-bar";
import { Analytics } from "@vercel/analytics/react";
import { CrispChat } from "../components/crisp-chat";
import { constructMetadata } from "../lib/utils";

import { Toaster } from "react-hot-toast";

export const metadata = constructMetadata({
  title: "Cravvelo - أنشئ وبيع دوراتك بسهولة",
  description:
    "Cravvelo يمكنك من بناء أكاديميتك الخاصة عبر الإنترنت. بيع الدورات والمنتجات الرقمية، إدارة الطلاب، والاحتفاظ بجميع الأرباح من خلال منصتنا متعددة المستأجرين.",
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
      <CrispChat />
      <body className={"min-h-screen h-fit  bg-[#FAFAFA] w-full"}>
        <NavBar />
        <div className="  w-full h-fit min-h-full">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
