import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import React from "react";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import GenericHeader from "@/src/components/generic-header";

export default async function ProfileLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="إعدادات الموقع"
        />

        <GenericHeader
          links={[
            { href: "/profile", name: "profile" },
            { href: "/profile/subscription", name: "subscription" },
          ]}
        />

        {children}
      </main>
    </MaxWidthWrapper>
  );
}
