import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import React from "react";
import WebsiteSettingsHeader from "../../../../modules/settings/components/website-settings-header";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import { getServerTranslations } from "@/src/lib/i18n/utils";

export default async function WebsiteSettingsLayout({
  children,
}: React.PropsWithChildren) {
  try {
    const user = await getMyUserAction();
    const t = await getServerTranslations("pages");

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
            title={t("websiteSettings")}
          />
          <WebsiteSettingsHeader />
          {children}
        </main>
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error("Error in WebsiteSettingsLayout:", error);
    // Redirect to sign-in on authentication errors
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
  }
}
