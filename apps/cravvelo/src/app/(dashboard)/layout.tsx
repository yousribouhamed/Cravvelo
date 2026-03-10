import { ConfirmationModal } from "@/components/confirmation-modal";
import MainSidebar from "@/components/main-sidebar";
import { getCurrentAdmin } from "@/modules/auth/actions/auth.action";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const admin = await getCurrentAdmin();
  return (
    <div className="bg-zinc-100 w-full h-screen flex overflow-hidden">
      <MainSidebar admin={admin} />
      <div className="flex-1 w-full h-[97%] overflow-y-scroll bg-white rounded-xl m-2 border border-zinc-200 shadow-sm">
        {children}
      </div>

      <ConfirmationModal />
    </div>
  );
}
