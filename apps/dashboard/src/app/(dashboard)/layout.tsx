import { Sidebar } from "@/src/components/SideBar";
import { redirect } from "next/navigation";

import { Metadata } from "next";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] ">
      <Sidebar className=" hidden md:block w-[250px] fixed right-5  top-0  bottom-0 " />

      <main className=" w-full md:w-[calc(100%-250px)] md:mr-[250px]  px-10 ">
        {children}
      </main>
    </div>
  );
}
