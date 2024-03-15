import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import UpgradeButton from "@/src/app/(dashboard)/pricing/_compoents/upgradeButton";
import useGetUser from "@/src/hooks/use-get-user";
import PaymentSettingsHeader from "../settings/_compoents/payment-website-header";

export default async function Home() {
  const user = await useGetUser();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header user={user} title="التسعير" />
        <PaymentSettingsHeader />
        <UpgradeButton />
      </main>
    </MaxWidthWrapper>
  );
}
