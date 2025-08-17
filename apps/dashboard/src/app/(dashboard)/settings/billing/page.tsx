import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import PaymentSettingsHeader from "@/src/modules/settings/components/payment-website-header";
import { getMyUserAction } from "@/src/actions/user.actions";

const Page = async ({}) => {
  const user = await getMyUserAction();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header notifications={[]} user={user} title="الفواتير" />
        <PaymentSettingsHeader />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
