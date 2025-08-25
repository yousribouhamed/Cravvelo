import MainSidebar from "@/components/main-sidebar";
import { getCurrentAdmin } from "@/modules/auth/actions/auth.action";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const admin = await getCurrentAdmin();
  return (
    <div className="bg-background w-full h-screen flex overflow-hidden ">
      <MainSidebar admin={admin} />
      <div className="flex-1 w-full h-[97%] overflow-y-scroll bg-card rounded-2xl m-2 border">
        {children}
      </div>
    </div>
  );
}
