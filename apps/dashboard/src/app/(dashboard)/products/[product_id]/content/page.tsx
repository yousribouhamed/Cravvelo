import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import Header from "@/src/components/layout/header";
import useHaveAccess from "@/src/hooks/use-have-access";
import ProductsHeader from "@/src/components/products-header";
import ProductContentForm from "@/src/components/forms/product-forms/product-content-form";

export default async function Home() {
  const user = await useHaveAccess();
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header goBack user={user} title="محتوى المنتج" />
        <ProductsHeader />
        <div className="w-full pt-8 min-h-[100px] ">
          <ProductContentForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
