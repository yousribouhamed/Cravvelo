import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import PaymentMethodsConnectors from "@/src/components/payments/payment-methods-connector";
import useHaveAccess from "@/src/hooks/use-have-access";

const Page = async ({}) => {
  const user = await useHaveAccess();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="بوابات الدفع" />
        <PaymentMethodsConnectors />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
