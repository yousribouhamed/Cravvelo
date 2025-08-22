import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import RevenueChartWrapper from "@/src/modules/dashboard/components/chart-wrapper";
import { RevenueChart } from "@/src/modules/dashboard/components/revanew-chart";

export default async function Page() {
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sampleData = [
    { time: "2025-08-21T09:00:00", value: 1200 },
    { time: "2025-08-21T12:00:00", value: 1850 },
    { time: "2025-08-21T15:00:00", value: 2100 },
    { time: "2025-08-21T18:00:00", value: 1650 },
    { time: "2025-08-20T10:00:00", value: 1400 },
    { time: "2025-08-20T14:00:00", value: 1900 },
    { time: "2025-08-20T17:00:00", value: 1750 },
    { time: "2025-08-19T11:00:00", value: 1300 },
    { time: "2025-08-19T16:00:00", value: 1600 },
  ];

  return (
    <MaxWidthWrapper>
      <main>
        <Header notifications={notifications} user={user} title="الرئيسية" />

        <div dir={"ltr"} className="my-4 mx-auto space-y-6">
          {/* Example with data */}
          <RevenueChart initialData={sampleData} currency="DZD" />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
