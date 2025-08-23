import MainSidebar from "@/components/main-sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="bg-background w-full h-screen flex overflow-hidden ">
      <MainSidebar />
      <div className="flex-1 w-full h-[97%] bg-card rounded-2xl m-2 border">
        {children}
      </div>
    </div>
  );
}
