import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { RevenueChart } from "@/src/modules/dashboard/components/revanew-chart";

export default async function Page() {
  const user = await getMyUserAction();

  const notifications = await getAllNotifications({
    accountId: user?.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main>
        <Header notifications={notifications} user={user} title="الرئيسية" />

        <div dir={"ltr"} className="my-4 mx-auto space-y-6">
          {/* Example with data */}
          <RevenueChart />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
