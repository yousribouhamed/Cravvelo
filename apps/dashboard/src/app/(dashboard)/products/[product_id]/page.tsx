import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import { notFound, redirect } from "next/navigation";
import { prisma } from "database/src";
import useHaveAccess from "@/src/hooks/use-have-access";

interface PageProps {
  params: { product_id: string };
}

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

export default async function Page({ params }: PageProps) {
  const user = await useHaveAccess();

  const [product, notifications] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: params.product_id,
      },
    }),
    getAllNotifications({ accountId: user.accountId }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header
          notifications={notifications}
          goBack
          user={user}
          title="ui ux"
        />

        <div className="w-full min-h-[500px] grid grid-cols-3">
          <h1>
            in this page we will display the data we need about this product
          </h1>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
