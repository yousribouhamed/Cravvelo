import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import React from "react";
import WebsiteSettingsHeader from "../../../../modules/settings/components/website-settings-header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";

export default async function WebsiteSettingsLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="إعدادات الموقع"
        />
        <WebsiteSettingsHeader />
        {children}
      </main>
    </MaxWidthWrapper>
  );
}
