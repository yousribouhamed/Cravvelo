import { Sidebar } from "@/src/components/SideBar";

import { Metadata } from "next";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen gap-x-2 bg-[#FAFAFA] ">
      <Sidebar className=" hidden md:block w-[250px] fixed right-5  top-0  bottom-0 " />

      <main className=" w-full md:w-[calc(100%-250px)] md:mr-[200px]  ">
        {children}
      </main>
    </div>
  );
}
