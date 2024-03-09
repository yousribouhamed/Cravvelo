import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cravvelo-admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative w-full `}>
        <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] light ">
          <Sidebar className="  lg:block lg:w-[250px] lg:fixed left-0  top-0  bottom-0 " />
          <main className=" w-full lg:w-[calc(100%-250px)] lg:mr-[250px]  px-10 ">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
