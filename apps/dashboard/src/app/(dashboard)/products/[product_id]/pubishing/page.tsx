import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ProductsHeader from "@/src/components/products-header";
import ProductPublishingForm from "@/src/components/forms/product-forms/product-publishing-form";
import { prisma } from "database/src";
import { notFound } from "next/navigation";

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

  if (!product) {
    notFound();
  }
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header goBack user={user} title="نشر المنتج" />
        <ProductsHeader />
        <div className="w-full pt-8 min-h-[100px] ">
          <ProductPublishingForm product={product} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
