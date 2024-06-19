import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import UpgradeButton from "@/src/app/(dashboard)/pricing/_compoents/upgradeButton";
import useGetUser from "@/src/hooks/use-get-user";
import PaymentSettingsHeader from "../settings/_compoents/payment-website-header";
import CurrentPlan from "./_compoents/current-plan";
import { prisma } from "database/src";
import BlackKing from "./_compoents/black-king";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Home() {
  const user = await useGetUser();

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header notifications={notifications} user={user} title="التسعير" />
        {user?.currentPlan !== "BLACK_KING" && <PaymentSettingsHeader />}
        {user.isSubscribed ? (
          user.currentPlan === "BLACK_KING" ? (
            <BlackKing />
          ) : (
            <CurrentPlan
              strategy={user.strategy}
              endSubscription={user.endSubscription}
              currentPlan={user.currentPlan}
            />
          )
        ) : (
          <UpgradeButton />
        )}
      </main>
    </MaxWidthWrapper>
  );
}
