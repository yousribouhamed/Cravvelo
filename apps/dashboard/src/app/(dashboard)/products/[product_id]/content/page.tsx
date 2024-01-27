import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import Header from "@/src/components/Header";
import AddTextForm from "@/src/components/forms/course-forms/add-text-form";
import PathBuilder from "@/src/components/path-builder";

import useHaveAccess from "@/src/hooks/use-have-access";
import ProductsHeader from "@/src/components/products-header";

export default async function Home() {
  const { user } = await useHaveAccess();
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
          <h1>here we will make the form of the product</h1>
        </div>
      </main>
    </MaxWidthWrapper>
  );
}
