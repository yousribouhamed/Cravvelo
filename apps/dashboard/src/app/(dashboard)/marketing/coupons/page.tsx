import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import CouponsTableShell from "./CouponsTableShell";
import { prisma } from "database/src";

const Page = async () => {
  const user = await useHaveAccess();

  const coupons = await prisma.coupon.findMany({
    where: {
      accountId: user.accountId,
    },
  });

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header user={user} title="صانع القسائم" />
        <CouponsTableShell initialData={coupons} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
