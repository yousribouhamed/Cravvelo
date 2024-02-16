import ChargilyConnector from "@/src/components/payments/chargily-connector";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";

interface PageProps {}

const PageProps = async ({}) => {
  const user = await useHaveAccess();
  return (
    <MaxWidthWrapper>
      <main className="w-full min-h-screen h-fit flex flex-col justify-start ">
        <Header user={user} title="بوابات الدفع" />
        <ChargilyConnector />
      </main>
    </MaxWidthWrapper>
  );
};

export default PageProps;
