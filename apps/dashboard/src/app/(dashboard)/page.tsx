import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { RevenueChart } from "@/src/modules/dashboard/components/revanew-chart";
import { getServerTranslations } from "@/src/lib/i18n/utils";
import { getUserLocale } from "@/src/services/locale";
import { getMainRevenueData } from "@/src/modules/analytics/actions/dashboard";

export default async function Page() {
  const user = await getMyUserAction();
  const t = await getServerTranslations("pages");
  const locale = await getUserLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  // Fetch initial revenue data
  const revenueData = await getMainRevenueData();

  return (
    <MaxWidthWrapper>
      <main>
        <Header notifications={notifications} user={user} title={t("home")} />

        <div dir={dir} className="my-4 w-full min-w-0 space-y-4 sm:space-y-6">
          <RevenueChart
            initialData={revenueData.success ? revenueData.data : undefined}
          />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
