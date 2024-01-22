import { Sidebar } from "@/src/components/SideBar";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import SubscripeButton from "@/src/components/subscripe-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] ">
      <Sidebar className="  lg:block lg:w-[250px] lg:fixed right-5  top-0  bottom-0 " />

      <main className=" w-full lg:w-[calc(100%-250px)] lg:mr-[250px]  px-10 ">
        {children}
      </main>
      {/* <SubscripeButton /> */}
    </div>
  );
}
