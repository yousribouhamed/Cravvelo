import ProfileSidebar from "@/modules/profile/components/sidebar";
import React from "react";

export default function ProfileLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="w-full h-fit min-h-[400px] grid grid-cols-4 gap-4 py-8">
      <ProfileSidebar />

      <div className="col-span-3 h-full">{children}</div>
    </div>
  );
}
