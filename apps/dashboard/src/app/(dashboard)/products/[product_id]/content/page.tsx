import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ProductsHeader from "@/src/components/products-header";
import ProductContentForm from "@/src/components/forms/product-forms/product-content-form";
import { notFound } from "next/navigation";
import { prisma } from "database/src";

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
        <Header goBack user={user} title="محتوى المنتج" />
        <ProductsHeader />
        <div className="w-full pt-8 min-h-[100px] ">
          <ProductContentForm product={product} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
