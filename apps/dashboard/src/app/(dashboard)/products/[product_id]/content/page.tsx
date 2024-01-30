import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/layout/header";
import PathBuilder from "@/src/components/path-builder";
import useHaveAccess from "@/src/hooks/use-have-access";
import ProductsHeader from "@/src/components/products-header";
import ProductContentForm from "@/src/components/forms/product-forms/product-content-form";

export default async function Home() {
  const user = await useHaveAccess();
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col  justify-start">
        <Header goBack user={user} title="ui ux" />
        <ProductsHeader />
        <div className="w-full pt-8 min-h-[100px] ">
          <PathBuilder
            links={[
              {
                name: "الرئيسية",
                url: "/",
              },

              {
                name: "المنتجات الرقمية",
                url: "/products",
              },
            ]}
          />
          <ProductContentForm />
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
