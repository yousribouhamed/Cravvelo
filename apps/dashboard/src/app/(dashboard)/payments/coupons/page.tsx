import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import CouponsTableShell from "./CouponsTableShell";
import { prisma } from "database/src";
import {
  getAllNotifications,
  getMyUserAction,
} from "@/src/actions/user.actions";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const Page = async () => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("coupons");

  const limit = 10;

  const [coupons, totalCount, notifications] = await Promise.all([
    prisma.coupon.findMany({
      where: {
        accountId: user.accountId,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.coupon.count({
      where: {
        accountId: user.accountId,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  const pageCount = Math.ceil(totalCount / limit);

  const initialData = {
    coupons,
    totalCount,
    pageCount,
    currentPage: 1,
  };

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("pageTitle")}
        />
        <CouponsTableShell initialData={initialData} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
