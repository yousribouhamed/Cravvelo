import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CouponsTableShell from "./CouponsTableShell";
import { prisma } from "database/src";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";

const Page = async () => {
  const user = await getMyUserAction();

  const [coupons, notifications] = await Promise.all([
    prisma.coupon.findMany({
      where: {
        accountId: user.accountId,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title="صانع القسائم"
        />
        <CouponsTableShell initialData={coupons} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
