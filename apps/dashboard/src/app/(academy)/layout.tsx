import { Sidebar } from "@/src/components/SideBar";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import SubscripeButton from "@/src/components/subscripe-button";
import AcademyHeader from "@/src/components/academy-components/academy-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen gap-x-2 flex-col ">
      <main className=" ">{children}</main>
      {/* <SubscripeButton /> */}
    </div>
  );
}
