import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ProductsHeader from "@/src/components/products-header";
import { prisma } from "database/src";
import { notFound } from "next/navigation";
import ProductPricingForm from "@/src/components/forms/product-forms/product-pricing-form";

const getAllNotifications = async ({ accountId }: { accountId: string }) => {
  const notifications = await prisma.notification.findMany({
    where: {
      accountId,
    },
  });
  return notifications;
};

const getData = async ({ id }: { id: string }) => {
  try {
    const data = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    return data;
  } catch (err) {
    console.error(err);
  }
};

interface PageProps {
  params: { product_id: string };
}

export default async function Page({ params }: PageProps) {
  const [user, product] = await Promise.all([
    useHaveAccess(),
    getData({ id: params.product_id }),
  ]);

  const notifications = await getAllNotifications({
    accountId: user.accountId,
  });

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
          title="تسعير المنتجات"
        />
        <ProductsHeader />
        <div className="w-full pt-8 min-h-[100px] ">
          <ProductPricingForm product={product} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
