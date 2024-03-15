import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Payments } from "database";
import { prisma } from "database/src";
import BillingTableShell from "./billing-table-shell";
import useHaveAccess from "@/src/hooks/use-have-access";
import PaymentSettingsHeader from "../_compoents/payment-website-header";

async function getData(): Promise<Payments[]> {
  const data = await prisma.payments.findMany();
  return data;
}

const Page = async ({}) => {
  const user = await useHaveAccess();
  const data = await getData();

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="الفواتير" />
        <PaymentSettingsHeader />
        <BillingTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
