import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import useHaveAccess from "@/src/hooks/use-have-access";
import PaymentSettingsHeader from "@/src/modules/settings/components/payment-website-header";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async ({}) => {
  const user = await useHaveAccess();
  const t = await getServerTranslations("pages");

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={[]} user={user} title={t("billing")} />
        <PaymentSettingsHeader />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
