import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import UpgradeButton from "@/src/app/(dashboard)/pricing/_compoents/upgradeButton";
import useGetUser from "@/src/hooks/use-get-user";
import PaymentSettingsHeader from "../settings/_compoents/payment-website-header";
import CurrentPlan from "./_compoents/current-plan";

export default async function Home() {
  const user = await useGetUser();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header notifications={[]} user={user} title="التسعير" />
        <PaymentSettingsHeader />
        {user.isSubscribed ? (
          <CurrentPlan
            strategy={user.strategy}
            endSubscription={user.endSubscription}
            currentPlan={user.currentPlan}
          />
        ) : (
          <UpgradeButton />
        )}
      </main>
    </MaxWidthWrapper>
  );
}
