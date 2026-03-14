import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Product } from "database";
import { prisma } from "database/src";
import ProductsTableShell from "./products-table-shell";
import { getMyUserAction } from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";
import { getServerTranslations } from "@/src/lib/i18n/utils";

const PAGE_SIZE = 10;

const getData = async ({ accountId }: { accountId: string }) => {
  if (!accountId) return { products: [] as Product[], totalCount: 0, pageCount: 1, currentPage: 1 };
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: 0,
    }),
    prisma.product.count({ where: { accountId } }),
  ]);
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);
  return { products, totalCount, pageCount, currentPage: 1 };
};

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const Page = async ({}) => {
  const user = await getMyUserAction();
  const t = await getServerTranslations("pages");

  const [data, notifications] = await Promise.all([
    getData({ accountId: user.accountId }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  if (!user?.subdomain) {
    return <CreateAcademiaPage notifications={notifications} user={user} />;
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col justify-start ">
        <Header
          notifications={notifications}
          user={user}
          title={t("digitalProducts")}
        />

        <ProductsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
