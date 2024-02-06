import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import UpgradeButton from "@/src/app/(dashboard)/pricing/_compoents/upgradeButton";
import useHaveAccess from "@/src/hooks/use-have-access";

export default async function Home() {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start">
        <Header user={user} title="الرئيسية" />
        <UpgradeButton />
      </main>
    </MaxWidthWrapper>
  );
}
