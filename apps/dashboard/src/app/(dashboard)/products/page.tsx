import Header from "@/src/components/layout/header";
import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { prisma } from "database/src";
import ProductsTableShell from "./products-table-shell";
import { getMyUserAction } from "@/src/actions/user.actions";
import CreateAcademiaPage from "@/src/components/pages/create-academia.page";

const getData = async ({ accountId }: { accountId: string }) => {
  if (!accountId) {
    return;
  }
  const products = await prisma.product.findMany({
    where: {
      accountId,
    },
  });
  return products;
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
          title="المنتجات الرقمية"
        />

        <ProductsTableShell initialData={data} />
      </main>
    </MaxWidthWrapper>
  );
};

export default Page;
